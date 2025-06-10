import React from "react";
import { PlanetView } from "../../worker/api";
import { FilterType } from "./Filters";
import { getPlanetImage, PlanetOwner } from "../legend/legend";

interface StarLegendProps {
	planet: PlanetView;
	filter: FilterType;
}

const getFilterRelevanceSize = (
	planet: PlanetView,
	filter: FilterType,
): "large" | "medium" | "small" | "tiny" => {
	if (!planet.discovered || !planet.state) return "tiny";

	switch (filter) {
		case "RESOURCES_ENERGY": {
			const energySpots = planet.state.energySpots || 0;
			if (energySpots >= 10) return "large";
			if (energySpots >= 6) return "medium";
			if (energySpots >= 3) return "small";
			return "tiny";
		}

		case "RESOURCES_RAW_MATERIAL": {
			const naturalResources = planet.state.naturalResources || 0;
			if (naturalResources >= 10) return "large";
			if (naturalResources >= 6) return "medium";
			if (naturalResources >= 3) return "small";
			return "tiny";
		}

		case "LOYALTY_SUPPORT": {
			const loyalty = planet.state.loyalty || 0;
			if (loyalty >= 90) return "large";
			if (loyalty >= 70) return "medium";
			if (loyalty >= 50) return "small";
			return "tiny";
		}

		case "LOYALTY_UPRISING":
			return planet.state.inUprising ? "large" : "tiny";

		case "RESOURCES_MINES":
		case "RESOURCES_REFINERIES":
		case "FLEETS_IDLE":
		case "FLEETS_ENROUTE":
		case "PERSONNEL_IDLE":
		case "PERSONNEL_ACTIVE":
		case "MANUFACTURING_SHIPYARD":
		case "MANUFACTURING_SHIPYARD_IDLE":
		case "MANUFACTURING_TRAINING":
		case "MANUFACTURING_TRAINING_IDLE":
		case "MANUFACTURING_CONSTRUCTION":
		case "MANUFACTURING_CONSTRUCTION_IDLE":
		case "DEFENCE_BATTERIES":
		case "DEFENCE_SHIELDS":
		case "DEFENCE_FIGHTERS":
		case "DEFENCE_TROOPS":
		case "DEFENCE_DEATH_STAR_SHIELDS":
			// TODO: Add specific data checks when available
			return "medium";

		case "OFF":
		default:
			return "tiny";
	}
};

const getStarOwner = (planet: PlanetView, filter: FilterType): PlanetOwner => {
	if (!planet.discovered || !planet.state) return "None";

	// Special handling for loyalty filters
	if (filter === "LOYALTY_SUPPORT") {
		const loyalty = planet.state.loyalty || 0;
		const isEmpireLoyalty = loyalty >= 50;

		// Show the faction that the planet supports, not who controls it
		// This creates the visual distinction requested in the requirements
		if (isEmpireLoyalty) {
			return "Empire"; // Planet supports Empire (red star)
		} else {
			return "Rebellion"; // Planet supports Rebellion (green star)
		}
	}

	// Standard owner-based coloring for all other filters
	return (planet.state.owner as PlanetOwner) || "None";
};

const StarLegend: React.FC<StarLegendProps> = ({ planet, filter }) => {
	// Don't show star if filter is off or planet is not discovered
	if (filter === "OFF" || !planet.discovered) {
		return null;
	}

	const size = getFilterRelevanceSize(planet, filter);
	const owner = getStarOwner(planet, filter);

	// Get the planet image using the same system as SectorComponent
	const planetImage = getPlanetImage(
		true, // Always show as discovered since we already check above
		owner,
		size,
		false, // Not a capital for legend purposes
	);

	return <img src={planetImage} alt="Filter Legend" />;
};

export default StarLegend;
