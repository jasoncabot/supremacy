import React, { useRef } from "react";
import { PlanetView, SectorMetadata } from "../../worker/api";
import { FilterType } from "./Filters";

interface SectorDetailWindowProps {
	sector: SectorMetadata;
	planets: PlanetView[];
	onClose: () => void;
	filter: FilterType;
}

const getStarSize = (planet: PlanetView, filter: FilterType) => {
	if (!planet.state) return 16; // Undiscovered planet

	if (filter === "energy") return 16 + (planet.state.energySpots || 0) * 2;
	if (filter === "minerals")
		return 16 + (planet.state.naturalResources || 0) * 2;
	if (filter === "population") return 16 + (planet.discovered ? 10 : 0); // Placeholder for population
	return 20;
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

const PlanetDetails: React.FC<{ planet: PlanetView }> = ({ planet }) => {
	if (!planet.discovered) {
		return (
			<p className="text-xs text-gray-500 italic">Planet not yet discovered</p>
		);
	}

	return (
		<div className="mt-2 space-y-1 text-xs text-slate-300">
			{planet.state?.owner && (
				<p>
					Owner:{" "}
					<span
						className={
							planet.state.owner === "Empire"
								? "font-bold text-red-400"
								: "font-bold text-blue-400"
						}
					>
						{planet.state.owner}
					</span>
				</p>
			)}
			{planet.state?.energySpots !== undefined && (
				<p>
					⚡ Energy:{" "}
					<span className="font-semibold text-yellow-300">
						{planet.state.energySpots}
					</span>
				</p>
			)}
			{planet.state?.naturalResources !== undefined && (
				<p>
					⛏️ Resources:{" "}
					<span className="font-semibold text-blue-300">
						{planet.state.naturalResources}
					</span>
				</p>
			)}
			{planet.state?.loyalty !== undefined && (
				<p>
					🤝 Loyalty:{" "}
					<span className="font-semibold text-green-300">
						{planet.state.loyalty}%
					</span>
				</p>
			)}
			{planet.state?.inUprising && (
				<p className="flex items-center gap-1 font-semibold text-orange-500">
					<span>⚠️</span> Uprising in progress
				</p>
			)}
		</div>
	);
};

const SectorDetailWindow: React.FC<SectorDetailWindowProps> = ({
	sector,
	planets,
	onClose,
	filter,
}) => {
	const nodeRef = useRef<HTMLDivElement>(null);
	return (
		<div
			ref={nodeRef}
			className="absolute top-1/4 left-1/4 z-20 max-w-[90vw] min-w-[320px] rounded-xl border border-purple-700/40 bg-gradient-to-br from-slate-900 to-gray-900 p-8 shadow-2xl backdrop-blur-md"
		>
			<div className="drag-handle mb-4 flex cursor-move items-center justify-between">
				<h4 className="text-2xl font-bold tracking-wide text-purple-300 [text-shadow:_0_0_10px_theme(colors.purple.700)]">
					{sector.name}{" "}
					<span className="text-xs font-normal text-slate-400">- Planets</span>
				</h4>
				<div>
					<span className="mr-3 text-xs text-slate-400">
						{sector.isInnerRim ? "Inner Rim" : "Outer Rim"}
					</span>
					<button
						className="h-8 rounded bg-transparent px-3 py-1 text-xs font-semibold text-pink-400 transition-all duration-200 hover:bg-pink-900/30 focus:ring-2 focus:ring-pink-400 focus:outline-none"
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
			<div className="flex flex-wrap justify-center gap-6">
				{planets.map((planet) => (
					<div
						key={planet.metadata.id}
						className="flex max-w-[160px] min-w-[120px] flex-col items-center rounded-lg border border-slate-700 bg-slate-800/80 p-4 shadow-lg transition hover:border-purple-500"
					>
						<span
							className={`inline-block drop-shadow-lg ${getStarColor(planet, filter)} animate-pulse-slow`}
							style={{ fontSize: getStarSize(planet, filter) }}
							title={planet.metadata.name}
						>
							★
						</span>
						<span className="mt-2 text-base font-bold tracking-wide text-slate-100">
							{planet.metadata.name}
						</span>
						<PlanetDetails planet={planet} />
					</div>
				))}
			</div>
		</div>
	);
};

export default SectorDetailWindow;
