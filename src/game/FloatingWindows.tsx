import React from "react";
import { useGame } from "../hooks/useGame";
import { useWindowContext } from "../hooks/useWindowContext";
import { DefenceOverview } from "./DefenceOverview";
import DraggableWindow from "./DraggableWindow";
import { FilterType } from "./Filters";
import { FleetsOverview } from "./FleetsOverview";
import { ManufacturingOverview } from "./ManufacturingOverview";
import { MissionsOverview } from "./MissionsOverview";
import SectorDetailWindow from "./SectorDetailWindow";

// This component is for rendering the windows only, outside of other UI elements
const FloatingWindows: React.FC<{ filter: FilterType }> = ({ filter }) => {
	const { planetsBySector } = useGame();
	const { openWindows } = useWindowContext();

	if (openWindows.length === 0) {
		return null;
	}

	return (
		<div className="pointer-events-none fixed inset-0 z-40">
			{openWindows.map((info) => (
				<div key={info.id} className="pointer-events-auto">
					<DraggableWindow
						windowInfo={info}
						initialPosition={info.position || { x: 150, y: 150 }}
						zIndex={100} // Much higher z-index
					>
						{(() => {
							const planets = info.sectorId
								? planetsBySector[info.sectorId]
								: [];
							const planet = planets.find(
								(p) => p.metadata.id === info.planetId,
							)!;

							switch (info.type) {
								case "sector":
									return (
										<SectorDetailWindow planets={planets} filter={filter} />
									);
								case "fleets":
									return <FleetsOverview planet={planet} />;
								case "defence":
									return <DefenceOverview planet={planet} />;
								case "manufacturing":
									return <ManufacturingOverview planet={planet} />;
								case "missions":
									return <MissionsOverview planet={planet} />;
								default:
									return "Unknown view type";
							}
						})()}
					</DraggableWindow>
				</div>
			))}
		</div>
	);
};

export default FloatingWindows;
