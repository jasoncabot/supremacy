import { createContext, useContext } from "react";
import { MissionType } from "../../worker/api";
import { SelectableItemWithLocation } from "../hooks/useSelection";
import type { ActionDefinition } from "./types/actions";

export interface MissionData {
	agents?: string[];
	decoys?: string[];
	missionType?: MissionType;
}

// The in-progress command: an action definition, its source units, and (once
// chosen) a target plus any mission configuration.
export interface Command {
	actionId: string;
	actionDef: ActionDefinition;
	sources: SelectableItemWithLocation[];
	target?: SelectableItemWithLocation;
	missionData?: MissionData;
}

// idle → awaiting-target (an action needs a target) → confirming (target chosen,
// or no target required). Actions without a target jump straight to confirming.
export type CommandPhase = "idle" | "awaiting-target" | "confirming";

export interface CommandContextType {
	phase: CommandPhase;
	command: Command | null;
	// Begin an action that requires a target; enters awaiting-target.
	startTargetSelection: (
		actionId: string,
		actionDef?: ActionDefinition,
		sourceUnits?: SelectableItemWithLocation[],
	) => void;
	// Supply the target for an awaiting-target command; enters confirming.
	provideTarget: (target: SelectableItemWithLocation) => void;
	// Begin (and confirm) an action that needs no target; enters confirming.
	showActionConfirmation: (
		actionId: string,
		actionDef: ActionDefinition,
		sources: SelectableItemWithLocation[],
		target?: SelectableItemWithLocation,
	) => void;
	updateMissionData: (missionData: MissionData) => void;
	// Dispatch the command into the action queue, then reset and clear selection.
	confirm: (missionData?: MissionData) => void;
	// Abandon the command and clear the current selection.
	cancel: () => void;
	// Abandon targeting but keep the current selection.
	cancelTargetSelection: () => void;
}

export const CommandContext = createContext<CommandContextType | undefined>(
	undefined,
);

export const useCommand = (): CommandContextType => {
	const context = useContext(CommandContext);
	if (!context) {
		throw new Error("useCommand must be used within a CommandProvider");
	}
	return context;
};
