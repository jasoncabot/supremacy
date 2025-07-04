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
	PlanetManufacturing,
	PlanetFleets,
	PlanetMissions,
	PlanetMetadata,
	PlanetState,
	PlanetView,
	SectorMetadata,
	CharacterIdentifier,
	PersonnelSubtype,
	TroopSubtype,
	SquadronSubtype,
	ShieldSubtype,
	BatterySubtype,
	ShipyardSubtype,
	TrainingFacilitySubtype,
	ConstructionYardSubtype,
	MissionType,
	CapitalShipSubtype,
	FleetResource,
	DefenseResource,
	MissionResource,
	PersonnelResource,
} from "../api";
import {
	characterNames,
	personnelNames,
	troopNames,
	squadronNames,
	shieldNames,
	batteryNames,
	shipyardNames,
	trainingFacilityNames,
	constructionYardNames,
	refineryNames,
	mineNames,
} from "../names";
import {
	smallSectors,
	mediumSectors,
	largeSectors,
	allPlanets,
} from "../metadata/sectors";

// Helper function to generate random defense resources for a planet
function generateDefenses(
	planetOwner: FactionMetadata | "Neutral",
	usedCharacters: Set<CharacterIdentifier> = new Set(),
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
	const availableCharacters: CharacterIdentifier[] =
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
					"imperial_commando",
					"imperial_espionage_droid",
					"imperial_probe_droid",
					"noghri_death_commando",
				]
			: [
					"bothan_spy",
					"guerilla",
					"infiltrator",
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
				subtype: "character",
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
			id: `personnel:${personnelType}:${crypto.randomUUID()}`,
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
			id: `troop:${troopType}:${crypto.randomUUID()}`,
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
			id: `squadron:${squadronType}:${crypto.randomUUID()}`,
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
			id: `shield:${shieldType}:${crypto.randomUUID()}`,
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
			id: `battery:${batteryType}:${crypto.randomUUID()}`,
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

// Helper function to generate random manufacturing resources for a planet
function generateManufacturing(
	planetOwner: FactionMetadata | "Neutral",
): PlanetManufacturing {
	const manufacturing: PlanetManufacturing = {
		shipyards: [],
		training_facilities: [],
		construction_yards: [],
		refineries: [],
		mines: [],
	};

	// Only generate manufacturing for owned planets
	if (planetOwner === "Neutral") {
		return manufacturing;
	}

	// Generate shipyards
	const shipyardTypes: ShipyardSubtype[] = [
		"orbital_shipyard",
		"advanced_shipyard",
	];
	for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
		const shipyardType =
			shipyardTypes[Math.floor(Math.random() * shipyardTypes.length)];
		manufacturing.shipyards.push({
			id: `shipyard:${shipyardType}:${crypto.randomUUID()}`,
			name: shipyardNames[shipyardType],
			type: "shipyard",
			subtype: shipyardType,
			status:
				Math.random() < 0.7
					? "active"
					: Math.random() < 0.5
						? "en-route"
						: "under-construction",
		});
	}

	// Generate training facilities
	const trainingTypes: TrainingFacilitySubtype[] = [
		"training_facility",
		"advanced_training_facility",
	];
	for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
		const trainingType =
			trainingTypes[Math.floor(Math.random() * trainingTypes.length)];
		manufacturing.training_facilities.push({
			id: `training:${trainingType}:${crypto.randomUUID()}`,
			name: trainingFacilityNames[trainingType],
			type: "training_facility",
			subtype: trainingType,
			status:
				Math.random() < 0.7
					? "active"
					: Math.random() < 0.5
						? "en-route"
						: "under-construction",
		});
	}

	// Generate construction yards
	const constructionTypes: ConstructionYardSubtype[] = [
		"construction_yard",
		"advanced_construction_yard",
	];
	for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
		const constructionType =
			constructionTypes[Math.floor(Math.random() * constructionTypes.length)];
		manufacturing.construction_yards.push({
			id: `construction:${constructionType}:${crypto.randomUUID()}`,
			name: constructionYardNames[constructionType],
			type: "construction_yard",
			subtype: constructionType,
			status:
				Math.random() < 0.7
					? "active"
					: Math.random() < 0.5
						? "en-route"
						: "under-construction",
		});
	}

	// Generate refineries
	for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
		manufacturing.refineries.push({
			id: `refinery:refinery:${crypto.randomUUID()}`,
			name: refineryNames["refinery"],
			type: "refinery",
			subtype: "refinery",
			status:
				Math.random() < 0.8
					? "active"
					: Math.random() < 0.5
						? "en-route"
						: "under-construction",
		});
	}

	// Generate mines
	for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
		manufacturing.mines.push({
			id: `mine:mine:${crypto.randomUUID()}`,
			name: mineNames["mine"],
			type: "mine",
			subtype: "mine",
			status:
				Math.random() < 0.8
					? "active"
					: Math.random() < 0.5
						? "en-route"
						: "under-construction",
		});
	}

	return manufacturing;
}

// Helper function to generate random fleet data for a planet
function generateFleets(
	planetOwner: FactionMetadata | "Neutral",
): PlanetFleets {
	const fleets: FleetResource[] = [];

	// Only generate fleets for owned planets
	if (planetOwner === "Neutral") {
		return { fleets };
	}

	// Generate 0-2 fleets per planet
	const fleetCount = Math.floor(Math.random() * 3);

	for (let i = 0; i < fleetCount; i++) {
		const fleetId = crypto.randomUUID();
		const fleet: FleetResource = {
			id: `fleet:${fleetId}`,
			name: planetOwner === "Empire" 
				? `Imperial Fleet ${i + 1}`
				: `Rebel Fleet ${i + 1}`,
			type: "fleet",
			subtype: "fleet",
			faction: planetOwner as FactionMetadata,
			status: "active",
			ships: [],
		};

		// Generate ships
		const shipTypes: CapitalShipSubtype[] = planetOwner === "Empire"
			? [
				"imperial_star_destroyer",
				"imperial_ii_star_destroyer",
				"victory_destroyer", 
				"victory_ii_star_destroyer",
				"imperial_dreadnaught",
				"interdictor_cruiser"
			]
			: [
				"mon_calamari_cruiser",
				"assault_frigate", 
				"nebulon_b_frigate",
				"corellian_corvette",
				"bulk_cruiser",
				"alliance_dreadnaught"
			];

		const shipCount = Math.floor(Math.random() * 3) + 1;
		for (let j = 0; j < shipCount; j++) {
			const shipType = shipTypes[Math.floor(Math.random() * shipTypes.length)];
			
			// Generate fighters for this ship
			const fighterTypes: SquadronSubtype[] = planetOwner === "Empire"
				? ["tie_fighter", "tie_bomber", "tie_interceptor", "tie_defender"]
				: ["x_wing", "y_wing", "a_wing", "b_wing"];
			
			const fighterCount = Math.floor(Math.random() * 3) + 1;
			const shipFighters: DefenseResource[] = [];
			for (let k = 0; k < fighterCount; k++) {
				const fighterType = fighterTypes[Math.floor(Math.random() * fighterTypes.length)];
				shipFighters.push({
					id: `squadron:${fighterType}:${crypto.randomUUID()}`,
					name: `${fighterType.replace(/_/g, ' ').toUpperCase()} Squadron ${k + 1}`,
					type: "squadron",
					subtype: fighterType,
					status: Math.random() < 0.9 ? "active" : "en-route",
				});
			}

			// Generate troops for this ship
			const troopTypes: TroopSubtype[] = planetOwner === "Empire"
				? ["imperial_army_regiment", "imperial_fleet_regiment", "stormtrooper_regiment", "dark_trooper_regiment"]
				: ["alliance_army_regiment", "alliance_fleet_regiment", "mon_calamari_regiment", "wookie_regiment"];

			const troopCount = Math.floor(Math.random() * 2) + 1;
			const shipTroops: DefenseResource[] = [];
			for (let k = 0; k < troopCount; k++) {
				const troopType = troopTypes[Math.floor(Math.random() * troopTypes.length)];
				shipTroops.push({
					id: `troop:${troopType}:${crypto.randomUUID()}`,
					name: `${troopType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ${k + 1}`,
					type: "troop",
					subtype: troopType,
					status: Math.random() < 0.85 ? "active" : "en-route",
				});
			}

			// Generate personnel for this ship
			const personnelTypes: PersonnelSubtype[] = planetOwner === "Empire"
				? ["imperial_commando", "imperial_espionage_droid", "noghri_death_commando"]
				: ["bothan_spy", "guerilla", "infiltrator"];

			const personnelCount = Math.floor(Math.random() * 2) + 1;
			const shipPersonnel: DefenseResource[] = [];
			for (let k = 0; k < personnelCount; k++) {
				const personnelType = personnelTypes[Math.floor(Math.random() * personnelTypes.length)];
				shipPersonnel.push({
					id: `personnel:${personnelType}:${crypto.randomUUID()}`,
					name: `${personnelType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ${k + 1}`,
					type: "personnel",
					subtype: personnelType,
					status: Math.random() < 0.8 ? "active" : "en-route",
					injured: Math.random() < 0.1, // 10% chance of being injured
					imprisoned: Math.random() < 0.05, // 5% chance of being imprisoned
				});
			}

			fleet.ships.push({
				id: `ship:${shipType}:${crypto.randomUUID()}`,
				name: `${shipType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ${j + 1}`,
				type: "capital_ship",
				subtype: shipType,
				status: Math.random() < 0.8 ? "active" : "en-route",
				damage: Math.random() < 0.7 ? "low" : Math.random() < 0.5 ? "medium" : "high",
				fighters: shipFighters,
				troops: shipTroops,
				personnel: shipPersonnel,
			});
		}

		fleets.push(fleet);
	}

	return { fleets };
}

// Helper function to generate random mission data for a planet
function generateMissions(
	planetOwner: FactionMetadata | "Neutral",
	planetMetadataList: PlanetMetadata[],
): PlanetMissions {
	const missions: MissionResource[] = [];

	// Only generate missions for owned planets
	if (planetOwner === "Neutral") {
		return { missions };
	}

	// Generate 0-3 active missions per planet
	const missionCount = Math.floor(Math.random() * 4);

	const missionTypes: MissionType[] = planetOwner === "Empire"
		? [
			"espionage",
			"assassination", 
			"subdue_uprising",
			"facility_design_research",
			"ship_design_research",
			"abduction"
		]
		: [
			"reconnaissance",
			"sabotage",
			"rescue",
			"incite_uprising", 
			"recruitment",
			"diplomacy",
			"jedi_training"
		];

	for (let i = 0; i < missionCount; i++) {
		const missionType = missionTypes[Math.floor(Math.random() * missionTypes.length)];
		const missionId = crypto.randomUUID();

		// Generate target (random planet from available planets)
		const targetPlanet = planetMetadataList[Math.floor(Math.random() * planetMetadataList.length)];
		const target = {
			id: targetPlanet.id,
			name: targetPlanet.name,
			status: "active" as const,
		};

		// Generate agents
		const agents: PersonnelResource[] = [];
		const agentCount = Math.floor(Math.random() * 3) + 1;
		const agentTypes: PersonnelSubtype[] = planetOwner === "Empire"
			? ["imperial_commando", "imperial_espionage_droid", "noghri_death_commando"]
			: ["bothan_spy", "guerilla", "infiltrator", "longprobe_y_wing_recon_team"];

		for (let j = 0; j < agentCount; j++) {
			const agentType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
			agents.push({
				id: `agent:${agentType}:${crypto.randomUUID()}`,
				name: `${agentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Agent ${j + 1}`,
				type: "personnel",
				subtype: agentType,
				injured: false,
				imprisoned: false,
				status: "active",
			});
		}

		// Generate decoys
		const decoys: PersonnelResource[] = [];
		const decoyCount = Math.floor(Math.random() * 2);
		for (let j = 0; j < decoyCount; j++) {
			const decoyType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
			decoys.push({
				id: `decoy:${decoyType}:${crypto.randomUUID()}`,
				name: `${decoyType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Decoy ${j + 1}`,
				type: "personnel",
				subtype: decoyType,
				injured: false,
				imprisoned: false,
				status: "active",
			});
		}

		const mission: MissionResource = {
			id: `mission:${missionType}:${missionId}`,
			name: `${missionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Mission`,
			type: "mission",
			subtype: missionType,
			status: "active",
			target,
			agents,
			decoys,
		};

		missions.push(mission);
	}

	return { missions };
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
		// Select the appropriate sector metadata based on galaxy size
		let sectorMetadata: SectorMetadata[];
		switch (request.galaxySize) {
			case "Small":
				sectorMetadata = smallSectors;
				break;
			case "Medium":
				sectorMetadata = mediumSectors;
				break;
			default:
				sectorMetadata = largeSectors;
				break;
		}

		// Create sectors with metadata
		const sectors: Record<string, SectorMetadata> = {};
		const planets: Record<string, PlanetState> = {};

		// Generate sectors and planets using metadata
		const usedCharacters = new Set<CharacterIdentifier>();

		// Create a lookup map for planet metadata
		const planetMetadataMap = new Map(allPlanets.map((p) => [p.id, p]));
		
		// Collect all planet metadata for mission targets
		const planetMetadataList: PlanetMetadata[] = [];

		for (const sector of sectorMetadata) {
			// Add sector to sectors record
			sectors[sector.id] = sector;

			// Create planets for this sector
			for (const planetId of sector.planetIds) {
				const planetMeta = planetMetadataMap.get(planetId);
				if (!planetMeta) {
					console.warn(`Planet metadata not found for ${planetId}`);
					continue;
				}

				// Create planet metadata
				const planetMetadata: PlanetMetadata = {
					id: planetId,
					name: planetMeta.name,
					sectorId: sector.id,
					picture: planetMeta.picture,
					position: planetMeta.location,
				};

				// Add to list for mission generation
				planetMetadataList.push(planetMetadata);

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
					isDestroyed: false,
					general: null,
					commander: null,
					isDiscovered: sector.isInnerRim, // Inner rim planets start discovered
					defenses: generateDefenses(owner, usedCharacters),
					manufacturing: generateManufacturing(owner),
					fleets: generateFleets(owner),
					missions: generateMissions(owner, planetMetadataList),
				};

				planets[planetId] = planetState;
			}
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
							isDestroyed: planetState.isDestroyed,
							general: isOwner ? planetState.general : undefined,
							commander: isOwner ? planetState.commander : undefined,
							defenses: isOwner ? planetState.defenses : undefined,
							manufacturing: isOwner ? planetState.manufacturing : undefined,
							fleets: isOwner ? planetState.fleets : undefined,
							missions: isOwner ? planetState.missions : undefined,
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
							isDestroyed: planetState.isDestroyed,
							general: isOwner ? planetState.general : undefined,
							commander: isOwner ? planetState.commander : undefined,
							defenses: isOwner ? planetState.defenses : undefined,
							manufacturing: isOwner ? planetState.manufacturing : undefined,
							fleets: isOwner ? planetState.fleets : undefined,
							missions: isOwner ? planetState.missions : undefined,
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
