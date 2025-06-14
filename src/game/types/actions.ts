// Action and target type definitions for the game
import type {
	ActionableResource,
	DefenseResource,
	ManufacturingResource,
	MissionType,
	PlanetView,
} from "../../../worker/api";
import { SelectableItem } from "../../hooks/useSelectionContext";

// Base target types
export interface PlanetTarget {
	type: "planet";
	id: string;
	data: PlanetView;
}

export interface ShipTarget {
	type: "ship";
	id: string;
	// Ship data will be implemented when ship types are available
}

export interface FleetTarget {
	type: "fleet";
	id: string;
	// Fleet data will be implemented when fleet types are available
}

export interface StructureTarget {
	type: "structure";
	id: string;
	data: ManufacturingResource;
}

export interface UnitTarget {
	type: "unit";
	id: string;
	data: DefenseResource;
}

// Union type for all possible targets
export type ActionTarget =
	| PlanetTarget
	| ShipTarget
	| FleetTarget
	| StructureTarget
	| UnitTarget;

// Action types for each unit category
export type FleetActionType = "move" | "rename" | "bombard" | "assault" | "scrap";
export type CapitalShipActionType = "move" | "rename" | "create_fleet" | "scrap";
export type PersonnelActionType = "move" | "mission" | "command" | "scrap";
export type TroopActionType = "move" | "scrap";
export type FighterActionType = "move" | "scrap";
export type StructureActionType = "build" | "stop";
export type MissionActionType = "abort";

// Build action types (long-running)
export type BuildActionType = "ship" | "training" | "construction_yard";

// Union type for all action types
export type ActionType =
	| FleetActionType
	| CapitalShipActionType
	| PersonnelActionType
	| TroopActionType
	| FighterActionType
	| StructureActionType
	| MissionActionType
	| BuildActionType;

// Action definitions with their required targets
export interface ActionDefinition {
	id: string;
	label: string;
	type: ActionType;
	validTargets: ActionTarget["type"][];
	requiresTarget: boolean;
	missionType?: MissionType;
}

// Mapping of unit types to their available actions
const actionDefinitions: Record<ActionableResource, ActionDefinition[]> = {
	// Fleet actions
	fleet: [
		{
			id: "move-fleet",
			label: "Move",
			type: "move",
			validTargets: ["planet"],
			requiresTarget: true,
		},
		{
			id: "bombard-fleet",
			label: "Bombard",
			type: "bombard",
			validTargets: ["planet"],
			requiresTarget: true,
		},
		{
			id: "assault-fleet",
			label: "Assault",
			type: "assault",
			validTargets: ["planet"],
			requiresTarget: true,
		},
		{
			id: "scrap-fleet",
			label: "Scrap",
			type: "scrap",
			validTargets: [],
			requiresTarget: false,
		},
	],

	// Capital Ship actions
	capital_ship: [
		{
			id: "move-capital-ship",
			label: "Move",
			type: "move",
			validTargets: ["planet"],
			requiresTarget: true,
		},
		{
			id: "create-fleet",
			label: "Create Fleet",
			type: "create_fleet",
			validTargets: ["fleet"],
			requiresTarget: false,
		},
		{
			id: "scrap-capital-ship",
			label: "Scrap",
			type: "scrap",
			validTargets: [],
			requiresTarget: false,
		},
		{
			id: "rename-capital-ship",
			label: "Rename",
			type: "rename",
			validTargets: [],
			requiresTarget: false,
		}
	],

	// Personnel actions (maps to DefenseResource with type "personnel")
	personnel: [
		{
			id: "move-personnel",
			label: "Move",
			type: "move",
			validTargets: ["planet", "ship"],
			requiresTarget: true,
		},
		{
			id: "mission-personnel",
			label: "Mission",
			type: "mission",
			validTargets: ["planet", "ship", "structure", "unit"],
			requiresTarget: true,
		},
		{
			id: "command-personnel",
			label: "Command",
			type: "command",
			validTargets: [],
			requiresTarget: false,
		},
		{
			id: "scrap-personnel",
			label: "Retire",
			type: "scrap",
			validTargets: [],
			requiresTarget: false,
		},
	],

	// Troop actions (maps to DefenseResource with type "troop")
	troop: [
		{
			id: "move-troop",
			label: "Move",
			type: "move",
			validTargets: ["planet", "ship"],
			requiresTarget: true,
		},
		{
			id: "scrap-troop",
			label: "Scrap",
			type: "scrap",
			validTargets: [],
			requiresTarget: false,
		},
	],

	// Fighter actions (maps to DefenseResource with type "squadrons")
	squadron: [
		{
			id: "move-fighter",
			label: "Move",
			type: "move",
			validTargets: ["planet", "ship"],
			requiresTarget: true,
		},
		{
			id: "scrap-fighter",
			label: "Scrap",
			type: "scrap",
			validTargets: [],
			requiresTarget: false,
		},
	],

	// Structure actions (maps to ManufacturingResource)
	shipyard: [
		{
			id: "build-ship",
			label: "Build Ship",
			type: "build",
			validTargets: [],
			requiresTarget: false,
		},
		{
			id: "stop-shipyard",
			label: "Stop",
			type: "stop",
			validTargets: [],
			requiresTarget: false,
		},
	],
	training_facility: [
		{
			id: "build-training",
			label: "Build Training",
			type: "build",
			validTargets: [],
			requiresTarget: false,
		},
		{
			id: "stop-training-facility",
			label: "Stop",
			type: "stop",
			validTargets: [],
			requiresTarget: false,
		},
	],
	construction_yard: [
		{
			id: "build-construction-yard",
			label: "Build Construction Yard",
			type: "build",
			validTargets: [],
			requiresTarget: false,
		},
		{
			id: "stop-construction-yard",
			label: "Stop",
			type: "stop",
			validTargets: [],
			requiresTarget: false,
		},
	],
	refinery: [
		{
			id: "stop-refinery",
			label: "Stop",
			type: "stop",
			validTargets: [],
			requiresTarget: false,
		},
	],
	mine: [
		{
			id: "stop-mine",
			label: "Stop",
			type: "stop",
			validTargets: [],
			requiresTarget: false,
		},
	],

	// Mission actions (for ongoing missions)
	mission: [
		{
			id: "abort-mission",
			label: "Abort",
			type: "abort",
			validTargets: [],
			requiresTarget: false,
		},
	],

	battery: [
		{
			id: "stop-battery",
			label: "Stop",
			type: "stop",
			validTargets: [],
			requiresTarget: false,
		},
	],
	shield: [
		{
			id: "stop-shield",
			label: "Stop",
			type: "stop",
			validTargets: [],
			requiresTarget: false,
		},
	],
	// Planet actions - planets can be targeted but don't have actions themselves
	planet: [],
};

// Helper function to get available actions for selected items
export function getAvailableActions(
	selectedItems: SelectableItem[],
): ActionDefinition[] {
	if (selectedItems.length === 0) return [];

	// Group items by type
	const itemsByType = selectedItems.reduce(
		(acc, item) => {
			if (!acc[item.type]) acc[item.type] = [];
			acc[item.type].push(item);
			return acc;
		},
		{} as Record<ActionableResource, typeof selectedItems>,
	);

	const allActions: ActionDefinition[] = [];

	// For each item type, add its available actions
	for (const itemType of Object.keys(itemsByType)) {
		const typeActions = actionDefinitions[itemType as ActionableResource];
		if (typeActions) {
			allActions.push(...typeActions);
		}
	}

	// Remove duplicates based on action id
	const uniqueActions = allActions.filter(
		(action, index, self) =>
			index === self.findIndex((a) => a.id === action.id),
	);

	return uniqueActions;
}
