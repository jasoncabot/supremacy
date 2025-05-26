import React from "react";
import { PlanetView } from "../../worker/api";

interface PlanetOverviewProps {
	planet: PlanetView;
	onViewFleets?: (planetId: string) => void;
	onViewDefence?: (planetId: string) => void;
	onViewManufacturing?: (planetId: string) => void;
	onViewMissions?: (planetId: string) => void;
}

const PlanetOverview: React.FC<PlanetOverviewProps> = ({
	planet,
	onViewFleets,
	onViewDefence,
	onViewManufacturing,
	onViewMissions,
}) => {
	return (
		<div className="mb-6 border-b border-purple-700/30 pb-4 last:border-b-0">
			<h3 className="mb-2 text-xl font-semibold text-white">
				{planet.metadata.name}
			</h3>
			<ul className="space-y-2 text-sm text-gray-300">
				<li>
					<span className="font-medium text-gray-200">Popular Support:</span>{" "}
					{planet.state?.loyalty !== undefined
						? `${planet.state.loyalty}%`
						: "Unknown"}
				</li>
				<li>
					<span className="font-medium text-gray-200">Status:</span>{" "}
					{planet.discovered ? "Discovered" : "Undiscovered"}
				</li>
				<li>
					<span className="font-medium text-gray-200">Uprising:</span>{" "}
					{planet.state?.inUprising ? (
						<span className="text-red-500">In Rebellion</span>
					) : (
						<span className="text-green-500">Stable</span>
					)}
				</li>
				<li>
					<span className="font-medium text-gray-200">Natural Resources:</span>{" "}
					{planet.state?.naturalResources !== undefined ? (
						<>
							{/* TODO: Get used resources data from API */}
							<span className="text-yellow-400">? used</span> out of{" "}
							<span className="text-yellow-400">
								{planet.state.naturalResources}
							</span>{" "}
							available
						</>
					) : (
						"Unknown"
					)}
				</li>
				<li>
					<span className="font-medium text-gray-200">Energy Consumption:</span>{" "}
					{planet.state?.energySpots !== undefined ? (
						<>
							{/* TODO: Get used energy data from API */}
							<span className="text-blue-400">? used</span> out of{" "}
							<span className="text-blue-400">{planet.state.energySpots}</span>{" "}
							available
						</>
					) : (
						"Unknown"
					)}
				</li>
				<li>
					<span className="font-medium text-gray-200">Active Missions:</span>{" "}
					{/* TODO: Implement missions data when available in API */}
					<span className="text-gray-400 italic">
						No mission data available
					</span>
				</li>
			</ul>

			<div className="mt-4 flex flex-wrap gap-2">
				<button
					onClick={() => onViewFleets?.(planet.metadata.id)}
					className="cursor-pointer rounded bg-purple-700/30 px-3 py-1 text-sm text-white transition-colors hover:bg-purple-700/50"
				>
					View Fleets
				</button>
				<button
					onClick={() => onViewDefence?.(planet.metadata.id)}
					className="cursor-pointer rounded bg-purple-700/30 px-3 py-1 text-sm text-white transition-colors hover:bg-purple-700/50"
				>
					View Defence
				</button>
				<button
					onClick={() => onViewManufacturing?.(planet.metadata.id)}
					className="cursor-pointer rounded bg-purple-700/30 px-3 py-1 text-sm text-white transition-colors hover:bg-purple-700/50"
				>
					View Manufacturing
				</button>
				<button
					onClick={() => onViewMissions?.(planet.metadata.id)}
					className="cursor-pointer rounded bg-purple-700/30 px-3 py-1 text-sm text-white transition-colors hover:bg-purple-700/50"
				>
					View Missions
				</button>
			</div>
		</div>
	);
};

export default PlanetOverview;
