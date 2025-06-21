import React, { ReactNode, useState } from "react";

import { AssignedCommandType, MissionType } from "../../worker/api";
import { generateUUID } from "../utils/uuid";
import {
	ActionQueueContext,
	ActionQueueContextType,
} from "./ActionQueueContextDef";
import {
	CreateFleetActionData,
	MissionActionData,
	QueuedAction,
} from "./types/actionQueue";
import {
	ActionTarget,
	ActionType,
	FleetTarget,
	MissionTarget,
	ShipTarget,
	StructureTarget,
	UnitTarget,
} from "./types/actions";

export const ActionQueueProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [actions, setActions] = useState<QueuedAction[]>([]);

	const addAction = (action: Omit<QueuedAction, "id" | "timestamp">) => {
		const newAction: QueuedAction = {
			...action,
			id: generateUUID(),
			timestamp: Date.now(),
		};
		console.log("Adding action to queue:", newAction);
		setActions((prev) => [...prev, newAction]);
	};

	const removeAction = (actionId: string) => {
		setActions((prev) => prev.filter((action) => action.id !== actionId));
	};

	const clearActions = () => {
		setActions([]);
	};

	const createFleet = (ships: ShipTarget[], newFleetName: string): string => {
		// Generate a new fleet ID using the same pattern as the server
		const newFleetId = `fleet:${generateUUID()}`;

		const createFleetData: CreateFleetActionData = {
			newFleetId,
			newFleetName,
		};

		addAction({
			type: "create_fleet" as ActionType,
			sources: ships,
			data: createFleetData,
		});

		return newFleetId;
	};

	const moveUnit = (unit: UnitTarget, destination: ActionTarget) => {
		addAction({
			type: "move" as ActionType,
			sources: [unit],
			target: destination,
		});
	};

	const scrap = (item: UnitTarget | StructureTarget | ShipTarget) => {
		addAction({
			type: "scrap" as ActionType,
			sources: [item],
		});
	};

	const renameUnit = (unit: UnitTarget, newName: string) => {
		addAction({
			type: "rename" as ActionType,
			sources: [unit],
			data: { newName },
		});
	};

	const bombardTarget = (fleet: FleetTarget, target: ActionTarget) => {
		addAction({
			type: "bombard" as ActionType,
			sources: [fleet],
			target,
		});
	};

	const assaultTarget = (fleet: FleetTarget, target: ActionTarget) => {
		addAction({
			type: "assault" as ActionType,
			sources: [fleet],
			target,
		});
	};

	const executeMission = (
		sources: UnitTarget[],
		target: ActionTarget,
		missionType: MissionType,
		missionData?: MissionActionData,
	) => {
		const actionData: Record<string, unknown> = {};

		if (missionType) {
			actionData.missionType = missionType;
		}

		if (missionData?.agents) {
			actionData.agents = missionData.agents;
		}

		if (missionData?.decoys) {
			actionData.decoys = missionData.decoys;
		}

		addAction({
			type: "mission" as ActionType,
			sources: sources,
			target,
			data: actionData,
		});
	};

	const assignCommand = (
		unit: UnitTarget,
		commandType: AssignedCommandType,
	) => {
		addAction({
			type: "command" as ActionType,
			sources: [unit],
			data: { commandType },
		});
	};

	const buildItem = (
		structures: StructureTarget[],
		buildType: string,
		data?: Record<string, unknown>,
	) => {
		addAction({
			type: "build" as ActionType,
			sources: structures,
			data: { buildType, ...data },
		});
	};

	const stopProduction = (structures: StructureTarget[]) => {
		addAction({
			type: "stop" as ActionType,
			sources: structures,
		});
	};

	const abortMission = (mission: MissionTarget) => {
		addAction({
			type: "abort" as ActionType,
			sources: [mission],
		});
	};

	const value: ActionQueueContextType = {
		actions,
		addAction,
		removeAction,
		clearActions,
		createFleet,
		moveUnit,
		scrap,
		renameUnit,
		bombardTarget,
		assaultTarget,
		executeMission,
		assignCommand,
		buildItem,
		stopProduction,
		abortMission,
	};

	return (
		<ActionQueueContext.Provider value={value}>
			{children}
		</ActionQueueContext.Provider>
	);
};
