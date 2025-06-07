import React, { ReactNode, useState } from "react";
import {
    SelectableItem,
    SelectionContext,
    SelectionKind,
    SelectionState,
} from "../hooks/useSelectionContext";

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [selectedItems, setSelectedItems] = useState<SelectableItem[]>([]);
	const [selectionMode, setSelectionKind] = useState<SelectionKind>("none");
	const [selectionState, setSelectionState] = useState<SelectionState>("idle");
	const [currentAction, setCurrentAction] = useState<string | null>(null);
	const [targetItem, setTargetItem] = useState<SelectableItem | null>(null);

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

		if (selectionMode === "target") {
			// In target mode, select the target
			selectTarget(item);
			return;
		}

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
		setSelectionState("idle");
		setCurrentAction(null);
		setTargetItem(null);
		setSelectionKind("none");
	};

	const isSelected = (itemId: string) => {
		return selectedItems.some((item) => item.id === itemId);
	};

	const startTargetSelection = (actionId: string) => {
		setCurrentAction(actionId);
		setSelectionState("awaiting-target");
		setSelectionKind("target");
		setTargetItem(null);
	};

	const selectTarget = (target: SelectableItem) => {
		setTargetItem(target);
		// Automatically execute the action when target is selected
		executeActionWithTarget(target);
	};

	const executeActionWithTarget = (target: SelectableItem) => {
		if (currentAction && selectedItems.length > 0) {
			console.log(
				`Selected items ${selectedItems.map(item => `${item.type}:${item.id}`).join(', ')} performing action ${currentAction} on target ${target.type}:${target.id}`
			);
		}
		clearSelection();
	};

	const executeAction = () => {
		if (currentAction && selectedItems.length > 0 && targetItem) {
			console.log(
				`Selected items ${selectedItems.map(item => `${item.type}:${item.id}`).join(', ')} performing action ${currentAction} on target ${targetItem.type}:${targetItem.id}`
			);
		}
		clearSelection();
	};

	const cancelTargetSelection = () => {
		setSelectionState("idle");
		setCurrentAction(null);
		setTargetItem(null);
		setSelectionKind("multiple"); // Return to previous selection mode
	};

	return (
		<SelectionContext.Provider
			value={{
				selectedItems,
				selectionMode,
				selectionState,
				currentAction,
				targetItem,
				toggleSelectionKind,
				selectItem,
				deselectItem,
				clearSelection,
				isSelected,
				startTargetSelection,
				selectTarget,
				executeAction,
				cancelTargetSelection,
			}}
		>
			{children}
		</SelectionContext.Provider>
	);
};
