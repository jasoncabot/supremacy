export class ApiError extends Error {
	status: number;
	statusText: string;

	constructor(status: number, statusText: string, message?: string) {
		super(message || `API error: ${status} ${statusText}`);
		this.status = status;
		this.statusText = statusText;
		this.name = "ApiError";
	}
}

export interface VersionResponse {
	version: string;
}

export interface SignupRequest {
	username: string;
	password: string;
	email?: string;
}

// Authentication-related types
export interface LoginRequest {
	username: string;
	password: string;
}

export interface TokenPair {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiry: number; // Unix timestamp in milliseconds
	refreshTokenExpiry: number; // Unix timestamp in milliseconds
	clientId: string; // Client ID for which the tokens are generated
}

export interface RefreshTokenRequest {
	refreshToken: string;
}

export interface SavedGameResponse {
	id: string;
	name: string;
	lastPlayed: string;
	faction: FactionMetadata;
}

export interface DeleteGameResponse {
	success: boolean;
}

export type FactionMetadata = "Empire" | "Rebellion";
export type DifficultyMetadata = "Easy" | "Medium" | "Hard";
export type GalaxySizeMetadata = "Small" | "Medium" | "Large";
export type WinConditionMetadata = "Standard" | "Headquarters Only";
export type GameModeMetadata = "Single Player" | "Multiplayer";

export interface CreateGameRequest {
	faction: FactionMetadata;
	difficulty: DifficultyMetadata;
	galaxySize: GalaxySizeMetadata;
	winCondition: WinConditionMetadata;
	mode: GameModeMetadata;
}

export interface CreateGameResponse {
	gameId: string;
}

export interface GameAction {
	type: string;
	payload: Record<string, unknown>;
	targetId?: string;
}

export type ResourceStatus = "active" | "en-route" | "under-construction";

export interface ResourceBase {
	id: string;
	name: string;
	status: ResourceStatus;
}

export type CharacterIdentifiers =
	| "ackbar"
	| "adar_tallon"
	| "afyon"
	| "bane_nothos"
	| "bevel_lemelisk"
	| "bin_essada"
	| "borsk_feylya"
	| "brandei"
	| "bren_derlin"
	| "carlist_rieekan"
	| "chewbacca"
	| "covell"
	| "crix_madine"
	| "daala"
	| "darth_vader"
	| "dorja"
	| "drayson"
	| "emperor_palpatine"
	| "garindan"
	| "garm_bel_iblis"
	| "grammel"
	| "griff"
	| "han_solo"
	| "huoba_neva"
	| "jan_dodonna"
	| "jerjerrod"
	| "kaiya_andrimetrum"
	| "klev"
	| "labansat"
	| "lando_calrissian"
	| "leia_organa"
	| "luke_skywalker"
	| "mawshiye"
	| "mazer_rackus"
	| "menndo"
	| "mon_mothma"
	| "narra"
	| "needa"
	| "niles_ferrier"
	| "noval_garaint"
	| "orlok"
	| "orrimaarko"
	| "ozzel"
	| "page"
	| "pellaeon"
	| "piett"
	| "pter_thanas"
	| "roget_jiriss"
	| "sarin_virgilio"
	| "screed"
	| "shenir_rix"
	| "syub_snunb"
	| "talon_karrde"
	| "thrawn"
	| "tura_raftican"
	| "vanden_willard"
	| "veers"
	| "villar"
	| "wedge_antilles"
	| "zuggs";

export type BatterySubtype = "kdy_150" | "lnr_series_i" | "lnr_series_ii";
export type PersonnelSubtype =
	| "characters" // 'special' type for named characters
	| "bothan_spies"
	| "guerillas"
	| "infiltrators"
	| "longprobe_y_wing_recon_team"
	| "imperial_commandos"
	| "imperial_espionage_droid"
	| "imperial_probe_droid"
	| "noghri_death_commandos";
export type ShieldSubtype =
	| "death_star_shield"
	| "gen_core_level_i"
	| "gen_core_level_ii";
export type SquadronSubtype =
	| "a_wing"
	| "b_wing"
	| "x_wing"
	| "y_wing"
	| "tie_bomber"
	| "tie_defender"
	| "tie_fighter"
	| "tie_interceptor";
export type TroopSubtype =
	| "alliance_army_regiment"
	| "alliance_fleet_regiment"
	| "mon_calamari_regiment"
	| "sullustan_regiment"
	| "wookie_regiment"
	| "dark_trooper_regiment"
	| "imperial_army_regiment"
	| "imperial_fleet_regiment"
	| "stormtrooper_regiment"
	| "war_droid_regiment";

export type DefenceCategory =
	| "personnel"
	| "troop"
	| "squadron"
	| "shield"
	| "battery";

export type ManufacturingCategory =
	| "shipyard"
	| "training_facility"
	| "construction_yard"
	| "refinery"
	| "mine";

export type ShipType = "capital_ship";

export type CapitalShipSubtype =
	| "alliance_dreadnaught"
	| "alliance_escort_carrier"
	| "assault_frigate"
	| "assault_transport"
	| "bulk_cruiser"
	| "bulk_transport"
	| "bulwark_battlecruiser"
	| "carrack_light_cruiser"
	| "cc_7700_frigate"
	| "cc_9600_frigate"
	| "corellian_corvette"
	| "corellian_gunship"
	| "dauntless_cruiser"
	| "death_star"
	| "galleon"
	| "imperial_dreadnaught"
	| "imperial_escort_carrier"
	| "imperial_ii_star_destroyer"
	| "imperial_star_destroyer"
	| "interdictor_cruiser"
	| "lancer_frigate"
	| "liberator_cruiser"
	| "medium_transport"
	| "mon_calamari_cruiser"
	| "nebulon_b_frigate"
	| "star_galleon"
	| "strike_cruiser"
	| "super_star_destroyer"
	| "victory_destroyer"
	| "victory_ii_star_destroyer";

export type ShipResource = ResourceBase & {
	type: "capital_ship";
	subtype: CapitalShipSubtype;
	damage: "low" | "medium" | "high";
};

export type FleetResource = ResourceBase & {
	type: "fleet";
	subtype: "fleet";
};

export type ShipyardSubtype = "orbital_shipyard" | "advanced_shipyard";
export type TrainingFacilitySubtype =
	| "training_facility"
	| "advanced_training_facility";
export type ConstructionYardSubtype =
	| "construction_yard"
	| "advanced_construction_yard";
export type RefinerySubtype = "refinery";
export type MineSubtype = "mine";

export type ManufacturingResource =
	| (ResourceBase & {
			type: "shipyard";
			subtype: ShipyardSubtype;
	  })
	| (ResourceBase & {
			type: "training_facility";
			subtype: TrainingFacilitySubtype;
	  })
	| (ResourceBase & {
			type: "construction_yard";
			subtype: ConstructionYardSubtype;
	  })
	| (ResourceBase & {
			type: "refinery";
			subtype: RefinerySubtype;
	  })
	| (ResourceBase & {
			type: "mine";
			subtype: MineSubtype;
	  });

export type MissionType =
	| "abduction"
	| "assassination"
	| "death_star_sabotage"
	| "diplomacy"
	| "espionage"
	| "facility_design_research"
	| "incite_uprising"
	| "jedi_training"
	| "reconnaissance"
	| "recruitment"
	| "rescue"
	| "sabotage"
	| "ship_design_research"
	| "subdue_uprising"
	| "troop_training_research";

export type MissionResource = ResourceBase & {
	type: "mission";
	subtype: MissionType;
};

export type ActionableResource =
	| "mission"
	| "personnel"
	| "troop"
	| "squadron"
	| "shield"
	| "battery"
	| "capital_ship"
	| "fleet"
	| "shipyard"
	| "training_facility"
	| "construction_yard"
	| "refinery"
	| "mine"
	| "planet";

export type DefenseResource =
	| (ResourceBase & {
			type: "personnel";
			subtype: PersonnelSubtype;
			injured: boolean;
			imprisoned: boolean;
	  })
	| (ResourceBase & {
			type: "troop";
			subtype: TroopSubtype;
	  })
	| (ResourceBase & {
			type: "squadron";
			subtype: SquadronSubtype;
	  })
	| (ResourceBase & {
			type: "shield";
			subtype: ShieldSubtype;
	  })
	| (ResourceBase & {
			type: "battery";
			subtype: BatterySubtype;
	  });

export interface PlanetDefenses {
	personnel: DefenseResource[];
	troops: DefenseResource[];
	squadrons: DefenseResource[];
	shields: DefenseResource[];
	batteries: DefenseResource[];
}

export interface PlanetManufacturing {
	shipyards: ManufacturingResource[];
	training_facilities: ManufacturingResource[];
	construction_yards: ManufacturingResource[];
	refineries: ManufacturingResource[];
	mines: ManufacturingResource[];
}

// Metadata: Static data that never changes and is known to all players
export interface PlanetMetadata {
	id: string;
	name: string;
	sectorId: string;
	picture: number; // ID of the picture asset
	position: { x: number; y: number };
}

// State: The ground truth about the current state
export interface PlanetState {
	metadata: PlanetMetadata;
	loyalty: number;
	owner: FactionMetadata | "Neutral";
	energySpots: number;
	naturalResources: number;
	garrisonRequirement: number;
	inUprising: boolean;
	isDestroyed: boolean;
	general: string | null;
	commander: string | null;
	isDiscovered: boolean;
	defenses: PlanetDefenses;
	manufacturing: PlanetManufacturing;
}

// View: What a specific faction knows or believes
export interface PlanetView {
	metadata: PlanetMetadata;
	state?: {
		loyalty?: number;
		owner?: FactionMetadata | "Neutral";
		energySpots?: number;
		naturalResources?: number;
		garrisonRequirement?: number;
		inUprising?: boolean;
		isDestroyed: boolean;
		general?: string | null;
		commander?: string | null;
		defenses?: PlanetDefenses;
		manufacturing?: PlanetManufacturing;
	};
	discovered: boolean;
}

export interface SectorMetadata {
	id: string;
	name: string;
	location: { x: number; y: number };
	isInnerRim: boolean;
	planetIds: string[];
}

export type Notification = {
	id: string;
	message: string;
	read: boolean;
};

export interface FactionState {
	resources: {
		mines: number;
		refineries: number;
		refined: number;
	};
	objectives: string[];
	controlledPlanetIds: string[];
}

export interface FactionView {
	resources: {
		mines: number;
		refineries: number;
		refined: number;
	};
	objectives: string[];
}

// GameState contains the full truth
export interface GameState {
	id: string;
	turn: number;
	planets: Record<string, PlanetState>;
	sectors: Record<string, SectorMetadata>;
	factions: Record<FactionMetadata, FactionState>;
	notifications: Notification[];
}

// GameView is what a faction sees
export interface GameView {
	id: string;
	turn: number;
	planets: Record<string, PlanetView>;
	sectors: Record<string, SectorMetadata>;
	faction: FactionView;
	side: FactionMetadata;
	notifications: Notification[];
}

export interface GetGameResponse extends GameView {
	gameState: GameState;
}
