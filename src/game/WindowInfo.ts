// Types for minimized windows
export type WindowInfo = {
	planetId?: string;
	sectorId?: string;
	id: string;
	title: string;
	type: WindowInfoType;
	position: { x: number; y: number };
};

// Define view window type that will be used in GameContent and GameScreen
export type WindowInfoType =
	| "sector"
	| "fleets"
	| "defence"
	| "manufacturing"
	| "missions";
