import React from "react";
import { PlanetView, SectorMetadata } from "../../worker/api";
import { FilterType } from "./Filters";

interface SectorOverviewProps {
	sectors: SectorMetadata[];
	planetsBySector: Record<string, PlanetView[]>;
	filter: FilterType;
	onOpenSector: (sectorId: string) => void;
}

const getStarSize = (planet: PlanetView, filter: FilterType) => {
	if (!planet.discovered) return 8; // Undiscovered planet
	if (!planet.state) return 8; // Discovered but no data yet

	// Base size for all stars
	const baseSize = 8;

	// Handle based on filter type
	switch (filter) {
		// Resource related filters
		case "RESOURCES_ENERGY":
			return baseSize + (planet.state.energySpots || 0) * 2;
		case "RESOURCES_RAW_MATERIAL":
			return baseSize + (planet.state.naturalResources || 0) * 2;
		case "RESOURCES_MINES":
			// TODO: Add mines data to planet model when available
			return baseSize + (planet.discovered ? 4 : 0);
		case "RESOURCES_REFINERIES":
			// TODO: Add refineries data to planet model when available
			return baseSize + (planet.discovered ? 4 : 0);

		// Loyalty related filters
		case "LOYALTY_SUPPORT":
			return (
				baseSize +
				(planet.state.loyalty ? Math.floor(planet.state.loyalty / 10) : 0)
			);
		case "LOYALTY_UPRISING":
			return baseSize + (planet.state.inUprising ? 6 : 0);

		// Fleet related filters
		case "FLEETS_IDLE":
		case "FLEETS_ENROUTE":
			// TODO: Add fleet data to planet model when available
			return baseSize + (planet.discovered ? 4 : 0);

		// Personnel related filters
		case "PERSONNEL_IDLE":
		case "PERSONNEL_ACTIVE":
			// TODO: Add personnel data to planet model when available
			return baseSize + (planet.discovered ? 3 : 0);

		// Manufacturing related filters
		case "MANUFACTURING_SHIPYARD":
		case "MANUFACTURING_SHIPYARD_IDLE":
		case "MANUFACTURING_TRAINING":
		case "MANUFACTURING_TRAINING_IDLE":
		case "MANUFACTURING_CONSTRUCTION":
		case "MANUFACTURING_CONSTRUCTION_IDLE":
			// TODO: Add manufacturing facilities data to planet model when available
			return baseSize + (planet.discovered ? 4 : 0);

		// Defence related filters
		case "DEFENCE_BATTERIES":
		case "DEFENCE_SHIELDS":
		case "DEFENCE_FIGHTERS":
		case "DEFENCE_TROOPS":
		case "DEFENCE_DEATH_STAR_SHIELDS":
			// TODO: Add defence data to planet model when available
			return baseSize + (planet.discovered ? 5 : 0);

		case "OFF":
		default:
			// For no filter, size based on overall planet importance
			return (
				baseSize +
				(planet.state.energySpots || 0) +
				(planet.state.naturalResources || 0)
			);
	}
};

const getStarColor = (planet: PlanetView, filter: FilterType) => {
	if (!planet.discovered) return "text-gray-600"; // Undiscovered planet

	// Handle based on filter type
	switch (filter) {
		// Resource related filters
		case "RESOURCES_ENERGY":
			return "text-yellow-400";
		case "RESOURCES_RAW_MATERIAL":
			return "text-blue-400";
		case "RESOURCES_MINES":
		case "RESOURCES_REFINERIES":
			return "text-amber-500";

		// Loyalty related filters
		case "LOYALTY_SUPPORT":
			return planet.state?.loyalty && planet.state.loyalty > 50
				? "text-green-400"
				: "text-yellow-600";
		case "LOYALTY_UPRISING":
			return planet.state?.inUprising ? "text-red-500" : "text-gray-400";

		// Fleet related filters
		case "FLEETS_IDLE":
			return "text-indigo-400";
		case "FLEETS_ENROUTE":
			return "text-sky-400";

		// Personnel related filters
		case "PERSONNEL_IDLE":
		case "PERSONNEL_ACTIVE":
			return "text-emerald-400";

		// Manufacturing related filters
		case "MANUFACTURING_SHIPYARD":
		case "MANUFACTURING_SHIPYARD_IDLE":
			return "text-orange-400";
		case "MANUFACTURING_TRAINING":
		case "MANUFACTURING_TRAINING_IDLE":
			return "text-teal-400";
		case "MANUFACTURING_CONSTRUCTION":
		case "MANUFACTURING_CONSTRUCTION_IDLE":
			return "text-amber-400";

		// Defence related filters
		case "DEFENCE_BATTERIES":
			return "text-rose-400";
		case "DEFENCE_SHIELDS":
			return "text-violet-400";
		case "DEFENCE_FIGHTERS":
			return "text-cyan-400";
		case "DEFENCE_TROOPS":
			return "text-lime-400";
		case "DEFENCE_DEATH_STAR_SHIELDS":
			return "text-fuchsia-400";

		case "OFF":
		default:
			// Default coloring based on ownership
			if (planet.state?.owner === "Empire") return "text-red-400";
			if (planet.state?.owner === "Rebellion") return "text-blue-400";
			return "text-white"; // Neutral
	}
};

const SectorOverview: React.FC<SectorOverviewProps> = ({
	sectors,
	planetsBySector,
	filter,
	onOpenSector,
}) => (
	<div className="flex flex-wrap justify-center gap-8">
		{sectors.map((sector) => {
			const planets = planetsBySector[sector.id] || [];
			const isInnerRim = sector.isInnerRim;

			return (
				<div
					key={sector.id}
					title={`View ${sector.name}`}
					className={`relative min-w-[200px] cursor-pointer rounded-xl border bg-gradient-to-br from-slate-900 to-gray-900 p-6 shadow-xl ${
						isInnerRim ? "border-yellow-500/40" : "border-purple-700/30"
					} transition hover:border-purple-400`}
					onClick={() => onOpenSector(sector.id)}
				>
					<div className="mb-3 flex items-center justify-between font-bold text-white">
						<span className="text-lg tracking-wide [text-shadow:_0_0_8px_theme(colors.purple.700)]">
							{sector.name}
						</span>
					</div>
					<div className="flex flex-wrap justify-center gap-2">
						{planets.map((planet) => (
							<span
								key={planet.metadata.id}
								className={`inline-block drop-shadow-lg ${getStarColor(planet, filter)} animate-pulse-slow`}
								style={{ fontSize: getStarSize(planet, filter) }}
								title={planet.metadata.name}
							>
								★
							</span>
						))}
					</div>
				</div>
			);
		})}
	</div>
);

export default SectorOverview;
