import { DurableObject } from "cloudflare:workers";
import {
	ApiError,
	CreateGameRequest,
	CreateGameResponse,
	FactionMetadata,
	FactionState,
	FactionView,
	GameState,
	GameView,
	PlanetMetadata,
	PlanetState,
	PlanetView,
	SectorMetadata,
} from "../api";

export class GamesDurableObject extends DurableObject<Env> {
	state: DurableObjectState;
	env: Env;
	constructor(ctx: DurableObjectState, env: Env) {
		// Required, as we're extending the base class.
		super(ctx, env);
		this.state = ctx;
		this.env = env;
	}

	async create(
		gameId: string,
		request: CreateGameRequest & { creatorId: string },
	): Promise<CreateGameResponse> {
		// Create initial model and views
		let sectorCount: number;
		switch (request.galaxySize) {
			case "Small":
				sectorCount = 10;
				break;
			case "Medium":
				sectorCount = 15;
				break;
			default:
				sectorCount = 20;
				break;
		}

		// Create sectors with metadata
		const sectors: Record<string, SectorMetadata> = {};
		const planets: Record<string, PlanetState> = {};

		// Generate sectors and planets
		for (let i = 0; i < sectorCount; i++) {
			const sectorId = `sector-${i + 1}`;
			const isInnerRim = i < sectorCount / 3; // First third are inner rim

			// Create sector metadata
			const sectorMetadata: SectorMetadata = {
				id: sectorId,
				name: `Sector ${i + 1}`,
				location: {
					x: Math.random(),
					y: Math.random(),
				},
				isInnerRim,
				planetIds: [],
			};

			// Create 10 planets per sector
			for (let j = 0; j < 10; j++) {
				const planetId = `planet-${i + 1}-${j + 1}`;
				sectorMetadata.planetIds.push(planetId);

				// Create planet metadata
				const planetMetadata: PlanetMetadata = {
					id: planetId,
					name: `Planet ${i + 1}-${j + 1}`,
					sectorId,
					picture: `planet-${((i * 10 + j) % 20) + 1}.png`, // Cycle through 20 planet images
					size: Math.random() * 0.5 + 0.5, // Size between 0.5 and 1.0
					position: {
						x: Math.random(),
						y: Math.random(),
					},
				};

				// Create planet state
				const planetState: PlanetState = {
					metadata: planetMetadata,
					loyalty: Math.floor(Math.random() * 100),
					owner:
						Math.random() < 0.2
							? "Empire"
							: Math.random() < 0.5
								? "Rebellion"
								: "Neutral",
					energySpots: Math.floor(Math.random() * 10),
					naturalResources: Math.floor(Math.random() * 10),
					garrisonRequirement: Math.floor(Math.random() * 5) + 1,
					inUprising: Math.random() < 0.1, // 10% chance of uprising
					general: null,
					commander: null,
					isDiscovered: isInnerRim, // Inner rim planets start discovered
				};

				planets[planetId] = planetState;
			}

			sectors[sectorId] = sectorMetadata;
		}

		// Create faction states
		const factions: Record<FactionMetadata, FactionState> = {
			Empire: {
				resources: {
					mines: 100,
					refineries: 100,
					refined: 100,
				},
				objectives: ["Capture Rebellion HQ", "Control 75% of planets"],
				controlledPlanetIds: Object.keys(planets).filter(
					(id) => planets[id].owner === "Empire",
				),
			},
			Rebellion: {
				resources: {
					mines: 80,
					refineries: 80,
					refined: 80,
				},
				objectives: ["Defeat Imperial forces", "Liberate 75% of planets"],
				controlledPlanetIds: Object.keys(planets).filter(
					(id) => planets[id].owner === "Rebellion",
				),
			},
		};

		// Create the game state (source of truth)
		const gameState: GameState = {
			id: gameId,
			turn: 1,
			planets,
			sectors,
			factions,
			notifications: [],
		};

		// Create faction-specific views
		const views: Record<FactionMetadata, GameView> = {
			Empire: (() => {
				const faction = "Empire" as FactionMetadata;
				const planetViews: Record<string, PlanetView> = {};

				for (const [planetId, planetState] of Object.entries(planets)) {
					const isOwner = planetState.owner === faction;
					const isDiscovered = planetState.isDiscovered || isOwner;

					const planetView: PlanetView = {
						metadata: planetState.metadata,
						discovered: isDiscovered,
					};

					if (isDiscovered) {
						planetView.state = {
							loyalty: isOwner ? planetState.loyalty : undefined,
							owner: planetState.owner,
							energySpots: planetState.energySpots,
							naturalResources: planetState.naturalResources,
							garrisonRequirement: isOwner
								? planetState.garrisonRequirement
								: undefined,
							inUprising: isOwner ? planetState.inUprising : undefined,
							general: isOwner ? planetState.general : undefined,
							commander: isOwner ? planetState.commander : undefined,
						};
					}

					planetViews[planetId] = planetView;
				}

				const factionView: FactionView = {
					resources: factions[faction].resources,
					objectives: factions[faction].objectives,
				};

				return {
					id: gameId,
					turn: 1,
					planets: planetViews,
					sectors,
					faction: factionView,
					side: faction,
					notifications: [],
				};
			})(),
			Rebellion: (() => {
				const faction = "Rebellion" as FactionMetadata;
				const planetViews: Record<string, PlanetView> = {};

				for (const [planetId, planetState] of Object.entries(planets)) {
					const isOwner = planetState.owner === faction;
					const isDiscovered = planetState.isDiscovered || isOwner;

					const planetView: PlanetView = {
						metadata: planetState.metadata,
						discovered: isDiscovered,
					};

					if (isDiscovered) {
						planetView.state = {
							loyalty: isOwner ? planetState.loyalty : undefined,
							owner: planetState.owner,
							energySpots: planetState.energySpots,
							naturalResources: planetState.naturalResources,
							garrisonRequirement: isOwner
								? planetState.garrisonRequirement
								: undefined,
							inUprising: isOwner ? planetState.inUprising : undefined,
							general: isOwner ? planetState.general : undefined,
							commander: isOwner ? planetState.commander : undefined,
						};
					}

					planetViews[planetId] = planetView;
				}

				const factionView: FactionView = {
					resources: factions[faction].resources,
					objectives: factions[faction].objectives,
				};

				return {
					id: gameId,
					turn: 1,
					planets: planetViews,
					sectors,
					faction: factionView,
					side: faction,
					notifications: [],
				};
			})(),
		};

		await this.state.storage.put("gameState", gameState);
		await this.state.storage.put("views", views);
		await this.state.storage.put<FactionMetadata>(
			`user:${request.creatorId}`,
			request.faction,
		);

		return {
			gameId,
			...request,
		};
	}

	async view(userId: string): Promise<GameView> {
		const faction = await this.state.storage.get<FactionMetadata>(
			`user:${userId}`,
		);
		if (!faction) {
			throw new ApiError(401, "unauthorized", "User not found or not in game");
		}
		if (!["Empire", "Rebellion"].includes(faction)) {
			throw new ApiError(
				400,
				"invalid_faction",
				"Faction must be Empire or Rebellion",
			);
		}

		const views =
			await this.state.storage.get<Record<FactionMetadata, GameView>>("views");
		if (!views) throw new ApiError(404, "not_found", "No views found");
		const view = views[faction];
		if (!view) {
			throw new ApiError(404, "not_found", "View not found for " + faction);
		}
		return view;
	}
}
