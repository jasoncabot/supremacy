import type { FactionMetadata } from "../../worker/api";

// Adornment images - normal states
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

// Adornment images - hover states
import defenceEmpireHover from "./defence_empire_hover.png";
import defenceNeutralHover from "./defence_neutral_hover.png";
import defenceRebellionHover from "./defence_rebellion_hover.png";
import fleetEmpireHover from "./fleet_empire_hover.png";
import fleetRebellionHover from "./fleet_rebellion_hover.png";
import manufacturingEmpireHover from "./manufacturing_empire_hover.png";
import manufacturingNeutralHover from "./manufacturing_neutral_hover.png";
import manufacturingRebellionHover from "./manufacturing_rebellion_hover.png";
import missionEmpireHover from "./mission_empire_hover.png";
import missionRebellionHover from "./mission_rebellion_hover.png";

// Adornment images - menu variants
import menuDefenceEmpire from "./menu_defence_empire.png";
import menuDefenceNeutral from "./menu_defence_neutral.png";
import menuDefenceRebellion from "./menu_defence_rebellion.png";
import menuFleetEmpire from "./menu_fleet_empire.png";
import menuFleetRebellion from "./menu_fleet_rebellion.png";
import menuManufacturingEmpire from "./menu_manufacturing_empire.png";
import menuManufacturingNeutral from "./menu_manufacturing_neutral.png";
import menuManufacturingRebellion from "./menu_manufacturing_rebellion.png";
import menuMissionEmpire from "./menu_mission_empire.png";
import menuMissionRebellion from "./menu_mission_rebellion.png";

// Export all adornment images
export {
	// Normal states
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
	// Hover states
	defenceEmpireHover,
	defenceNeutralHover,
	defenceRebellionHover,
	fleetEmpireHover,
	fleetRebellionHover,
	manufacturingEmpireHover,
	manufacturingNeutralHover,
	manufacturingRebellionHover,
	missionEmpireHover,
	missionRebellionHover,
	// Menu variants
	menuDefenceEmpire,
	menuDefenceNeutral,
	menuDefenceRebellion,
	menuFleetEmpire,
	menuFleetRebellion,
	menuManufacturingEmpire,
	menuManufacturingNeutral,
	menuManufacturingRebellion,
	menuMissionEmpire,
	menuMissionRebellion,
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

// Grouped adornments by type - hover states
export const adornmentsByTypeHover = {
	defence: {
		Empire: defenceEmpireHover,
		neutral: defenceNeutralHover,
		Rebellion: defenceRebellionHover,
	},
	fleet: {
		Empire: fleetEmpireHover,
		Rebellion: fleetRebellionHover,
	},
	manufacturing: {
		Empire: manufacturingEmpireHover,
		neutral: manufacturingNeutralHover,
		Rebellion: manufacturingRebellionHover,
	},
	mission: {
		Empire: missionEmpireHover,
		Rebellion: missionRebellionHover,
	},
};

// Grouped adornments by faction - hover states
export const adornmentsByFactionHover = {
	Empire: {
		defence: defenceEmpireHover,
		fleet: fleetEmpireHover,
		manufacturing: manufacturingEmpireHover,
		mission: missionEmpireHover,
	},
	neutral: {
		defence: defenceNeutralHover,
		manufacturing: manufacturingNeutralHover,
	},
	Rebellion: {
		defence: defenceRebellionHover,
		fleet: fleetRebellionHover,
		manufacturing: manufacturingRebellionHover,
		mission: missionRebellionHover,
	},
};

// Grouped adornments by type - menu variants
export const adornmentsByTypeMenu = {
	defence: {
		Empire: menuDefenceEmpire,
		neutral: menuDefenceNeutral,
		Rebellion: menuDefenceRebellion,
	},
	fleet: {
		Empire: menuFleetEmpire,
		Rebellion: menuFleetRebellion,
	},
	manufacturing: {
		Empire: menuManufacturingEmpire,
		neutral: menuManufacturingNeutral,
		Rebellion: menuManufacturingRebellion,
	},
	mission: {
		Empire: menuMissionEmpire,
		Rebellion: menuMissionRebellion,
	},
};

// Grouped adornments by faction - menu variants
export const adornmentsByFactionMenu = {
	Empire: {
		defence: menuDefenceEmpire,
		fleet: menuFleetEmpire,
		manufacturing: menuManufacturingEmpire,
		mission: menuMissionEmpire,
	},
	neutral: {
		defence: menuDefenceNeutral,
		manufacturing: menuManufacturingNeutral,
	},
	Rebellion: {
		defence: menuDefenceRebellion,
		fleet: menuFleetRebellion,
		manufacturing: menuManufacturingRebellion,
		mission: menuMissionRebellion,
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

/**
 * Get a hover adornment image by type and faction
 * @param type - The adornment type
 * @param faction - The faction (Empire, neutral, Rebellion)
 * @returns The hover adornment image URL, or undefined if not found
 */
export function getHoverAdornmentByTypeAndFaction(
	type: AdornmentType,
	faction: Faction,
): string | undefined {
	return adornmentsByTypeHover[type as keyof typeof adornmentsByTypeHover]?.[
		faction as keyof (typeof adornmentsByTypeHover)[keyof typeof adornmentsByTypeHover]
	];
}

/**
 * Get a menu adornment image by type and faction
 * @param type - The adornment type
 * @param faction - The faction (Empire, neutral, Rebellion)
 * @returns The menu adornment image URL, or undefined if not found
 */
export function getMenuAdornmentByTypeAndFaction(
	type: AdornmentType,
	faction: Faction,
): string | undefined {
	return adornmentsByTypeMenu[type as keyof typeof adornmentsByTypeMenu]?.[
		faction as keyof (typeof adornmentsByTypeMenu)[keyof typeof adornmentsByTypeMenu]
	];
}

/**
 * Get all hover adornments for a specific faction
 * @param faction - The faction to get hover adornments for
 * @returns Object containing all hover adornments for the specified faction
 */
export function getHoverAdornmentsByFaction(
	faction: Faction,
): Record<string, string> {
	return adornmentsByFactionHover[faction as keyof typeof adornmentsByFactionHover] || {};
}

/**
 * Get all menu adornments for a specific faction
 * @param faction - The faction to get menu adornments for
 * @returns Object containing all menu adornments for the specified faction
 */
export function getMenuAdornmentsByFaction(
	faction: Faction,
): Record<string, string> {
	return adornmentsByFactionMenu[faction as keyof typeof adornmentsByFactionMenu] || {};
}

/**
 * Get all hover adornments for a specific type
 * @param type - The adornment type to get hover variants for
 * @returns Object containing all factions for the specified hover type
 */
export function getHoverAdornmentsByType(
	type: AdornmentType,
): Record<string, string> {
	return adornmentsByTypeHover[type as keyof typeof adornmentsByTypeHover] || {};
}

/**
 * Get all menu adornments for a specific type
 * @param type - The adornment type to get menu variants for
 * @returns Object containing all factions for the specified menu type
 */
export function getMenuAdornmentsByType(
	type: AdornmentType,
): Record<string, string> {
	return adornmentsByTypeMenu[type as keyof typeof adornmentsByTypeMenu] || {};
}

/**
 * Check if a hover adornment exists for a given type and faction
 * @param type - The adornment type
 * @param faction - The faction
 * @returns True if the hover adornment exists, false otherwise
 */
export function hasHoverAdornment(type: AdornmentType, faction: Faction): boolean {
	return getHoverAdornmentByTypeAndFaction(type, faction) !== undefined;
}

/**
 * Check if a menu adornment exists for a given type and faction
 * @param type - The adornment type
 * @param faction - The faction
 * @returns True if the menu adornment exists, false otherwise
 */
export function hasMenuAdornment(type: AdornmentType, faction: Faction): boolean {
	return getMenuAdornmentByTypeAndFaction(type, faction) !== undefined;
}
