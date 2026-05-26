import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { SelectableItemWithLocation, useSelection } from "../hooks/useSelection";
import { useActionQueue } from "./ActionQueueContextDef";
import {
	Command,
	CommandContext,
	CommandContextType,
	CommandPhase,
} from "./CommandContextDef";
import {
	ActionTarget,
	FleetTarget,
	getAvailableActions,
	MissionTarget,
	ShipTarget,
	StructureTarget,
	UnitTarget,
} from "./types/actions";

// Build a typed ActionTarget from a selected item. Switching on the discriminant
// narrows the item, so each branch is type-checked against the matching target
// shape with no casts. The believed item rides along as `data` — at resolution
// the server treats it as a claim, not truth.
const createActionTarget = (
	item: SelectableItemWithLocation,
): ActionTarget | null => {
	// Planets are the only target that isn't located at another planet.
	if (item.type === "planet") {
		return { type: "planet", id: item.id, data: item };
	}

	// Every other target lives at a planet; without one it isn't actionable.
	const planetId = item.location.planetId;
	if (!planetId) {
		console.warn(`Target ${item.id} has no planet location`);
		return null;
	}

	switch (item.type) {
		case "mission":
			return { type: "mission", id: item.id, data: item, planetId };
		case "capital_ship":
			return { type: "ship", id: item.id, data: item, planetId };
		case "fleet":
			return { type: "fleet", id: item.id, data: item, planetId };
		case "shipyard":
		case "training_facility":
		case "construction_yard":
		case "refinery":
		case "mine":
			return { type: "structure", id: item.id, data: item, planetId };
		case "personnel":
		case "troop":
		case "squadron":
		case "shield":
		case "battery":
			return {
				type: "unit",
				id: item.id,
				data: item,
				planetId,
				shipId: item.location.shipId,
			};
		default: {
			// Exhaustive: every remaining item type is handled above.
			const exhaustiveCheck: never = item;
			console.warn(`Unknown item type for action target: ${exhaustiveCheck}`);
			return null;
		}
	}
};

export const CommandProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { selectedItems, clearSelection } = useSelection();
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

	const [phase, setPhase] = useState<CommandPhase>("idle");
	const [command, setCommand] = useState<Command | null>(null);

	const reset = useCallback(() => {
		setPhase("idle");
		setCommand(null);
	}, []);

	// Dispatch a fully-specified command into the action queue.
	const execute = useCallback(
		(c: Command) => {
			const { actionDef, sources, target } = c;
			switch (actionDef.type) {
				case "create_fleet": {
					if (sources.length === 1 && sources[0].type === "capital_ship") {
						const ships = sources.map((x) => createActionTarget(x) as ShipTarget);
						createFleet(ships, `New Fleet ${sources[0].name || sources[0].id}`);
					}
					break;
				}
				case "move": {
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
					if (target) {
						const actionTarget = createActionTarget(target);
						const sourceUnits = sources
							.map((source) => createActionTarget(source))
							.filter((x) => x !== null) as UnitTarget[];
						const missionType = c.missionData?.missionType;
						if (actionTarget && missionType) {
							executeMission(sourceUnits, actionTarget, missionType, {
								agents: c.missionData?.agents,
								decoys: c.missionData?.decoys,
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
				default:
					console.warn(`Unhandled action type: ${actionDef.type}`, sources);
			}
		},
		[
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
		],
	);

	const value = useMemo<CommandContextType>(
		() => ({
			phase,
			command,
			startTargetSelection: (actionId, actionDef, sourceUnits) => {
				const resolvedActionDef =
					actionDef ??
					getAvailableActions(selectedItems).find((a) => a.id === actionId);
				if (!resolvedActionDef) return;
				const sources =
					sourceUnits && sourceUnits.length > 0 ? sourceUnits : selectedItems;
				setCommand({ actionId, actionDef: resolvedActionDef, sources });
				setPhase("awaiting-target");
			},
			provideTarget: (target) => {
				setCommand((c) => (c ? { ...c, target } : c));
				setPhase("confirming");
			},
			showActionConfirmation: (actionId, actionDef, sources, target) => {
				setCommand({ actionId, actionDef, sources, target });
				setPhase("confirming");
			},
			updateMissionData: (missionData) =>
				setCommand((c) => (c ? { ...c, missionData } : c)),
			confirm: (missionData) => {
				if (!command) return;
				execute(missionData ? { ...command, missionData } : command);
				reset();
				clearSelection();
			},
			cancel: () => {
				reset();
				clearSelection();
			},
			cancelTargetSelection: reset,
		}),
		[phase, command, selectedItems, execute, reset, clearSelection],
	);

	return (
		<CommandContext.Provider value={value}>{children}</CommandContext.Provider>
	);
};
