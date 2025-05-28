import React from "react";
import { PlanetView } from "../../worker/api";
import { FilterType } from "./Filters";
import PlanetOverview from "./PlanetOverview";

interface SectorDetailWindowProps {
	planets: PlanetView[];
	filter: FilterType;
}

const SectorDetailWindow: React.FC<SectorDetailWindowProps> = ({ planets }) => {
	return (
		<div className="p-4">
			{planets.map((planet) => (
				<PlanetOverview key={planet.metadata.id} planet={planet} />
			))}
		</div>
	);
};

export default SectorDetailWindow;
