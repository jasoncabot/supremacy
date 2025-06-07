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
	PlanetDefenses,
	PlanetMetadata,
	PlanetState,
	PlanetView,
	SectorMetadata,
	CharacterIdentifiers,
	PersonnelSubtype,
	TroopSubtype,
	SquadronSubtype,
	ShieldSubtype,
	BatterySubtype,
} from "../api";
import {
	characterNames,
	personnelNames,
	troopNames,
	squadronNames,
	shieldNames,
	batteryNames,
} from "../names";
import { randomUUID } from "crypto";

// Helper function to generate random defense resources for a planet
function generateDefenses(
	planetOwner: FactionMetadata | "Neutral",
	usedCharacters: Set<CharacterIdentifiers> = new Set(),
): PlanetDefenses {
	const defenses: PlanetDefenses = {
		personnel: [],
		troops: [],
		squadrons: [],
		shields: [],
		batteries: [],
	};

	// Only generate defenses for owned planets
	if (planetOwner === "Neutral") {
		return defenses;
	}

	// Generate personnel (mix of characters and regular personnel)
	const availableCharacters: CharacterIdentifiers[] =
		planetOwner === "Empire"
			? [
					"darth_vader",
					"thrawn",
					"piett",
					"veers",
					"pellaeon",
					"ozzel",
					"needa",
					"screed",
				]
			: [
					"luke_skywalker",
					"leia_organa",
					"han_solo",
					"chewbacca",
					"ackbar",
					"mon_mothma",
					"wedge_antilles",
					"lando_calrissian",
				];

	const regularPersonnelTypes: PersonnelSubtype[] =
		planetOwner === "Empire"
			? [
					"imperial_commandos",
					"imperial_espionage_droid",
					"imperial_probe_droid",
					"noghri_death_commandos",
				]
			: [
					"bothan_spies",
					"guerillas",
					"infiltrators",
					"longprobe_y_wing_recon_team",
				];

	// Maybe add one character (low chance)
	if (Math.random() < 0.2) {
		const unusedCharacters = availableCharacters.filter(
			(char) => !usedCharacters.has(char),
		);
		if (unusedCharacters.length > 0) {
			const character =
				unusedCharacters[Math.floor(Math.random() * unusedCharacters.length)];
			usedCharacters.add(character);

			defenses.personnel.push({
				id: `personnel:character:${character}`,
				name: characterNames[character],
				type: "personnel",
				subtype: "characters",
				injured: Math.random() < 0.05, // Characters less likely to be injured
				imprisoned: false,
				status: Math.random() < 0.8 ? "active" : "en-route",
			});
		}
	}

	// Add regular personnel
	for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
		const personnelType =
			regularPersonnelTypes[
				Math.floor(Math.random() * regularPersonnelTypes.length)
			];

		defenses.personnel.push({
			id: `personnel:${personnelType}:${randomUUID()}`,
			name: personnelNames[personnelType],
			type: "personnel",
			subtype: personnelType,
			injured: Math.random() < 0.1,
			imprisoned: Math.random() < 0.05,
			status:
				Math.random() < 0.7
					? "active"
					: Math.random() < 0.5
						? "en-route"
						: "under-construction",
		});
	}

	// Generate troops
	const troopTypes: TroopSubtype[] =
		planetOwner === "Empire"
			? [
					"imperial_army_regiment",
					"imperial_fleet_regiment",
					"stormtrooper_regiment",
					"dark_trooper_regiment",
					"war_droid_regiment",
				]
			: [
					"alliance_army_regiment",
					"alliance_fleet_regiment",
					"mon_calamari_regiment",
					"sullustan_regiment",
					"wookie_regiment",
				];

	for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
		const troopType = troopTypes[Math.floor(Math.random() * troopTypes.length)];
		defenses.troops.push({
			id: `troop:${troopType}:${randomUUID()}`,
			name: troopNames[troopType],
			type: "troop",
			subtype: troopType,
			status:
				Math.random() < 0.6
					? "active"
					: Math.random() < 0.5
						? "en-route"
						: "under-construction",
		});
	}

	// Generate squadrons
	const squadronTypes: SquadronSubtype[] =
		planetOwner === "Empire"
			? ["tie_fighter", "tie_bomber", "tie_interceptor", "tie_defender"]
			: ["x_wing", "y_wing", "a_wing", "b_wing"];

	for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
		const squadronType =
			squadronTypes[Math.floor(Math.random() * squadronTypes.length)];
		defenses.squadrons.push({
			id: `squadron:${squadronType}:${randomUUID()}`,
			name: squadronNames[squadronType],
			type: "squadron",
			subtype: squadronType,
			status:
				Math.random() < 0.5
					? "active"
					: Math.random() < 0.5
						? "en-route"
						: "under-construction",
		});
	}

	// Generate shields
	const shieldTypes: ShieldSubtype[] = [
		"gen_core_level_i",
		"gen_core_level_ii",
		"death_star_shield",
	];

	for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
		const shieldType =
			shieldTypes[Math.floor(Math.random() * shieldTypes.length)];
		defenses.shields.push({
			id: `shield:${shieldType}:${randomUUID()}`,
			name: shieldNames[shieldType],
			type: "shield",
			subtype: shieldType,
			status:
				Math.random() < 0.4
					? "active"
					: Math.random() < 0.5
						? "en-route"
						: "under-construction",
		});
	}

	// Generate batteries
	const batteryTypes: BatterySubtype[] = [
		"kdy_150",
		"lnr_series_i",
		"lnr_series_ii",
	];

	for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
		const batteryType =
			batteryTypes[Math.floor(Math.random() * batteryTypes.length)];
		defenses.batteries.push({
			id: `battery:${batteryType}:${randomUUID()}`,
			name: batteryNames[batteryType],
			type: "battery",
			subtype: batteryType,
			status:
				Math.random() < 0.3
					? "active"
					: Math.random() < 0.5
						? "en-route"
						: "under-construction",
		});
	}

	return defenses;
}

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
		const usedCharacters = new Set<CharacterIdentifiers>();

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
				const owner: FactionMetadata | "Neutral" =
					Math.random() < 0.2
						? "Empire"
						: Math.random() < 0.5
							? "Rebellion"
							: "Neutral";

				const planetState: PlanetState = {
					metadata: planetMetadata,
					loyalty: Math.floor(Math.random() * 100),
					owner,
					energySpots: Math.floor(Math.random() * 10),
					naturalResources: Math.floor(Math.random() * 10),
					garrisonRequirement: Math.floor(Math.random() * 5) + 1,
					inUprising: Math.random() < 0.1, // 10% chance of uprising
					general: null,
					commander: null,
					isDiscovered: isInnerRim, // Inner rim planets start discovered
					defenses: generateDefenses(owner, usedCharacters),
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
							defenses: isOwner ? planetState.defenses : undefined,
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
							defenses: isOwner ? planetState.defenses : undefined,
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
