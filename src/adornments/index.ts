import type { FactionMetadata } from "../../worker/api";

// Adornment images
import defenceEmpire from "./defence_empire.png";
import defenceNeutral from "./defence_neutral.png";
import defenceRebellion from "./defence_rebellion.png";
import fleetEmpire from "./fleet_empire.png";
import fleetRebellion from "./fleet_rebellion.png";
import manufacturingEmpire from "./manufacturing_empire.png";
import manufacturingNeutral from "./manufacturing_neutral.png";
import manufacturingRebellion from "./manufacturing_rebellion.png";
import missionEmpire from "./mission_empire.png";
import missionRebellion from "./mission_rebellion.png";
import rebellionHq from "./rebellion_hq.png";
import uprisingEmpire from "./uprising_empire.png";
import uprisingRebellion from "./uprising_rebellion.png";

// Export all adornment images
export {
	defenceEmpire,
	defenceNeutral,
	defenceRebellion,
	fleetEmpire,
	fleetRebellion,
	manufacturingEmpire,
	manufacturingNeutral,
	manufacturingRebellion,
	missionEmpire,
	missionRebellion,
	rebellionHq,
	uprisingEmpire,
	uprisingRebellion,
};

// Grouped adornments by type
export const adornmentsByType = {
	defence: {
		Empire: defenceEmpire,
		neutral: defenceNeutral,
		Rebellion: defenceRebellion,
	},
	fleet: {
		Empire: fleetEmpire,
		Rebellion: fleetRebellion,
	},
	manufacturing: {
		Empire: manufacturingEmpire,
		neutral: manufacturingNeutral,
		Rebellion: manufacturingRebellion,
	},
	mission: {
		Empire: missionEmpire,
		Rebellion: missionRebellion,
	},
	uprising: {
		Empire: uprisingEmpire,
		Rebellion: uprisingRebellion,
	},
	rebellionHq: {
		Rebellion: rebellionHq,
	},
};

// Grouped adornments by faction
export const adornmentsByFaction = {
	Empire: {
		defence: defenceEmpire,
		fleet: fleetEmpire,
		manufacturing: manufacturingEmpire,
		mission: missionEmpire,
		uprising: uprisingEmpire,
	},
	neutral: {
		defence: defenceNeutral,
		manufacturing: manufacturingNeutral,
	},
	Rebellion: {
		defence: defenceRebellion,
		fleet: fleetRebellion,
		manufacturing: manufacturingRebellion,
		mission: missionRebellion,
		uprising: uprisingRebellion,
		rebellionHq: rebellionHq,
	},
};

// Type definitions
export type AdornmentType =
	| "defence"
	| "fleet"
	| "manufacturing"
	| "mission"
	| "uprising"
	| "rebellionHq";
export type Faction = FactionMetadata | "neutral";

/**
 * Get an adornment image by type and faction
 * @param type - The adornment type
 * @param faction - The faction (Empire, neutral, Rebellion)
 * @returns The adornment image URL, or undefined if not found
 */
export function getAdornmentByTypeAndFaction(
	type: AdornmentType,
	faction: Faction,
): string | undefined {
	return adornmentsByType[type]?.[
		faction as keyof (typeof adornmentsByType)[typeof type]
	];
}

/**
 * Get all adornments for a specific faction
 * @param faction - The faction to get adornments for
 * @returns Object containing all adornments for the specified faction
 */
export function getAdornmentsByFaction(
	faction: Faction,
): Record<string, string> {
	return adornmentsByFaction[faction] || {};
}

/**
 * Get all adornments for a specific type
 * @param type - The adornment type to get
 * @returns Object containing all factions for the specified type
 */
export function getAdornmentsByType(
	type: AdornmentType,
): Record<string, string> {
	return adornmentsByType[type] || {};
}

/**
 * Get all available adornment types
 * @returns Array of all adornment types
 */
export function getAdornmentTypes(): AdornmentType[] {
	return Object.keys(adornmentsByType) as AdornmentType[];
}

/**
 * Get all available factions
 * @returns Array of all factions
 */
export function getFactions(): Faction[] {
	return Object.keys(adornmentsByFaction) as Faction[];
}

/**
 * Check if an adornment exists for a given type and faction
 * @param type - The adornment type
 * @param faction - The faction
 * @returns True if the adornment exists, false otherwise
 */
export function hasAdornment(type: AdornmentType, faction: Faction): boolean {
	return getAdornmentByTypeAndFaction(type, faction) !== undefined;
}
