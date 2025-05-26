import React from "react";
import { PlanetView, SectorMetadata } from "../../worker/api";
import DraggableWindow from "./DraggableWindow";
import { FilterType } from "./Filters";
import PlanetOverview from "./PlanetOverview";

interface SectorDetailWindowProps {
	sector: SectorMetadata;
	planets: PlanetView[];
	onClose: () => void;
	onActivated: () => void;
	filter: FilterType;
	onViewPlanet: (
		sectorId: string,
		planetId: string,
		viewType: "fleets" | "defence" | "manufacturing" | "missions",
	) => void;
}

const SectorDetailWindow: React.FC<SectorDetailWindowProps> = ({
	sector,
	planets,
	onActivated,
	onClose,
	onViewPlanet,
}) => {
	const handleViewFleets = (planetId: string) => {
		onViewPlanet(sector.id, planetId, "fleets");
	};

	const handleViewDefence = (planetId: string) => {
		onViewPlanet(sector.id, planetId, "defence");
	};

	const handleViewManufacturing = (planetId: string) => {
		onViewPlanet(sector.id, planetId, "manufacturing");
	};

	const handleViewMissions = (planetId: string) => {
		onViewPlanet(sector.id, planetId, "missions");
	};

	return (
		<DraggableWindow
			title={sector.name}
			onClose={onClose}
			onActivated={onActivated}
			initialPosition={{ x: 100, y: 100 }}
			zIndex={20}
		>
			<div className="pr-2">
				{planets.map((planet) => (
					<PlanetOverview
						key={planet.metadata.id}
						planet={planet}
						onViewFleets={handleViewFleets}
						onViewDefence={handleViewDefence}
						onViewManufacturing={handleViewManufacturing}
						onViewMissions={handleViewMissions}
					/>
				))}
			</div>
		</DraggableWindow>
	);
};

export default SectorDetailWindow;
