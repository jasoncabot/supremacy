import React from "react";
import { PlanetView } from "../../worker/api";
import { FilterType } from "./Filters";
import PlanetOverview from "./PlanetOverview";

interface SectorDetailWindowProps {
	planets: PlanetView[];
	filter: FilterType;
}

const SectorDetailWindow: React.FC<SectorDetailWindowProps> = ({
	planets,
	filter,
}) => {
	return (
		<div className="relative m-[40px] flex flex-1">
			{planets.map((planet) => {
				// Convert percentage coordinates to CSS positioning
				// Coordinates are percentages, so multiply by 100 for CSS percentage values
				const leftPercent = planet.metadata.position.x * 100;
				const topPercent = planet.metadata.position.y * 100;

				return (
					<div
						key={planet.metadata.id}
						className="absolute"
						style={{
							left: `${leftPercent}%`,
							top: `${topPercent}%`,
							transform: "translate(-50%, -50%)", // Center the sector on its coordinates
						}}
					>
						<PlanetOverview
							key={planet.metadata.id}
							planet={planet}
							filter={filter}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default SectorDetailWindow;
