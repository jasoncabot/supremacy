import React from "react";
import { PlanetView, SectorMetadata } from "../../worker/api";
import { useWindowContext } from "../hooks/useWindowContext";
import { FilterType } from "./Filters";
import SectorComponent from "./SectorComponent";

interface SectorOverviewProps {
	sectors: SectorMetadata[];
	planetsBySector: Record<string, PlanetView[]>;
	filter: FilterType;
}

const SectorOverview: React.FC<SectorOverviewProps> = ({
	sectors,
	planetsBySector,
	filter,
}) => {
	const { handleOpenWindow } = useWindowContext();

	const handleSectorClick = (
		sector: SectorMetadata,
		event: React.MouseEvent,
	) => {
		// Calculate position relative to viewport
		const isMobile = window.innerWidth < 768;
		handleOpenWindow({
			id: `sector-${sector.id}`,
			title: sector.name,
			type: "sector",
			sectorId: sector.id,
			position: {
				x: isMobile ? 0 : event.clientX - 150, // Fixed on mobile, centered near click otherwise
				y: 100,
			},
		});
	};

	return (
		<div className="relative m-[40px] flex flex-1 md:m-[80px]">
			{sectors.map((sector) => {
				const planets = planetsBySector[sector.id] || ([] as PlanetView[]);

				// Convert percentage coordinates to CSS positioning
				// Coordinates are percentages, so multiply by 100 for CSS percentage values
				const leftPercent = sector.location.x * 100;
				const topPercent = sector.location.y * 100;

				return (
					<div
						key={sector.id}
						className="absolute"
						style={{
							left: `${leftPercent}%`,
							top: `${topPercent}%`,
							transform: "translate(-50%, -50%)", // Center the sector on its coordinates
						}}
					>
						<SectorComponent
							sector={sector}
							planets={planets}
							filter={filter}
							onSectorClick={handleSectorClick}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default SectorOverview;
