import React from "react";
import { PlanetView, SectorMetadata } from "../../worker/api";
import { FilterType } from "./Filters";
import PlanetLegendItem from "./PlanetLegendItem";

interface SectorComponentProps {
	sector: SectorMetadata;
	planets: PlanetView[];
	filter: FilterType;
	onSectorClick: (sector: SectorMetadata, event: React.MouseEvent) => void;
}

const SectorComponent: React.FC<SectorComponentProps> = ({
	sector,
	planets,
	filter,
	onSectorClick,
}) => {
	const isInnerRim = sector.isInnerRim;

	return (
		<div
			className={`relative h-20 w-20 cursor-pointer rounded border sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-[120px] lg:w-[120px] ${
				isInnerRim ? "border-yellow-500/40" : "border-purple-700/30"
			} bg-gradient-to-br from-slate-900 to-gray-900 transition hover:border-purple-400`}
			title={`${sector.name} (${planets.length} planets)`}
			onClick={(e) => onSectorClick(sector, e)}
		>
			{/* Sector name label */}
			<div className="absolute -top-5 right-0 left-0 text-center">
				<span className="text-xs text-white/80 [text-shadow:_0_0_4px_theme(colors.purple.700)]">
					{sector.name}
				</span>
			</div>

			{/* Planets container */}
			<div className="relative h-full w-full p-1">
				{planets.map((planet, index) => {
					const pixelSize = 15; // All planet images are 15x15px

					// Responsive usable area calculation (sector size - 2px padding)
					// Mobile: 80px - 2px = 78px, SM: 96px - 2px = 94px, MD: 112px - 2px = 110px, LG+: 120px - 2px = 118px
					const getUsableArea = () => {
						if (window.innerWidth >= 1024) return 118; // lg+
						if (window.innerWidth >= 768) return 110; // md
						if (window.innerWidth >= 640) return 94; // sm
						return 78; // mobile
					};

					const usableArea = getUsableArea();
					const planetX = planet.metadata.position
						? Math.min(
								Math.max(planet.metadata.position.x * usableArea, 0),
								usableArea - pixelSize,
							)
						: (index % 3) * (usableArea / 3) + usableArea / 6 - pixelSize / 2;
					const planetY = planet.metadata.position
						? Math.min(
								Math.max(planet.metadata.position.y * usableArea, 0),
								usableArea - pixelSize,
							)
						: Math.floor(index / 3) * (usableArea / 3) +
							usableArea / 6 -
							pixelSize / 2;

					return (
						<PlanetLegendItem
							key={planet.metadata.id}
							planet={planet}
							filter={filter}
							x={planetX}
							y={planetY}
							pixelSize={pixelSize}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default SectorComponent;
