import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { useSelection } from "../hooks/useSelection";
import { useActionQueue } from "./ActionQueueContextDef";
import {
	Command,
	CommandContext,
	CommandContextType,
	CommandPhase,
} from "./CommandContextDef";
import {
	ActionTarget,
	createActionTarget,
	FleetTarget,
	getAvailableActions,
	ShipTarget,
	StructureTarget,
	UnitTarget,
} from "./types/actions";


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
						sources.forEach((source) => {
							moveUnit(createActionTarget(source) as UnitTarget, target);
						});
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
						const sourceUnits = sources
							.map((source) => createActionTarget(source))
							.filter((x) => x !== null) as UnitTarget[];
						const missionType = c.missionData?.missionType;
						if (missionType) {
							executeMission(sourceUnits, target, missionType, {
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
						bombardTarget(createActionTarget(sources[0]) as FleetTarget, target);
					} else {
						console.warn("Bombard action requires exactly one fleet source.");
					}
					break;
				}
				case "assault": {
					if (sources.length === 1 && sources[0].type === "fleet" && target) {
						assaultTarget(createActionTarget(sources[0]) as FleetTarget, target);
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
						abortMission(target);
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
			provideTarget: (target: ActionTarget) => {
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
