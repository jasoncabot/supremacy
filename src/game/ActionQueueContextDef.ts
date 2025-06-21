import { createContext, useContext } from "react";
import { AssignedCommandType, MissionType } from "../../worker/api";
import {
	BuildActionData,
	MissionActionData,
	QueuedAction,
} from "./types/actionQueue";
import {
	ActionTarget,
	FleetTarget,
	MissionTarget,
	ShipTarget,
	StructureTarget,
	UnitTarget,
} from "./types/actions";

export interface ActionQueueContextType {
	actions: QueuedAction[];
	addAction: (action: Omit<QueuedAction, "id" | "timestamp">) => void;
	removeAction: (actionId: string) => void;
	clearActions: () => void;

	// Specific action functions for type safety and consistency
	createFleet: (ships: ShipTarget[], newFleetName: string) => string;
	moveUnit: (unit: UnitTarget, destination: ActionTarget) => void;
	scrap: (unit: UnitTarget | StructureTarget | ShipTarget) => void;
	renameUnit: (unit: UnitTarget, newName: string) => void;
	bombardTarget: (fleet: FleetTarget, target: ActionTarget) => void;
	assaultTarget: (fleet: FleetTarget, target: ActionTarget) => void;
	executeMission: (
		sources: UnitTarget[],
		target: ActionTarget,
		missionType: MissionType,
		missionData?: MissionActionData,
	) => void;
	assignCommand: (unit: UnitTarget, commandType: AssignedCommandType) => void;
	buildItem: (
		structures: StructureTarget[],
		buildType: string,
		data?: BuildActionData,
	) => void;
	stopProduction: (structures: StructureTarget[]) => void;
	abortMission: (mission: MissionTarget) => void;
}

export const ActionQueueContext = createContext<
	ActionQueueContextType | undefined
>(undefined);

export const useActionQueue = (): ActionQueueContextType => {
	const context = useContext(ActionQueueContext);
	if (!context) {
		throw new Error(
			"useActionQueue must be used within an ActionQueueProvider",
		);
	}
	return context;
};
