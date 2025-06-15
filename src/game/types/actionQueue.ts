// Action queue types for the game
import type { ActionTarget, ActionType } from "./actions";

export interface QueuedAction {
	id: string; // Unique ID for this queued action
	type: ActionType;
	sourceId: string; // ID of the resource performing the action
	sourceType: string; // Type of the resource (ship, fleet, etc.)
	target?: ActionTarget; // Optional target for the action
	data?: Record<string, unknown>; // Additional action-specific data
	timestamp: number; // When the action was queued
}

// Specific action data interfaces
export interface CreateFleetActionData extends Record<string, unknown> {
	newFleetId: string; // The ID that will be assigned to the new fleet
	newFleetName: string; // Name for the new fleet
}

export interface RenameActionData extends Record<string, unknown> {
	newName: string; // The new name for the unit
}

export interface MissionActionData extends Record<string, unknown> {
	missionType?: string; // The type of mission to execute
}

export interface CommandActionData extends Record<string, unknown> {
	commandType: string; // The type of command to issue
}

export interface BuildActionData extends Record<string, unknown> {
	buildType: string; // The type of item to build (ship, training, construction_yard)
}

// Specific action interfaces
export interface CreateFleetAction extends QueuedAction {
	type: "create_fleet";
	data: CreateFleetActionData;
}

export interface MoveAction extends QueuedAction {
	type: "move";
	target: ActionTarget;
}

export interface ScrapAction extends QueuedAction {
	type: "scrap";
}

export interface RenameAction extends QueuedAction {
	type: "rename";
	data: RenameActionData;
}

export interface BombardAction extends QueuedAction {
	type: "bombard";
	target: ActionTarget;
	sourceType: "fleet";
}

export interface AssaultAction extends QueuedAction {
	type: "assault";
	target: ActionTarget;
	sourceType: "fleet";
}

export interface MissionAction extends QueuedAction {
	type: "mission";
	target: ActionTarget;
	sourceType: "personnel";
	data?: MissionActionData;
}

export interface CommandAction extends QueuedAction {
	type: "command";
	sourceType: "personnel";
	data: CommandActionData;
}

export interface BuildAction extends QueuedAction {
	type: "build";
	data: BuildActionData;
}

export interface StopAction extends QueuedAction {
	type: "stop";
}

export interface AbortAction extends QueuedAction {
	type: "abort";
	sourceType: "mission";
}

// Union type for all specific action types
export type TypedQueuedAction =
	| CreateFleetAction
	| MoveAction
	| ScrapAction
	| RenameAction
	| BombardAction
	| AssaultAction
	| MissionAction
	| CommandAction
	| BuildAction
	| StopAction
	| AbortAction
	| QueuedAction; // Fallback for generic actions
