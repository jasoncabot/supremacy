import { DurableObject } from "cloudflare:workers";
import {
	CreateGameRequest,
	CreateGameResponse,
	FactionMetadata,
	GalaxySizeMetadata,
	Notification,
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
	MissionTarget,
	CapitalShipSubtype,
	FleetResource,
	DefenseResource,
	MissionResource,
	PersonnelResource,
	ManufacturingResource,
	Result,
} from "../api";
import { ok, err } from "../errors";
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

const empireCharacters: CharacterIdentifier[] = [
	"darth_vader", "emperor_palpatine", "thrawn", "pellaeon", "piett", "ozzel",
	"jerjerrod", "veers", "daala", "brandei", "dorja", "grammel", "bin_essada",
	"covell", "labansat", "griff", "klev", "needa", "screed", "pter_thanas",
	"villar", "menndo", "garindan", "bane_nothos", "afyon",
];

const rebellionCharacters: CharacterIdentifier[] = [
	"luke_skywalker", "leia_organa", "han_solo", "mon_mothma", "ackbar",
	"lando_calrissian", "chewbacca", "jan_dodonna", "crix_madine", "garm_bel_iblis",
	"borsk_feylya", "wedge_antilles", "bren_derlin", "carlist_rieekan", "drayson",
	"adar_tallon", "mazer_rackus", "orrimaarko", "mawshiye", "narra", "page",
	"syub_snunb", "roget_jiriss", "tura_raftican", "sarin_virgilio", "noval_garaint",
	"huoba_neva", "vanden_willard", "shenir_rix", "kaiya_andrimetrum",
	"niles_ferrier", "talon_karrde", "zuggs", "orlok",
];

const empireShips: CapitalShipSubtype[] = [
	"imperial_star_destroyer", "imperial_ii_star_destroyer", "super_star_destroyer",
	"victory_destroyer", "victory_ii_star_destroyer", "interdictor_cruiser",
	"lancer_frigate", "carrack_light_cruiser", "imperial_dreadnaught",
	"imperial_escort_carrier", "strike_cruiser", "dauntless_cruiser", "star_galleon",
];

const rebellionShips: CapitalShipSubtype[] = [
	"mon_calamari_cruiser", "assault_frigate", "nebulon_b_frigate",
	"corellian_corvette", "corellian_gunship", "bulk_cruiser",
	"alliance_dreadnaught", "alliance_escort_carrier", "bulk_transport",
	"medium_transport", "assault_transport", "cc_7700_frigate", "cc_9600_frigate",
	"liberator_cruiser", "bulwark_battlecruiser",
];

function pick<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randomPlanetTarget(planets: PlanetMetadata[]): MissionTarget {
	const p = pick(planets);
	return { type: "planet", id: p.id, name: p.name, status: "active", picture: p.picture };
}

function randomCharacterTarget(
	characters: CharacterIdentifier[],
	{ injured = false, imprisoned = false } = {},
): MissionTarget {
	const id = pick(characters);
	return {
		type: "personnel",
		subtype: "character",
		id: `personnel:character:${id}`,
		name: characterNames[id],
		status: "active",
		injured,
		imprisoned,
	};
}

function randomShipTarget(ships: CapitalShipSubtype[]): MissionTarget {
	const subtype = pick(ships);
	return {
		type: "capital_ship",
		subtype,
		id: `capital_ship:${subtype}:${crypto.randomUUID()}`,
		name: subtype.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
		status: "active",
	};
}

function randomManufacturingTarget(
	subtypes: Array<{ type: ManufacturingResource["type"]; subtype: string; name: string }>,
): MissionTarget {
	const entry = pick(subtypes);
	return {
		type: entry.type,
		subtype: entry.subtype,
		id: `${entry.type}:${entry.subtype}:${crypto.randomUUID()}`,
		name: entry.name,
		status: "active",
	} as MissionTarget;
}

type MissionTargetCategory = "planet" | "enemy_character" | "friendly_character" | "enemy_ship" | "friendly_shipyard" | "friendly_training" | "friendly_construction" | "enemy_facility" | "enemy_ship_or_unit";

const missionTargetCategories: Record<MissionType, MissionTargetCategory[]> = {
	abduction:                ["enemy_character"],
	assassination:            ["enemy_character"],
	death_star_sabotage:      ["enemy_ship"],
	diplomacy:                ["planet"],
	espionage:                ["planet"],
	facility_design_research: ["friendly_construction"],
	incite_uprising:          ["planet"],
	jedi_training:            ["friendly_character"],
	reconnaissance:           ["planet"],
	recruitment:              ["planet"],
	rescue:                   ["friendly_character"],
	sabotage:                 ["enemy_facility", "enemy_ship_or_unit"],
	ship_design_research:     ["friendly_shipyard"],
	subdue_uprising:          ["planet"],
	troop_training_research:  ["friendly_training"],
};

function generateMissionTarget(
	category: MissionTargetCategory,
	owner: FactionMetadata,
	planetMetadataList: PlanetMetadata[],
): MissionTarget {
	const enemyChars = owner === "Empire" ? rebellionCharacters : empireCharacters;
	const friendlyChars = owner === "Empire" ? empireCharacters : rebellionCharacters;
	const enemyShips = owner === "Empire" ? rebellionShips : empireShips;

	const shipyardOptions = [
		{ type: "shipyard" as const, subtype: "orbital_shipyard", name: shipyardNames["orbital_shipyard"] },
		{ type: "shipyard" as const, subtype: "advanced_shipyard", name: shipyardNames["advanced_shipyard"] },
	];
	const trainingOptions = [
		{ type: "training_facility" as const, subtype: "training_facility", name: trainingFacilityNames["training_facility"] },
		{ type: "training_facility" as const, subtype: "advanced_training_facility", name: trainingFacilityNames["advanced_training_facility"] },
	];
	const constructionOptions = [
		{ type: "construction_yard" as const, subtype: "construction_yard", name: constructionYardNames["construction_yard"] },
		{ type: "construction_yard" as const, subtype: "advanced_construction_yard", name: constructionYardNames["advanced_construction_yard"] },
	];

	switch (category) {
		case "planet":
			return randomPlanetTarget(planetMetadataList);
		case "enemy_character":
			return randomCharacterTarget(enemyChars);
		case "friendly_character":
			return randomCharacterTarget(friendlyChars);
		case "enemy_ship":
			return randomShipTarget(enemyShips);
		case "friendly_shipyard":
			return randomManufacturingTarget(shipyardOptions);
		case "friendly_training":
			return randomManufacturingTarget(trainingOptions);
		case "friendly_construction":
			return randomManufacturingTarget(constructionOptions);
		case "enemy_facility":
			return randomManufacturingTarget([...shipyardOptions, ...trainingOptions, ...constructionOptions]);
		case "enemy_ship_or_unit":
			return randomShipTarget(enemyShips);
	}
}

// Helper function to generate random mission data for a planet
function generateMissions(
	planetOwner: FactionMetadata | "Neutral",
	planetMetadataList: PlanetMetadata[],
): PlanetMissions {
	const missions: MissionResource[] = [];

	if (planetOwner === "Neutral") {
		return { missions };
	}

	const missionCount = Math.floor(Math.random() * 4);

	const missionTypes: MissionType[] = planetOwner === "Empire"
		? ["espionage", "assassination", "subdue_uprising", "facility_design_research", "ship_design_research", "abduction"]
		: ["reconnaissance", "sabotage", "rescue", "incite_uprising", "recruitment", "diplomacy", "jedi_training"];

	const agentTypes: PersonnelSubtype[] = planetOwner === "Empire"
		? ["imperial_commando", "imperial_espionage_droid", "noghri_death_commando"]
		: ["bothan_spy", "guerilla", "infiltrator", "longprobe_y_wing_recon_team"];

	for (let i = 0; i < missionCount; i++) {
		const missionType = pick(missionTypes);
		const categories = missionTargetCategories[missionType];
		const target = generateMissionTarget(pick(categories), planetOwner, planetMetadataList);

		const agents: PersonnelResource[] = [];
		const agentCount = Math.floor(Math.random() * 3) + 1;
		for (let j = 0; j < agentCount; j++) {
			const agentType = pick(agentTypes);
			agents.push({
				id: `agent:${agentType}:${crypto.randomUUID()}`,
				name: `${agentType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Agent ${j + 1}`,
				type: "personnel",
				subtype: agentType,
				injured: false,
				imprisoned: false,
				status: "active",
			});
		}

		const decoys: PersonnelResource[] = [];
		const decoyCount = Math.floor(Math.random() * 2);
		for (let j = 0; j < decoyCount; j++) {
			const decoyType = pick(agentTypes);
			decoys.push({
				id: `decoy:${decoyType}:${crypto.randomUUID()}`,
				name: `${decoyType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Decoy ${j + 1}`,
				type: "personnel",
				subtype: decoyType,
				injured: false,
				imprisoned: false,
				status: "active",
			});
		}

		missions.push({
			id: `mission:${missionType}:${crypto.randomUUID()}`,
			name: `${missionType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Mission`,
			type: "mission",
			subtype: missionType,
			status: "active",
			target,
			agents,
			decoys,
		});
	}

	return { missions };
}

// Project the ground-truth state of a single planet into the partial view a
// faction is allowed to see. This is the only boundary between secret state and
// data sent to a client, so it is written default-deny: a freshly built literal
// that names exactly the fields a faction may observe. Adding a field to
// PlanetState leaves it hidden until it is explicitly listed here.
function projectPlanetView(
	faction: FactionMetadata,
	planetState: PlanetState,
): PlanetView {
	const isOwner = planetState.owner === faction;
	const isDiscovered = planetState.isDiscovered || isOwner;

	// Undiscovered planets reveal nothing beyond their static metadata.
	if (!isDiscovered) {
		return {
			metadata: planetState.metadata,
			discovered: false,
		};
	}

	// Visible to anyone who has discovered the planet.
	const state: NonNullable<PlanetView["state"]> = {
		owner: planetState.owner,
		energySpots: planetState.energySpots,
		naturalResources: planetState.naturalResources,
		isDestroyed: planetState.isDestroyed,
	};

	// Owner-only secrets: internal politics, military and production.
	if (isOwner) {
		state.loyalty = planetState.loyalty;
		state.garrisonRequirement = planetState.garrisonRequirement;
		state.inUprising = planetState.inUprising;
		state.general = planetState.general;
		state.commander = planetState.commander;
		state.defenses = planetState.defenses;
		state.manufacturing = planetState.manufacturing;
		state.fleets = planetState.fleets;
		state.missions = planetState.missions;
	}

	return {
		metadata: planetState.metadata,
		state,
		discovered: true,
	};
}

// Project the full GameState into the GameView a single faction sees. Turn
// resolution mutates the GameState (the truth) in place; this is the one
// function that crosses the truth -> view boundary, so the truth never leaves
// the Durable Object.
function projectView(
	faction: FactionMetadata,
	gameState: GameState,
	notifications: Notification[],
): GameView {
	const planets: Record<string, PlanetView> = {};
	for (const [planetId, planetState] of Object.entries(gameState.planets)) {
		planets[planetId] = projectPlanetView(faction, planetState);
	}

	const factionState = gameState.factions[faction];
	const factionView: FactionView = {
		resources: factionState.resources,
		objectives: factionState.objectives,
	};

	return {
		id: gameState.id,
		turn: gameState.turn,
		planets,
		sectors: gameState.sectors,
		faction: factionView,
		side: faction,
		notifications,
	};
}

function sectorMetadataFor(galaxySize: GalaxySizeMetadata): SectorMetadata[] {
	switch (galaxySize) {
		case "Small":
			return smallSectors;
		case "Medium":
			return mediumSectors;
		default:
			return largeSectors;
	}
}

function generateGameState(
	gameId: string,
	galaxySize: CreateGameRequest["galaxySize"],
): GameState {
	const sectorMetadata = sectorMetadataFor(galaxySize);

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
	};

	return gameState;
}

type LinkState = "pending" | "synced" | "unlink_pending";

interface GameRow {
	[column: string]: SqlStorageValue;
	id: string;
	name: string;
	status: "active" | "deleting";
	galaxy_size: GalaxySizeMetadata;
	turn: number;
	updated_at: string;
}

interface PlayerRow {
	[column: string]: SqlStorageValue;
	user_id: string;
	faction: FactionMetadata;
	link_state: LinkState;
}

const GAME_NAME = "New Game";

// A view carries this many of a faction's latest notifications, however many
// have built up over the course of the game
const VIEW_NOTIFICATIONS = 100;

// Planets keep everything about themselves (defences, fleets, missions and so
// on) in one row. Games run for hundreds of turns, so what accumulates is
// notifications, which get their own rows.
const SCHEMA = `
	CREATE TABLE IF NOT EXISTS game (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		status TEXT NOT NULL,
		galaxy_size TEXT NOT NULL,
		turn INTEGER NOT NULL,
		updated_at TEXT NOT NULL
	);
	CREATE TABLE IF NOT EXISTS planets (
		id TEXT PRIMARY KEY,
		data TEXT NOT NULL
	);
	CREATE TABLE IF NOT EXISTS factions (
		name TEXT PRIMARY KEY,
		data TEXT NOT NULL
	);
	CREATE TABLE IF NOT EXISTS notifications (
		seq INTEGER PRIMARY KEY AUTOINCREMENT,
		id TEXT NOT NULL UNIQUE,
		faction TEXT NOT NULL,
		turn INTEGER NOT NULL,
		read INTEGER NOT NULL DEFAULT 0,
		message TEXT NOT NULL
	);
	CREATE INDEX IF NOT EXISTS notifications_by_faction ON notifications (faction, seq);
	CREATE TABLE IF NOT EXISTS players (
		user_id TEXT PRIMARY KEY,
		faction TEXT NOT NULL,
		link_state TEXT NOT NULL
	);
`;

type StoredFaction = Omit<FactionState, "controlledPlanetIds">;

function insertGameState(sql: SqlStorage, gameState: GameState) {
	for (const [id, planet] of Object.entries(gameState.planets)) {
		sql.exec("INSERT INTO planets (id, data) VALUES (?, ?)", id, JSON.stringify(planet));
	}
	for (const [name, faction] of Object.entries(gameState.factions)) {
		// Which planets a faction controls is already recorded by each planet's owner
		const { resources, objectives } = faction;
		sql.exec(
			"INSERT INTO factions (name, data) VALUES (?, ?)",
			name,
			JSON.stringify({ resources, objectives } satisfies StoredFaction),
		);
	}
}

function loadGameState(sql: SqlStorage, game: GameRow): GameState {
	const planets: Record<string, PlanetState> = {};
	for (const row of sql
		.exec<{ id: string; data: string }>("SELECT id, data FROM planets ORDER BY rowid")
		.toArray()) {
		planets[row.id] = JSON.parse(row.data) as PlanetState;
	}

	const factions = {} as Record<FactionMetadata, FactionState>;
	for (const row of sql
		.exec<{ name: FactionMetadata; data: string }>("SELECT name, data FROM factions")
		.toArray()) {
		factions[row.name] = {
			...(JSON.parse(row.data) as StoredFaction),
			controlledPlanetIds: Object.keys(planets).filter((id) => planets[id].owner === row.name),
		};
	}

	// Sectors are the same in every game of a size, so they aren't stored
	const sectors: Record<string, SectorMetadata> = {};
	for (const sector of sectorMetadataFor(game.galaxy_size)) sectors[sector.id] = sector;

	return { id: game.id, turn: game.turn, planets, sectors, factions };
}

/** A faction's latest notifications, oldest first. Other factions' are never read. */
function loadNotifications(sql: SqlStorage, faction: FactionMetadata): Notification[] {
	return sql
		.exec<{ id: string; message: string; read: number }>(
			`SELECT id, message, read FROM (
				SELECT seq, id, message, read FROM notifications
				WHERE faction = ? ORDER BY seq DESC LIMIT ?
			) ORDER BY seq`,
			faction,
			VIEW_NOTIFICATIONS,
		)
		.toArray()
		.map((row) => ({ id: row.id, message: row.message, read: row.read === 1 }));
}

// Link work that hasn't been confirmed is retried by the alarm after this long,
// and again at the slower rate if the retry itself fails
const LINK_RETRY_MS = 10_000;
const LINK_RETRY_AFTER_FAILURE_MS = 5 * 60_000;

/**
 * One instance per game, and the single source of truth for it: the state, who
 * plays and which faction. Each player's Users object only keeps a cached link
 * so their games can be listed quickly; this object keeps those links in sync.
 *
 * Link changes are written to `players.link_state` in the same transaction as
 * the change that needs them (an outbox). They are then pushed inline and, if
 * that fails, retried by `alarm()`. Pushes are idempotent, so repeats are safe.
 */
export class GamesDurableObject extends DurableObject<Env> {
	// `deleteAll()` drops the tables, and the instance can outlive that, so this
	// runs on every call rather than once in the constructor.
	private ensureSchema() {
		this.ctx.storage.sql.exec(SCHEMA);
	}

	private getGame(): GameRow | undefined {
		return this.ctx.storage.sql.exec<GameRow>("SELECT * FROM game").toArray()[0];
	}

	private getPlayer(userId: string): PlayerRow | undefined {
		return this.ctx.storage.sql
			.exec<PlayerRow>("SELECT * FROM players WHERE user_id = ?", userId)
			.toArray()[0];
	}

	async create(
		gameId: string,
		request: CreateGameRequest & { creatorId: string },
	): Promise<Result<CreateGameResponse>> {
		this.ensureSchema();
		if (this.getGame()) {
			return err(409, "conflict", "That game already exists");
		}

		const gameState = generateGameState(gameId, request.galaxySize);
		const sql = this.ctx.storage.sql;
		// Alarm first: if we die before the transaction it finds nothing to do,
		// whereas the other way round the link work could be left with no retry
		await this.ctx.storage.setAlarm(Date.now() + LINK_RETRY_MS);
		this.ctx.storage.transactionSync(() => {
			sql.exec(
				"INSERT INTO game (id, name, status, galaxy_size, turn, updated_at) VALUES (?, ?, 'active', ?, ?, ?)",
				gameId,
				GAME_NAME,
				request.galaxySize,
				gameState.turn,
				new Date().toISOString(),
			);
			insertGameState(sql, gameState);
			sql.exec(
				"INSERT INTO players (user_id, faction, link_state) VALUES (?, ?, 'pending')",
				request.creatorId,
				request.faction,
			);
		});

		await this.syncLinksSafely();
		return ok({ gameId });
	}

	async view(userId: string): Promise<Result<GameView>> {
		this.ensureSchema();
		const player = this.getPlayer(userId);
		if (!player || this.getGame()?.status !== "active") {
			return err(404, "not_found", "Game not found");
		}
		if (player.link_state !== "synced") {
			// They've found a game their list is missing, so repair it now
			await this.syncLinksSafely();
		}

		// Re-read: the game may have been deleted while the link sync was waiting
		const game = this.getGame();
		if (!game || game.status !== "active") {
			return err(404, "not_found", "Game not found");
		}
		const sql = this.ctx.storage.sql;
		return ok(
			projectView(player.faction, loadGameState(sql, game), loadNotifications(sql, player.faction)),
		);
	}

	/**
	 * Deletes the game. The state goes in one transaction; the players' links
	 * follow, and once they are all gone everything else is wiped.
	 */
	async delete(userId: string): Promise<Result<void>> {
		this.ensureSchema();
		const game = this.getGame();
		if (!game || !this.getPlayer(userId)) {
			return err(404, "not_found", "Game not found");
		}

		if (game.status === "active") {
			await this.ctx.storage.setAlarm(Date.now() + LINK_RETRY_MS);
			const sql = this.ctx.storage.sql;
			this.ctx.storage.transactionSync(() => {
				sql.exec("UPDATE game SET status = 'deleting'");
				sql.exec("DELETE FROM planets");
				sql.exec("DELETE FROM factions");
				sql.exec("DELETE FROM notifications");
				sql.exec("UPDATE players SET link_state = 'unlink_pending'");
			});
		}

		await this.syncLinksSafely();
		return ok();
	}

	async alarm(): Promise<void> {
		this.ensureSchema();
		if (!(await this.syncLinksSafely())) {
			// The runtime stops retrying a failing alarm after a few attempts, which
			// would strand the links, so schedule our own retry instead of throwing
			await this.ctx.storage.setAlarm(Date.now() + LINK_RETRY_AFTER_FAILURE_MS);
		}
	}

	/** Never throws: a failure leaves the work pending for the alarm. Returns whether it all synced. */
	private async syncLinksSafely(): Promise<boolean> {
		try {
			const synced = await this.syncLinks();
			if (synced.ok) return true;
			console.error(JSON.stringify({ message: "link sync deferred", code: synced.error.code }));
		} catch (e) {
			console.error(JSON.stringify({ message: "link sync failed", error: String(e) }));
		}
		return false;
	}

	/** Pushes every unconfirmed link to its user, then tidies up once none remain. */
	private async syncLinks(): Promise<Result<void>> {
		const sql = this.ctx.storage.sql;
		const game = this.getGame();
		if (!game) return ok();

		const outstanding = sql
			.exec<PlayerRow>("SELECT * FROM players WHERE link_state != 'synced'")
			.toArray();
		for (const player of outstanding) {
			const users = this.env.USERS.get(this.env.USERS.idFromString(player.user_id));
			if (player.link_state === "unlink_pending") {
				const unlinked = await users.unlinkGame(game.id, true);
				if (!unlinked.ok) return unlinked;
				sql.exec(
					"DELETE FROM players WHERE user_id = ? AND link_state = 'unlink_pending'",
					player.user_id,
				);
			} else {
				const linked = await users.linkGame({
					gameId: game.id,
					name: game.name,
					faction: player.faction,
					lastPlayed: game.updated_at,
					completed: false,
				});
				if (!linked.ok) return linked;
				sql.exec(
					"UPDATE players SET link_state = 'synced' WHERE user_id = ? AND link_state = 'pending'",
					player.user_id,
				);
			}
		}

		const remaining = sql
			.exec<{ n: number }>("SELECT COUNT(*) AS n FROM players WHERE link_state != 'synced'")
			.one().n;
		if (remaining > 0) return ok();

		await this.ctx.storage.deleteAlarm();
		if (this.getGame()?.status === "deleting") {
			// Compatibility date predates deleteAll() clearing alarms itself
			await this.ctx.storage.deleteAll();
		}
		return ok();
	}
}
