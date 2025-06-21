import React, { ReactNode, useState } from "react";
import {
	DefenseResource,
	FleetResource,
	ManufacturingResource,
	MissionResource,
	MissionType,
	PlanetView,
	ShipResource,
} from "../../worker/api";
import {
	SelectableItemWithLocation,
	SelectionContext,
	SelectionMode,
	SelectionState,
} from "../hooks/useSelectionContext";
import { useWindowContext } from "../hooks/useWindowContext";
import { useActionQueue } from "./ActionQueueContextDef";
import {
	ActionTarget,
	FleetTarget,
	getAvailableActions,
	MissionTarget,
	PlanetTarget,
	ShipTarget,
	StructureTarget,
	UnitTarget,
	type ActionDefinition,
} from "./types/actions";
import { WindowInfo } from "./WindowInfo";

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { handleOpenWindow, handleCloseWindow } = useWindowContext();
	const {
		executeMission,
		createFleet,
		moveUnit,
		scrap,
		renameUnit,
		bombardTarget,
		assaultTarget,
		assignCommand,
		buildItem,
		stopProduction,
		abortMission,
	} = useActionQueue();
	const [selectedItems, setSelectedItems] = useState<
		SelectableItemWithLocation[]
	>([]);
	const [selectionMode, setSelectionKind] = useState<SelectionMode>("none");
	const [selectionState, setSelectionState] = useState<SelectionState>("idle");
	const [currentAction, setCurrentAction] = useState<string | null>(null);
	const [currentActionDef, setCurrentActionDef] =
		useState<ActionDefinition | null>(null);
	const [actionSourceUnits, setActionSourceUnits] = useState<
		SelectableItemWithLocation[]
	>([]);
	const [targetItem, setTargetItem] =
		useState<SelectableItemWithLocation | null>(null);
	const [pendingActionDetails, setPendingActionDetails] = useState<{
		actionId: string;
		actionDef: ActionDefinition;
		sources: SelectableItemWithLocation[];
		target?: SelectableItemWithLocation;
		missionData?: {
			agents?: string[];
			decoys?: string[];
			missionType?: MissionType;
		};
	} | null>(null);

	const toggleSelectionKind = (mode: SelectionMode) => {
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

	const selectItem = (item: SelectableItemWithLocation) => {
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
		sourceUnits?: SelectableItemWithLocation[],
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

	const selectTarget = (target: SelectableItemWithLocation) => {
		const targetWithContext: SelectableItemWithLocation = {
			...target,
			location: {
				planetId: target.location?.planetId || undefined,
				fleetId: target.location?.fleetId || undefined,
				shipId: target.location?.shipId || undefined,
			},
		};

		setTargetItem(targetWithContext);
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
					targetWithContext,
				);
			}
		}
	};

	// Helper function to create proper ActionTarget from SelectableItemWithContext
	const createActionTarget = (
		targetItem: SelectableItemWithLocation,
	): ActionTarget | null => {
		const itemType = targetItem.type;
		switch (itemType) {
			case "planet":
				return {
					type: "planet",
					id: targetItem.id,
					data: targetItem as unknown as PlanetView,
				} as PlanetTarget;
			case "mission":
				return {
					type: "mission",
					id: targetItem.id,
					data: targetItem as unknown as MissionResource,
					planetId: targetItem.location.planetId,
				} as MissionTarget;
			case "capital_ship":
				return {
					type: "ship",
					id: targetItem.id,
					data: targetItem as unknown as ShipResource,
					planetId: targetItem.location.planetId,
				} as ShipTarget;
			case "fleet":
				return {
					type: "fleet",
					id: targetItem.id,
					data: targetItem as unknown as FleetResource,
					planetId: targetItem.location.planetId,
				} as FleetTarget;
			case "shipyard":
			case "training_facility":
			case "construction_yard":
			case "refinery":
			case "mine":
				return {
					type: "structure",
					id: targetItem.id,
					data: targetItem as unknown as ManufacturingResource,
					planetId: targetItem.location.planetId,
				} as StructureTarget;
			case "personnel":
			case "troop":
			case "squadron":
			case "shield":
			case "battery":
				return {
					type: "unit",
					id: targetItem.id,
					data: targetItem as unknown as DefenseResource,
					planetId: targetItem.location.planetId,
					shipId: targetItem.location.shipId,
				} as UnitTarget;
			default: {
				// This should never happen if all cases are covered
				const exhaustiveCheck: never = itemType;
				console.warn(`Unknown item type for action target: ${exhaustiveCheck}`);
				return null;
			}
		}
	};

	const executeAction = (actionDetails?: typeof pendingActionDetails) => {
		const details = actionDetails || pendingActionDetails;
		if (!details) return;

		const { actionDef, sources, target } = details;

		// Handle different action types
		switch (actionDef.type) {
			case "create_fleet": {
				// For create fleet, we expect a single ship source
				if (sources.length === 1 && sources[0].type === "capital_ship") {
					const ships = sources.map((x) => createActionTarget(x) as ShipTarget);
					const newFleetName = `New Fleet ${sources[0].name || sources[0].id}`;
					const newFleetId = createFleet(ships, newFleetName);
					if (newFleetId) {
						// Optionally, you can handle the new fleet ID here
						console.log(`Created new fleet with ID: ${newFleetId}`);
					} else {
						console.warn("Failed to create fleet with provided ships.");
					}
				}
				break;
			}
			case "move": {
				// For move actions, add to queue with target
				if (target) {
					const actionTarget = createActionTarget(target);
					if (actionTarget) {
						sources.forEach((source) => {
							moveUnit(createActionTarget(source) as UnitTarget, actionTarget);
						});
					}
				}
				break;
			}
			case "scrap": {
				// For scrap actions, add to queue without target
				sources.forEach((source) => {
					scrap(
						createActionTarget(source) as
							| UnitTarget
							| StructureTarget
							| ShipTarget,
					);
				});
				break;
			}
			case "mission": {
				// For mission actions, use the primary personnel unit and include mission data
				if (target) {
					const actionTarget = createActionTarget(target);
					const actionSourceUnits = sources
						.map((source) => createActionTarget(source))
						.filter((x) => x !== null) as UnitTarget[];
					const missionType = details.missionData?.missionType;
					if (actionTarget && missionType) {
						const agents = details.missionData?.agents;
						const decoys = details.missionData?.decoys;

						executeMission(actionSourceUnits, actionTarget, missionType, {
							agents,
							decoys,
						});
					}
				}
				break;
			}
			case "rename": {
				renameUnit(
					createActionTarget(sources[0]) as UnitTarget,
					`something new`, // TODO: prompt and gather data
				);
				break;
			}
			case "bombard": {
				// For bombard actions, we expect a fleet source and a target
				if (sources.length === 1 && sources[0].type === "fleet" && target) {
					const actionTarget = createActionTarget(target);
					if (actionTarget) {
						bombardTarget(
							createActionTarget(sources[0]) as FleetTarget,
							actionTarget,
						);
					}
				} else {
					console.warn("Bombard action requires exactly one fleet source.");
				}
				break;
			}

			case "assault": {
				// For assault actions, we expect a fleet source and a target
				if (sources.length === 1 && sources[0].type === "fleet" && target) {
					const actionTarget = createActionTarget(target);
					if (actionTarget) {
						assaultTarget(
							createActionTarget(sources[0]) as FleetTarget,
							actionTarget,
						);
					}
				} else {
					console.warn("Assault action requires exactly one fleet source.");
				}
				break;
			}
			case "command": {
				// For command actions, we expect a single unit source
				if (sources.length === 1 && sources[0].type === "personnel") {
					assignCommand(
						createActionTarget(sources[0]) as UnitTarget,
						"admiral", // TODO: prompt and gather command type
					);
				} else {
					console.warn("Command action requires exactly one personnel source.");
				}
				break;
			}
			case "build": {
				// For build actions, we expect structure sources and optional data
				const structures = sources.map(
					(source) => createActionTarget(source) as StructureTarget,
				);
				if (structures.length > 0) {
					buildItem(structures, "ship", {
						buildType: "ship", // TODO: prompt and gather build type
					});
				} else {
					console.warn("Build action requires at least one structure source.");
				}
				break;
			}
			case "stop": {
				// For stop production actions, we expect structure sources
				const structures = sources.map(
					(source) => createActionTarget(source) as StructureTarget,
				);
				if (structures.length > 0) {
					stopProduction(structures);
				} else {
					console.warn("Stop action requires at least one structure source.");
				}
				break;
			}
			case "abort": {
				// For abort mission actions, we expect a mission target
				if (target && target.type === "mission") {
					const actionTarget = createActionTarget(target);
					if (actionTarget) {
						abortMission(actionTarget as MissionTarget);
					}
				} else {
					console.warn("Abort action requires a valid mission target.");
				}
				break;
			}
			default: {
				alert(JSON.stringify(pendingActionDetails, null, 2));
				console.warn(
					`Unhandled action type: ${actionDef.type} for sources:`,
					sources,
				);
				break;
			}
		}

		// Clear the action state
		clearSelection();
		setPendingActionDetails(null);
		setSelectionState("idle");
	};

	const getWindowTitle = (
		actionDef: ActionDefinition,
		sources: SelectableItemWithLocation[],
		target: SelectableItemWithLocation | undefined,
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
		sources: SelectableItemWithLocation[],
		target?: SelectableItemWithLocation,
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

	const updateMissionData = (missionData: {
		agents?: string[];
		decoys?: string[];
		missionType?: MissionType;
	}) => {
		if (pendingActionDetails) {
			setPendingActionDetails({
				...pendingActionDetails,
				missionData,
			});
		}
	};

	const confirmAction = (missionData?: {
		agents?: string[];
		decoys?: string[];
		missionType: MissionType;
	}) => {
		if (pendingActionDetails) {
			// Update pending action details with mission data if provided
			const updatedActionDetails = missionData
				? {
						...pendingActionDetails,
						missionData,
					}
				: pendingActionDetails;

			// Execute the action using the action queue with updated details
			executeAction(updatedActionDetails);
		}

		// Close the action detail window
		handleCloseWindow({
			id: "action-detail",
			title: "",
			type: "action-detail",
			position: { x: 0, y: 0 },
		});
	};

	const cancelActionConfirmation = () => {
		// Close the action detail window
		handleCloseWindow({
			id: "action-detail",
			title: "",
			type: "action-detail",
			position: { x: 0, y: 0 },
		});

		// Clear all selection state including selected items, targets, and mission types
		clearSelection();
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
				toggleSelectionMode: toggleSelectionKind,
				selectItem,
				deselectItem,
				clearSelection,
				isSelected,
				startTargetSelection,
				selectTarget,
				executeAction,
				cancelTargetSelection,
				showActionConfirmation,
				updateMissionData,
				confirmAction,
				cancelActionConfirmation,
			}}
		>
			{children}
		</SelectionContext.Provider>
	);
};
