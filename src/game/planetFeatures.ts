import { PlanetView } from "../../worker/api";
import { type Faction } from "../adornments";

export type PlanetFeatureType =
	| "manufacturing"
	| "fleet"
	| "defence"
	| "mission";

export interface PlanetFeature {
	type: PlanetFeatureType;
	label: string;
	showForNeutral: boolean;
	alwaysAvailable: boolean;
}

export const PLANET_FEATURES: PlanetFeature[] = [
	{
		type: "manufacturing",
		label: "Manufacturing",
		showForNeutral: true,
		alwaysAvailable: true,
	},
	{
		type: "fleet",
		label: "Fleets",
		showForNeutral: false,
		alwaysAvailable: false,
	},
	{
		type: "defence",
		label: "Defence",
		showForNeutral: true,
		alwaysAvailable: true,
	},
	{
		type: "mission",
		label: "Missions",
		showForNeutral: false,
		alwaysAvailable: false,
	},
];

/**
 * Determines if a specific planet feature should be available based on planet state
 */
export function isPlanetFeatureAvailable(
	planet: PlanetView,
	featureType: PlanetFeatureType,
): boolean {
	switch (featureType) {
		case "fleet":
			return !!(
				planet.state?.fleets?.fleets && planet.state.fleets.fleets.length > 0
			);
		case "mission":
			return !!(
				planet.state?.missions?.missions &&
				planet.state.missions.missions.length > 0
			);
		case "manufacturing":
		case "defence":
			// if the planet is unowned with no manufacturing or defence, then we don't show these features
			if (
				planet.state?.defenses?.batteries?.length === 0 &&
				planet.state?.defenses?.personnel?.length === 0 &&
				planet.state?.defenses?.shields?.length === 0 &&
				planet.state?.defenses?.squadrons?.length === 0 &&
				planet.state?.defenses?.troops?.length === 0 &&
				planet.state?.manufacturing?.construction_yards?.length === 0 &&
				planet.state?.manufacturing?.mines?.length === 0 &&
				planet.state?.manufacturing?.refineries?.length === 0 &&
				planet.state?.manufacturing?.shipyards?.length === 0 &&
				planet.state?.manufacturing?.training_facilities?.length === 0
			) {
				// If the planet is unowned and has no manufacturing or defence, we don't show these features
				return false;
			}
			return true;
		default:
			return false;
	}
}

/**
 * Gets all available planet features for a given planet and faction
 */
export function getAvailablePlanetFeatures(
	planet: PlanetView,
	faction: Faction,
): PlanetFeature[] {
	return PLANET_FEATURES.filter((feature) => {
		// Check if feature should show for neutral factions
		if (faction === "neutral" && !feature.showForNeutral) {
			return false;
		}

		// Check if feature is available based on planet state
		if (
			!feature.alwaysAvailable &&
			!isPlanetFeatureAvailable(planet, feature.type)
		) {
			return false;
		}

		return true;
	});
}
