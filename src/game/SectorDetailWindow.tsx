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
	onViewPlanet?: (
		planetId: string,
		viewType: "fleets" | "defence" | "manufacturing" | "missions",
		title: string,
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
		const planet = planets.find((p) => p.metadata.id === planetId);
		onViewPlanet?.(
			planetId,
			"fleets",
			`${planet?.metadata.name || "Planet"} - Fleets`,
		);
	};

	const handleViewDefence = (planetId: string) => {
		const planet = planets.find((p) => p.metadata.id === planetId);
		onViewPlanet?.(
			planetId,
			"defence",
			`${planet?.metadata.name || "Planet"} - Defence`,
		);
	};

	const handleViewManufacturing = (planetId: string) => {
		const planet = planets.find((p) => p.metadata.id === planetId);
		onViewPlanet?.(
			planetId,
			"manufacturing",
			`${planet?.metadata.name || "Planet"} - Manufacturing`,
		);
	};

	const handleViewMissions = (planetId: string) => {
		const planet = planets.find((p) => p.metadata.id === planetId);
		onViewPlanet?.(
			planetId,
			"missions",
			`${planet?.metadata.name || "Planet"} - Missions`,
		);
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
