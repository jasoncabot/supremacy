import { createContext, useContext } from "react";
import { QueuedAction } from "./types/actionQueue";
import { ActionTarget } from "./types/actions";

export interface ActionQueueContextType {
	actions: QueuedAction[];
	addAction: (action: Omit<QueuedAction, "id" | "timestamp">) => void;
	removeAction: (actionId: string) => void;
	clearActions: () => void;
	
	// Specific action functions for type safety and consistency
	createFleet: (sourceShipId: string, newFleetName: string) => string; // Returns the new fleet ID
	moveUnit: (sourceId: string, sourceType: string, target: ActionTarget) => void;
	scrapUnit: (sourceId: string, sourceType: string) => void;
	renameUnit: (sourceId: string, sourceType: string, newName: string) => void;
	bombardTarget: (fleetId: string, target: ActionTarget) => void;
	assaultTarget: (fleetId: string, target: ActionTarget) => void;
	executeMission: (personnelId: string, target: ActionTarget, missionType?: string, missionData?: { agents?: string[]; decoys?: string[] }) => void;
	issueCommand: (personnelId: string, commandType: string, data?: Record<string, unknown>) => void;
	buildItem: (structureId: string, structureType: string, buildType: string, data?: Record<string, unknown>) => void;
	stopProduction: (structureId: string, structureType: string) => void;
	abortMission: (missionId: string) => void;
}

export const ActionQueueContext = createContext<ActionQueueContextType | undefined>(undefined);

export const useActionQueue = (): ActionQueueContextType => {
	const context = useContext(ActionQueueContext);
	if (!context) {
		throw new Error("useActionQueue must be used within an ActionQueueProvider");
	}
	return context;
};
