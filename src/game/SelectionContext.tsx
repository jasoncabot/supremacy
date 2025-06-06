import React, { ReactNode, useState } from "react";
import {
    SelectableItem,
    SelectionContext,
    SelectionKind,
} from "../hooks/useSelectionContext";

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [selectedItems, setSelectedItems] = useState<SelectableItem[]>([]);
	const [selectionMode, setSelectionKind] = useState<SelectionKind>("none");

	const toggleSelectionKind = (mode: SelectionKind) => {
		if (mode === selectionMode) {
			// If clicking the active mode, turn it off
			setSelectionKind("none");
			clearSelection();
		} else {
			setSelectionKind(mode);
			// Handle mode transitions
			if (mode === "single" && selectedItems.length > 1) {
				// When switching from multiple to single, keep only the first selected item
				setSelectedItems([selectedItems[0]]);
			}
			// When switching from single to multiple, preserve the existing selection
		}
	};

	const selectItem = (item: SelectableItem) => {
		if (selectionMode === "none") return;

		if (selectionMode === "single") {
			setSelectedItems([item]);
		} else if (selectionMode === "multiple") {
			// Check if item is already selected
			if (!isSelected(item.id)) {
				setSelectedItems([...selectedItems, item]);
			}
		}
	};

	const deselectItem = (itemId: string) => {
		setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
	};

	const clearSelection = () => {
		setSelectedItems([]);
	};

	const isSelected = (itemId: string) => {
		return selectedItems.some((item) => item.id === itemId);
	};

	return (
		<SelectionContext.Provider
			value={{
				selectedItems,
				selectionMode,
				toggleSelectionKind,
				selectItem,
				deselectItem,
				clearSelection,
				isSelected,
			}}
		>
			{children}
		</SelectionContext.Provider>
	);
};
