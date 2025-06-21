import React from "react";
import { PlanetView } from "../../worker/api";
import { getPlanetImage, getPlanetSize, PlanetOwner } from "../legend/legend";
import { FilterType } from "./Filters";
import StarLegend from "./StarLegend";

interface PlanetLegendItemProps {
	planet: PlanetView;
	filter: FilterType;
	x: number;
	y: number;
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
			return getPlanetSize(1);
	}
};

const PlanetLegendItem: React.FC<PlanetLegendItemProps> = ({
	planet,
	filter,
	x,
	y,
}) => {
	const owner = planet.state?.owner as PlanetOwner | undefined;

	// Get the appropriate size based on filter relevance
	const filterSize =
		filter !== "OFF"
			? getFilterRelevanceSize(planet, filter)
			: getPlanetSize(1);

	// Use the filter-based size for the image, but keep original pixelSize for positioning
	const planetImage = getPlanetImage(
		planet.discovered,
		owner,
		filterSize,
		planet.metadata.name.toLowerCase().includes("capital") ||
			planet.metadata.name.toLowerCase().includes("coruscant") ||
			planet.metadata.name.toLowerCase().includes("yavin"),
	);

	return (
		<div
			className="absolute"
			style={{
				left: `${x}px`,
				top: `${y}px`,
				width: `15px`,
				height: `15px`,
			}}
		>
			<img
				src={planetImage}
				alt={planet.metadata.name}
				title={planet.metadata.name}
				className={`absolute h-[15px] w-[15px] drop-shadow-sm ${
					planet.discovered ? "opacity-100" : "opacity-60"
				}`}
			/>
			{/* Star Legend - positioned to the right of the planet */}
			<div className="absolute top-[2px] left-[17px]">
				<StarLegend planet={planet} filter={filter} />
			</div>
		</div>
	);
};

export default PlanetLegendItem;
