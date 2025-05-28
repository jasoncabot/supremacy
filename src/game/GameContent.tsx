import React from "react";
import { useGame } from "../hooks/useGame";
import { useWindowContext } from "../hooks/useWindowContext";
import { DefenceOverview } from "./DefenceOverview";
import DraggableWindow from "./DraggableWindow";
import { FilterType } from "./Filters";
import { FleetsOverview } from "./FleetsOverview";
import { ManufacturingOverview } from "./ManufacturingOverview";
import { MissionsOverview } from "./MissionsOverview";
import Notifications from "./Notifications";
import SectorDetailWindow from "./SectorDetailWindow";
import SectorOverview from "./SectorOverview";
import { MenuView } from "./SideMenu";

interface GameContentProps {
	activeView: MenuView;
	filter: FilterType;
}

const GameContent: React.FC<GameContentProps> = ({ activeView, filter }) => {
	const { sectors, planetsBySector, notifications, markNotificationAsRead } =
		useGame();

	const { openWindows } = useWindowContext();

	return (
		<div className="mx-auto h-full min-h-0 w-full select-none overscroll-none">
			<div className="relative px-2 pb-16 md:px-4 md:pb-20">
				{activeView === "sectorOverview" && (
					<SectorOverview
						sectors={sectors}
						planetsBySector={planetsBySector}
						filter={filter}
					/>
				)}

				{activeView === "notifications" && (
					<Notifications
						notifications={notifications}
						onMarkRead={markNotificationAsRead}
						className="mx-auto w-full max-w-2xl"
					/>
				)}

				{activeView === "finder" && (
					<div className="mx-auto w-full max-w-2xl p-4">
						<h1 className="text-2xl font-bold text-white">Finder</h1>
						<p className="text-gray-400">
							This section is under construction. Stay tuned for updates!
						</p>
					</div>
				)}

				{activeView === "encyclopaedia" && (
					<div className="mx-auto w-full max-w-2xl p-4">
						<h1 className="text-2xl font-bold text-white">Encyclopaedia</h1>
						<p className="text-gray-400">
							This section is under construction. Stay tuned for updates!
						</p>
					</div>
				)}

				{/* Overlay everything with the set of sectors we have open  */}
				{openWindows.length > 0 &&
					openWindows.map((info) => (
						<DraggableWindow
							key={info.id}
							windowInfo={info}
							// Only use default position if not provided in the info
							initialPosition={info.position || { x: 150, y: 150 }}
							zIndex={100} // Higher z-index to ensure it's above all UI elements
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
					))}
			</div>
		</div>
	);
};

export default GameContent;
