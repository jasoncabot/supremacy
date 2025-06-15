import React, { ReactNode, useState } from "react";
import { QueuedAction, CreateFleetActionData } from "./types/actionQueue";
import { ActionType, ActionTarget } from "./types/actions";
import { ActionQueueContext, ActionQueueContextType } from "./ActionQueueContextDef";
import { generateUUID } from "../utils/uuid";

export const ActionQueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [actions, setActions] = useState<QueuedAction[]>([]);

	const addAction = (action: Omit<QueuedAction, "id" | "timestamp">) => {
		const newAction: QueuedAction = {
			...action,
			id: generateUUID(),
			timestamp: Date.now(),
		};
		setActions(prev => [...prev, newAction]);
	};

	const removeAction = (actionId: string) => {
		setActions(prev => prev.filter(action => action.id !== actionId));
	};

	const clearActions = () => {
		setActions([]);
	};

	const createFleet = (sourceShipId: string, newFleetName: string): string => {
		// Generate a new fleet ID using the same pattern as the server
		const newFleetId = `fleet:${generateUUID()}`;
		
		const createFleetData: CreateFleetActionData = {
			newFleetId,
			newFleetName,
		};

		addAction({
			type: "create_fleet" as ActionType,
			sourceId: sourceShipId,
			sourceType: "capital_ship",
			data: createFleetData,
		});

		return newFleetId;
	};

	const moveUnit = (sourceId: string, sourceType: string, target: ActionTarget) => {
		addAction({
			type: "move" as ActionType,
			sourceId,
			sourceType,
			target,
		});
	};

	const scrapUnit = (sourceId: string, sourceType: string) => {
		addAction({
			type: "scrap" as ActionType,
			sourceId,
			sourceType,
		});
	};

	const renameUnit = (sourceId: string, sourceType: string, newName: string) => {
		addAction({
			type: "rename" as ActionType,
			sourceId,
			sourceType,
			data: { newName },
		});
	};

	const bombardTarget = (fleetId: string, target: ActionTarget) => {
		addAction({
			type: "bombard" as ActionType,
			sourceId: fleetId,
			sourceType: "fleet",
			target,
		});
	};

	const assaultTarget = (fleetId: string, target: ActionTarget) => {
		addAction({
			type: "assault" as ActionType,
			sourceId: fleetId,
			sourceType: "fleet",
			target,
		});
	};

	const executeMission = (personnelId: string, target: ActionTarget, missionType?: string) => {
		addAction({
			type: "mission" as ActionType,
			sourceId: personnelId,
			sourceType: "personnel",
			target,
			data: missionType ? { missionType } : undefined,
		});
	};

	const issueCommand = (personnelId: string, commandType: string, data?: Record<string, unknown>) => {
		addAction({
			type: "command" as ActionType,
			sourceId: personnelId,
			sourceType: "personnel",
			data: { commandType, ...data },
		});
	};

	const buildItem = (structureId: string, structureType: string, buildType: string, data?: Record<string, unknown>) => {
		addAction({
			type: "build" as ActionType,
			sourceId: structureId,
			sourceType: structureType,
			data: { buildType, ...data },
		});
	};

	const stopProduction = (structureId: string, structureType: string) => {
		addAction({
			type: "stop" as ActionType,
			sourceId: structureId,
			sourceType: structureType,
		});
	};

	const abortMission = (missionId: string) => {
		addAction({
			type: "abort" as ActionType,
			sourceId: missionId,
			sourceType: "mission",
		});
	};

	const value: ActionQueueContextType = {
		actions,
		addAction,
		removeAction,
		clearActions,
		createFleet,
		moveUnit,
		scrapUnit,
		renameUnit,
		bombardTarget,
		assaultTarget,
		executeMission,
		issueCommand,
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
