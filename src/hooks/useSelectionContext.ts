import { createContext, useContext } from "react";
import {
	DefenseResource,
	FleetResource,
	ManufacturingResource,
	PlanetView,
	ShipResource,
} from "../../worker/api";
import type { ActionDefinition } from "../game/types/actions";

export type SelectableItem =
	| DefenseResource
	| ManufacturingResource
	| ShipResource
	| FleetResource
	| (PlanetView & { type: "planet"; id: string });

export type SelectionKind = "none" | "single" | "multiple" | "target";

export type SelectionState = "idle" | "awaiting-target" | "action-confirmation";

interface SelectionContextType {
	selectedItems: SelectableItem[];
	selectionMode: SelectionKind;
	selectionState: SelectionState;
	currentAction: string | null;
	targetItem: SelectableItem | null;
	// Add action confirmation state
	pendingActionDetails: {
		actionId: string;
		actionDef: ActionDefinition;
		sources: SelectableItem[];
		target?: SelectableItem;
	} | null;
	toggleSelectionKind: (mode: SelectionKind) => void;
	selectItem: (item: SelectableItem) => void;
	deselectItem: (itemId: string) => void;
	clearSelection: () => void;
	isSelected: (itemId: string) => boolean;
	startTargetSelection: (
		actionId: string,
		actionDef?: ActionDefinition,
		sourceUnits?: SelectableItem[],
	) => void;
	selectTarget: (target: SelectableItem) => void;
	executeAction: () => void;
	cancelTargetSelection: () => void;
	showActionConfirmation: (
		actionId: string,
		actionDef: ActionDefinition,
		sources: SelectableItem[],
		target?: SelectableItem,
	) => void;
	confirmAction: () => void;
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
	toggleSelectionKind: () => {},
	selectItem: () => {},
	deselectItem: () => {},
	clearSelection: () => {},
	isSelected: () => false,
	startTargetSelection: () => {},
	selectTarget: () => {},
	executeAction: () => {},
	cancelTargetSelection: () => {},
	showActionConfirmation: () => {},
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
