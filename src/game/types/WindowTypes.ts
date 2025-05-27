// Define window types used across the game

// Types for minimized windows
export type MinimizedWindowType = {
	id: string;
	title: string;
	type: "sector" | "view";
	// For sectors we just need the sectorId
	sectorId?: string;
	// For view windows we need both sectorId and planetId plus the view type
	planetId?: string;
	viewType?: ViewWindowViewType;
};

// Define view window type that will be used in GameContent and GameScreen
export type ViewWindowViewType =
	| "fleets"
	| "defence"
	| "manufacturing"
	| "missions";

export type ViewWindowType = {
	id: string;
	sectorId: string;
	planetId: string;
	viewType: ViewWindowViewType;
};
