import { createContext, useContext } from "react";
import {
	DefenseResource,
	FleetResource,
	ManufacturingResource,
	MissionResource,
	MissionType,
	PlanetView,
	ShipResource,
} from "../../worker/api";
import type { ActionDefinition } from "../game/types/actions";

type SelectableItem =
	| DefenseResource
	| ManufacturingResource
	| ShipResource
	| FleetResource
	| MissionResource
	| (PlanetView & { type: "planet"; id: string });

export type SelectableItemWithLocation = SelectableItem & {
	location: {
		planetId?: string;
		fleetId?: string;
		shipId?: string;
	};
};

export type SelectionMode = "none" | "single" | "multiple" | "target";

export type SelectionState = "idle" | "awaiting-target" | "action-confirmation";

interface SelectionContextType {
	selectedItems: SelectableItemWithLocation[];
	selectionMode: SelectionMode;
	selectionState: SelectionState;
	currentAction: string | null;
	targetItem: SelectableItemWithLocation | null;
	// Add action confirmation state
	pendingActionDetails: {
		actionId: string;
		actionDef: ActionDefinition;
		sources: SelectableItemWithLocation[];
		target?: SelectableItemWithLocation;
		missionData?: {
			agents?: string[];
			decoys?: string[];
			missionType?: string;
		};
	} | null;
	toggleSelectionMode: (mode: SelectionMode) => void;
	selectItem: (item: SelectableItemWithLocation) => void;
	deselectItem: (itemId: string) => void;
	clearSelection: () => void;
	isSelected: (itemId: string) => boolean;
	startTargetSelection: (
		actionId: string,
		actionDef?: ActionDefinition,
		sourceUnits?: SelectableItemWithLocation[],
	) => void;
	selectTarget: (target: SelectableItemWithLocation) => void;
	executeAction: () => void;
	cancelTargetSelection: () => void;
	showActionConfirmation: (
		actionId: string,
		actionDef: ActionDefinition,
		sources: SelectableItemWithLocation[],
		target?: SelectableItemWithLocation,
	) => void;
	updateMissionData: (missionData: {
		agents?: string[];
		decoys?: string[];
		missionType?: MissionType;
	}) => void;
	confirmAction: (missionData?: {
		agents?: string[];
		decoys?: string[];
		missionType: MissionType;
	}) => void;
	cancelActionConfirmation: () => void;
}

// Create context with default values
export const SelectionContext = createContext<SelectionContextType>({
	selectedItems: [],
	selectionMode: "none",
	selectionState: "idle",
	currentAction: null,
	targetItem: null,
	pendingActionDetails: null,
	toggleSelectionMode: () => {},
	selectItem: () => {},
	deselectItem: () => {},
	clearSelection: () => {},
	isSelected: () => false,
	startTargetSelection: () => {},
	selectTarget: () => {},
	executeAction: () => {},
	cancelTargetSelection: () => {},
	showActionConfirmation: () => {},
	updateMissionData: () => {},
	confirmAction: () => {},
	cancelActionConfirmation: () => {},
});

export const useSelectionContext = () => {
	const context = useContext(SelectionContext);
	if (!context) {
		throw new Error(
			"useSelectionContext must be used within a SelectionProvider",
		);
	}
	return context;
};
