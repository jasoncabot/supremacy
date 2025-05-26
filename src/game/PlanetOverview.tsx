import React from "react";
import { PlanetView } from "../../worker/api";

interface PlanetOverviewProps {
  planet: PlanetView;
}

const PlanetOverview: React.FC<PlanetOverviewProps> = ({ planet }) => {
  return (
    <div className="mb-6 border-b border-purple-700/30 pb-4 last:border-b-0">
      <h3 className="mb-2 text-xl font-semibold text-white">{planet.metadata.name}</h3>
      <ul className="space-y-2 text-sm text-gray-300">
        <li>
          <span className="font-medium text-gray-200">Popular Support:</span>{" "}
          {planet.state?.loyalty !== undefined ? `${planet.state.loyalty}%` : "Unknown"}
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
              <span className="text-yellow-400">{planet.state.naturalResources}</span> available
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
              <span className="text-blue-400">{planet.state.energySpots}</span> available
            </>
          ) : (
            "Unknown"
          )}
        </li>
        <li>
          <span className="font-medium text-gray-200">Active Missions:</span>{" "}
          {/* TODO: Implement missions data when available in API */}
          <span className="text-gray-400 italic">No mission data available</span>
        </li>
      </ul>
    </div>
  );
};

export default PlanetOverview;
