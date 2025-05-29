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
			// Clear selection when switching modes
			clearSelection();
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
