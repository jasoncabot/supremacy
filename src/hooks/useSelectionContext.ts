import { createContext, useContext } from "react";
import {
	DefenseResource,
	FleetResource,
	ManufacturingResource,
	PlanetView,
	ShipResource,
} from "../../worker/api";

export type SelectableItem =
	| DefenseResource
	| ManufacturingResource
	| ShipResource
	| FleetResource
	| (PlanetView & { type: "planet"; id: string });

export type SelectionKind = "none" | "single" | "multiple" | "target";

export type SelectionState = "idle" | "awaiting-target";

interface SelectionContextType {
	selectedItems: SelectableItem[];
	selectionMode: SelectionKind;
	selectionState: SelectionState;
	currentAction: string | null;
	targetItem: SelectableItem | null;
	toggleSelectionKind: (mode: SelectionKind) => void;
	selectItem: (item: SelectableItem) => void;
	deselectItem: (itemId: string) => void;
	clearSelection: () => void;
	isSelected: (itemId: string) => boolean;
	startTargetSelection: (actionId: string) => void;
	selectTarget: (target: SelectableItem) => void;
	executeAction: () => void;
	cancelTargetSelection: () => void;
}

// Create context with default values
export const SelectionContext = createContext<SelectionContextType>({
	selectedItems: [],
	selectionMode: "none",
	selectionState: "idle",
	currentAction: null,
	targetItem: null,
	toggleSelectionKind: () => {},
	selectItem: () => {},
	deselectItem: () => {},
	clearSelection: () => {},
	isSelected: () => false,
	startTargetSelection: () => {},
	selectTarget: () => {},
	executeAction: () => {},
	cancelTargetSelection: () => {},
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
