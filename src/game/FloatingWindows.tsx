import React from "react";
import { useGame } from "../hooks/useGame";
import { useSelectionContext } from "../hooks/useSelectionContext";
import { useWindowContext } from "../hooks/useWindowContext";
import ActionDetailWindow from "./ActionDetailWindow";
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
	const { pendingActionDetails } = useSelectionContext();

	if (openWindows.length === 0) {
		return null;
	}

	return (
		<div className="pointer-events-none fixed inset-0 z-40">
			{/* Render regular windows */}
			{openWindows.map((info) => {
				// Define width classes for different window types
				const getWindowClassName = (type: string) => {
					switch (type) {
						case "sector":
							return "w-[95vw] md:w-[400px] min-h-[400px] md:min-h-[500px]"; // Wider for sector details
						case "manufacturing":
							return "w-[350px] min-h-[400px] md:min-h-[500px]"; // Medium width for manufacturing
						case "fleets":
							return "w-[95vw] md:w-[400px] min-h-[400px] md:min-h-[500px]"; // Standard width for fleets
						case "defence":
							return "w-[300px] min-h-[400px] md:min-h-[500px]"; // Standard width for defence
						case "missions":
							return "w-[320px] min-h-[400px] md:min-h-[500px]"; // Slightly wider for missions
						case "action-detail":
							return "w-[400px] min-h-[300px] max-h-[600px]"; // Action confirmation window
						default:
							return "w-[280px] min-h-[400px] md:min-h-[500px]"; // Default width (maintains current behavior)
					}
				};

				return (
					<div key={info.id} className="pointer-events-auto">
						<DraggableWindow
							windowInfo={info}
							className={getWindowClassName(info.type)}
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
									case "action-detail":
										return pendingActionDetails ? (
											<ActionDetailWindow
												actionDetails={pendingActionDetails}
											/>
										) : null;
									default:
										return "Unknown view type";
								}
							})()}
						</DraggableWindow>
					</div>
				);
			})}
		</div>
	);
};

export default FloatingWindows;
