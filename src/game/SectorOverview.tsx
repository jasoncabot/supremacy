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
	if (!planet.state) return 8; // Undiscovered planet

	if (filter === "energy") return 8 + (planet.state.energySpots || 0);
	if (filter === "minerals") return 8 + (planet.state.naturalResources || 0);
	if (filter === "population") return 8 + (planet.discovered ? 5 : 0); // Placeholder for population
	return 10;
};

const getStarColor = (planet: PlanetView, filter: FilterType) => {
	if (!planet.discovered) return "text-gray-600"; // Undiscovered planet

	if (filter === "energy") return "text-yellow-400";
	if (filter === "minerals") return "text-blue-400";
	if (filter === "population") return "text-green-400";

	if (planet.state?.owner === "Empire") return "text-red-400";
	if (planet.state?.owner === "Rebellion") return "text-blue-400";
	return "text-white"; // Neutral
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
					className={`relative min-w-[200px] rounded-xl bg-gradient-to-br from-slate-900 to-gray-900 p-6 shadow-xl border ${
						isInnerRim ? "border-yellow-500/40" : "border-purple-700/30"
					} hover:border-purple-400 transition`}
				>
					<div className="mb-3 flex items-center justify-between font-bold text-white">
						<span className="text-lg tracking-wide [text-shadow:_0_0_8px_theme(colors.purple.700)]">{sector.name}</span>
						<button
							className="ml-2 rounded h-8 bg-purple-800/40 px-3 py-1 text-xs text-purple-300 font-semibold transition-all duration-200 hover:bg-purple-700/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
							onClick={() => onOpenSector(sector.id)}
						>
							View
						</button>
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
