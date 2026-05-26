import React, { ReactNode, useMemo, useState } from "react";
import {
	SelectableItemWithLocation,
	SelectionContext,
	SelectionContextType,
	SelectionMode,
} from "../hooks/useSelection";

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [selectedItems, setSelectedItems] = useState<
		SelectableItemWithLocation[]
	>([]);
	const [selectionMode, setSelectionMode] = useState<SelectionMode>("none");

	const value = useMemo<SelectionContextType>(() => {
		const isSelected = (itemId: string) =>
			selectedItems.some((item) => item.id === itemId);

		return {
			selectedItems,
			selectionMode,
			isSelected,
			selectItem: (item) => {
				if (selectionMode === "none") return;
				if (selectionMode === "single") {
					setSelectedItems([item]);
					return;
				}
				// multiple: keep a single-type selection, replacing on a type change
				if (isSelected(item.id)) return;
				setSelectedItems(
					selectedItems.length === 0 || selectedItems[0].type === item.type
						? [...selectedItems, item]
						: [item],
				);
			},
			deselectItem: (itemId) =>
				setSelectedItems(selectedItems.filter((item) => item.id !== itemId)),
			clearSelection: () => {
				setSelectedItems([]);
				setSelectionMode("none");
			},
			toggleSelectionMode: (mode) => {
				if (mode === selectionMode) {
					// Clicking the active mode turns selection off.
					setSelectionMode("none");
					setSelectedItems([]);
					return;
				}
				setSelectionMode(mode);
				// Narrowing to single keeps only the first item; widening preserves all.
				if (mode === "single" && selectedItems.length > 1) {
					setSelectedItems([selectedItems[0]]);
				}
			},
		};
	}, [selectedItems, selectionMode]);

	return (
		<SelectionContext.Provider value={value}>
			{children}
		</SelectionContext.Provider>
	);
};
