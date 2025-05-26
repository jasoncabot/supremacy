import React from "react";
import { FilterType } from "./Filters";
import {
	MinimizedWindowType,
	ViewWindowType,
	ViewWindowViewType,
} from "./GameScreen";
import Notifications from "./Notifications";
import SectorDetailWindow from "./SectorDetailWindow";
import SectorOverview from "./SectorOverview";
import { MenuView } from "./SideMenu";
import ViewWindow from "./ViewWindow";
import { useGame } from "./useGame";

interface GameContentProps {
	activeView: MenuView;
	filter: FilterType;
	onMinimizeWindow: (windowInfo: MinimizedWindowType) => void;
	openSectors: string[];
	openViewWindows: ViewWindowType[];
	onOpenSector: (sectorId: string) => void;
	onViewPlanet: (
		sectorId: string,
		planetId: string,
		viewType: ViewWindowViewType,
	) => void;
	onCloseViewWindow: (viewId: string) => void;
	onCloseSector: (sectorId: string) => void;
}

const GameContent: React.FC<GameContentProps> = ({
	activeView,
	filter,
	onMinimizeWindow,
	openSectors,
	openViewWindows,
	onOpenSector,
	onViewPlanet,
	onCloseViewWindow,
	onCloseSector,
}) => {
	const { sectors, planetsBySector, notifications, markNotificationAsRead } =
		useGame();

	return (
		<div className="mx-auto w-full flex-1 select-none">
			{activeView === "sectorOverview" && (
				<SectorOverview
					sectors={sectors}
					planetsBySector={planetsBySector}
					filter={filter}
					onOpenSector={onOpenSector}
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
							onOpenSector(sectorId);
						}}
						onMinimized={function (): void {
							// Get the sector data to keep minimal info for later maximizing
							const sector = sectors.find((s) => s.id === sectorId);
							if (sector) {
								onMinimizeWindow({
									id: sectorId,
									title: sector.name,
									type: "sector",
									sectorId: sectorId,
								});
							}
							// Remove from open sectors
							onCloseSector(sectorId);
						}}
						onClose={function (): void {
							onCloseSector(sectorId);
						}}
						filter={filter}
						onViewPlanet={onViewPlanet}
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
							onViewPlanet(view.sectorId, view.planetId, view.viewType);
						}}
						onMinimized={() => {
							onMinimizeWindow({
								id: view.id,
								title: `${view.planetId} - ${view.viewType}`,
								type: "view",
								sectorId: view.sectorId,
								planetId: view.planetId,
								viewType: view.viewType,
							});
							onCloseViewWindow(view.id);
						}}
						onClose={() => onCloseViewWindow(view.id)}
					/>
				))}
		</div>
	);
};

export default GameContent;
