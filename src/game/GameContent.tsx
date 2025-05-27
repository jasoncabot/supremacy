import React from "react";
import { FilterType } from "./Filters";
import Notifications from "./Notifications";
import SectorDetailWindow from "./SectorDetailWindow";
import SectorOverview from "./SectorOverview";
import { MenuView } from "./SideMenu";
import ViewWindow from "./ViewWindow";
import { useWindowContext } from "./WindowContext";
import { useGame } from "./useGame";

interface GameContentProps {
	activeView: MenuView;
	filter: FilterType;
}

const GameContent: React.FC<GameContentProps> = ({
	activeView,
	filter
}) => {
	const { sectors, planetsBySector, notifications, markNotificationAsRead } =
		useGame();
	
	const {
		openSectors,
		openViewWindows,
		handleOpenSector,
		handleViewPlanet,
		handleMinimizeWindow,
		handleCloseViewWindow,
		handleCloseSector
	} = useWindowContext();

	return (
		<div className="mx-auto w-full flex-1 select-none">
			{activeView === "sectorOverview" && (
				<SectorOverview
					sectors={sectors}
					planetsBySector={planetsBySector}
					filter={filter}
					onOpenSector={handleOpenSector}
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
			{openSectors.length > 0 &&
				openSectors.map((sectorId) => (
					<SectorDetailWindow
						key={sectorId}
						sector={sectors.find((s) => s.id === sectorId)!}
						planets={planetsBySector[sectorId] || []}
						onActivated={() => {
							// Bring sector to front
							handleOpenSector(sectorId);
						}}
						onMinimized={function (): void {
							// Get the sector data to keep minimal info for later maximizing
							const sector = sectors.find((s) => s.id === sectorId);
							if (sector) {
								handleMinimizeWindow({
									id: sectorId,
									title: sector.name,
									type: "sector",
									sectorId: sectorId,
								});
							}
							// Remove from open sectors
							handleCloseSector(sectorId);
						}}
						onClose={function (): void {
							handleCloseSector(sectorId);
						}}
						filter={filter}
						onViewPlanet={handleViewPlanet}
					/>
				))}

			{/* Overlay everything with the set of view windows we have open */}
			{openViewWindows.length > 0 &&
				openViewWindows.map((view) => (
					<ViewWindow
						key={view.id}
						planet={
							(planetsBySector[view.sectorId] || []).find(
								(p) => p.metadata.id === view.planetId,
							)!
						}
						viewType={view.viewType}
						onActivated={() => {
							// Bring window to front
							handleViewPlanet(view.sectorId, view.planetId, view.viewType);
						}}
						onMinimized={() => {
							handleMinimizeWindow({
								id: view.id,
								title: `${view.planetId} - ${view.viewType}`,
								type: "view",
								sectorId: view.sectorId,
								planetId: view.planetId,
								viewType: view.viewType,
							});
							handleCloseViewWindow(view.id);
						}}
						onClose={() => handleCloseViewWindow(view.id)}
					/>
				))}
		</div>
	);
};

export default GameContent;
