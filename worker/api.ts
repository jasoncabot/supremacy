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

// Metadata: Static data that never changes and is known to all players
export interface PlanetMetadata {
	id: string;
	name: string;
	sectorId: string;
	picture: string;
	size: number;
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
	general: string | null;
	commander: string | null;
	isDiscovered: boolean;
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
		general?: string | null;
		commander?: string | null;
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
