import { createContext, useContext } from "react";

export type SelectableItem = {
	id: string;
	type: string; // TODO: better types here e.g 'PLANET', 'PERSONNEL', 'SPECIAL_FORCES', 'TROOPS', 'FIGHTERS', 'SHIELD', 'BATTERY', 'SHIPYARD', 'TRAINING', 'CONSTRUCTION', 'MINE', 'REFINERY'
	[key: string]: unknown;
};

export type SelectionKind = "none" | "single" | "multiple";

interface SelectionContextType {
	selectedItems: SelectableItem[];
	selectionMode: SelectionKind;
	toggleSelectionKind: (mode: SelectionKind) => void;
	selectItem: (item: SelectableItem) => void;
	deselectItem: (itemId: string) => void;
	clearSelection: () => void;
	isSelected: (itemId: string) => boolean;
}

// Create context with default values
export const SelectionContext = createContext<SelectionContextType>({
	selectedItems: [],
	selectionMode: "none",
	toggleSelectionKind: () => {},
	selectItem: () => {},
	deselectItem: () => {},
	clearSelection: () => {},
	isSelected: () => false,
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
