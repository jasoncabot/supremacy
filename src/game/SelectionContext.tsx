import React, { ReactNode, useState } from "react";
import {
	SelectableItem,
	SelectionContext,
	SelectionKind,
	SelectionState,
} from "../hooks/useSelectionContext";
import { useWindowContext } from "../hooks/useWindowContext";
import { getAvailableActions, type ActionDefinition } from "./types/actions";
import { WindowInfo } from "./WindowInfo";

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { handleOpenWindow, handleCloseWindow } = useWindowContext();
	const [selectedItems, setSelectedItems] = useState<SelectableItem[]>([]);
	const [selectionMode, setSelectionKind] = useState<SelectionKind>("none");
	const [selectionState, setSelectionState] = useState<SelectionState>("idle");
	const [currentAction, setCurrentAction] = useState<string | null>(null);
	const [currentActionDef, setCurrentActionDef] =
		useState<ActionDefinition | null>(null);
	const [actionSourceUnits, setActionSourceUnits] = useState<SelectableItem[]>(
		[],
	);
	const [targetItem, setTargetItem] = useState<SelectableItem | null>(null);
	const [pendingActionDetails, setPendingActionDetails] = useState<{
		actionId: string;
		actionDef: ActionDefinition;
		sources: SelectableItem[];
		target?: SelectableItem;
	} | null>(null);

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
				// If no items are selected yet, or if the new item has the same type as existing selections
				if (selectedItems.length === 0 || selectedItems[0].type === item.type) {
					setSelectedItems([...selectedItems, item]);
				} else {
					// Different type selected - replace the entire selection with just this item
					setSelectedItems([item]);
				}
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
		setCurrentActionDef(null);
		setActionSourceUnits([]);
		setTargetItem(null);
		setPendingActionDetails(null);
		setSelectionKind("none");
	};

	const isSelected = (itemId: string) => {
		return selectedItems.some((item) => item.id === itemId);
	};

	const startTargetSelection = (
		actionId: string,
		actionDef?: ActionDefinition,
		sourceUnits?: SelectableItem[],
	) => {
		// Find the action definition if not provided
		let resolvedActionDef = actionDef;
		if (!resolvedActionDef) {
			const availableActions = getAvailableActions(selectedItems);
			resolvedActionDef = availableActions.find(
				(action) => action.id === actionId,
			);
		}

		// Use provided source units or fall back to selected items
		const sources =
			sourceUnits && sourceUnits.length > 0 ? sourceUnits : selectedItems;
		setActionSourceUnits(sources);

		setCurrentAction(actionId);
		setCurrentActionDef(resolvedActionDef || null);
		setSelectionState("awaiting-target");
		setSelectionKind("target");
		setTargetItem(null);
	};

	const selectTarget = (target: SelectableItem) => {
		setTargetItem(target);
		// Show action confirmation window instead of automatically executing
		if (currentAction && currentActionDef) {
			// Use action source units if available, otherwise fall back to selected items
			const sources =
				actionSourceUnits.length > 0 ? actionSourceUnits : selectedItems;
			if (sources.length > 0) {
				showActionConfirmation(
					currentAction,
					currentActionDef,
					sources,
					target,
				);
			}
		}
	};

	const executeAction = () => {
		if (currentAction && selectedItems.length > 0 && targetItem) {
			console.log(
				`Selected items ${selectedItems.map((item) => `${item.type}:${item.id}`).join(", ")} performing action ${currentAction} on target ${targetItem.type}:${targetItem.id}`,
			);
		}
		clearSelection();
	};

	const getWindowTitle = (
		actionDef: ActionDefinition,
		sources: SelectableItem[],
		target: SelectableItem | undefined,
	) => {
		if (actionDef.type === "mission") {
			const agents = sources.filter((item) => item.type === "personnel");
			const decoys = sources.filter(
				(item) => item.type === "troop" || item.type === "squadron",
			);
			const agentNames = agents
				.map((a) => a.name || `Agent ${a.id}`)
				.join(", ");
			const decoyNames = decoys
				.map((d) => d.name || `Decoy ${d.id}`)
				.join(", ");

			return `${actionDef.label} - Agents: ${agentNames} | Decoys: ${decoyNames}${
				target ? ` -> ${target.type}` : ""
			}`;
		} else if (actionDef.type === "move") {
			const estimatedTime = sources.length * 2; // Simple calculation
			return `${actionDef.label} - ${sources.length} unit(s) moving to ${target ? target.type : "selected target"} (Estimated time: ${estimatedTime} hours)`;
		}
		// Default case for other action types
		return `${actionDef.label} - ${sources.length} unit(s) performing action${
			target ? ` on ${target.type}` : ""
		}`;
	};

	const cancelTargetSelection = () => {
		setSelectionState("idle");
		setCurrentAction(null);
		setCurrentActionDef(null);
		setActionSourceUnits([]);
		setTargetItem(null);
		setSelectionKind("multiple"); // Return to previous selection mode
	};

	const showActionConfirmation = (
		actionId: string,
		actionDef: ActionDefinition,
		sources: SelectableItem[],
		target?: SelectableItem,
	) => {
		setPendingActionDetails({
			actionId,
			actionDef,
			sources,
			target,
		});
		setSelectionState("action-confirmation");

		// Open action detail window
		const actionWindow: WindowInfo = {
			id: "action-detail",
			title: getWindowTitle(actionDef, sources, target),
			type: "action-detail",
			position: {
				x: window.innerWidth / 2 - 200,
				y: window.innerHeight / 2 - 150,
			},
		};
		handleOpenWindow(actionWindow);
	};

	const confirmAction = () => {
		if (pendingActionDetails) {
			console.log(
				`Confirmed action: ${pendingActionDetails.actionId} (${pendingActionDetails.actionDef.label})`,
				"Sources:",
				pendingActionDetails.sources,
				"Target:",
				pendingActionDetails.target,
			);

			// Here you would dispatch the actual game action
			// For now we just log and clear
		}

		// Close the action detail window
		handleCloseWindow({
			id: "action-detail",
			title: "",
			type: "action-detail",
			position: { x: 0, y: 0 },
		});

		setPendingActionDetails(null);
		clearSelection();
	};

	const cancelActionConfirmation = () => {
		// Close the action detail window
		handleCloseWindow({
			id: "action-detail",
			title: "",
			type: "action-detail",
			position: { x: 0, y: 0 },
		});

		setPendingActionDetails(null);
		setSelectionState("idle");
	};

	return (
		<SelectionContext.Provider
			value={{
				selectedItems,
				selectionMode,
				selectionState,
				currentAction,
				targetItem,
				pendingActionDetails,
				toggleSelectionKind,
				selectItem,
				deselectItem,
				clearSelection,
				isSelected,
				startTargetSelection,
				selectTarget,
				executeAction,
				cancelTargetSelection,
				showActionConfirmation,
				confirmAction,
				cancelActionConfirmation,
			}}
		>
			{children}
		</SelectionContext.Provider>
	);
};
