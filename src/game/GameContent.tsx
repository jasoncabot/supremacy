import React from "react";
import { FilterType } from "./Filters";
import Notifications from "./Notifications";
import SectorDetailWindow from "./SectorDetailWindow";
import SectorOverview from "./SectorOverview";
import { MenuView } from "./SideMenu";
import ViewWindow from "./ViewWindow";
import { useGame } from "./useGame";

interface GameContentProps {
	activeView: MenuView;
	filter: FilterType;
}

type ViewWindowType = {
	id: string;
	sectorId: string;
	planetId: string;
	viewType: "fleets" | "defence" | "manufacturing" | "missions";
};

const GameContent: React.FC<GameContentProps> = ({ activeView, filter }) => {
	const { sectors, planetsBySector, notifications, markNotificationAsRead } =
		useGame();

	const [openSectors, setOpenSectors] = React.useState<string[]>([]);
	const [openViewWindows, setOpenViewWindows] = React.useState<
		ViewWindowType[]
	>([]);

	const handleOpenSector = (sectorId: string) => {
		if (!openSectors.includes(sectorId)) {
			setOpenSectors((prev) => [...prev, sectorId]);
		} else {
			setOpenSectors((prev) => {
				const others = prev.filter((id) => id !== sectorId);
				return [...others, sectorId];
			});
		}
	};

	const handleViewPlanet = (
		sectorId: string,
		planetId: string,
		viewType: "fleets" | "defence" | "manufacturing" | "missions",
	) => {
		const viewId = `${planetId}-${viewType}`;

		// Check if this view is already open
		if (!openViewWindows.some((view) => view.id === viewId)) {
			setOpenViewWindows((prev) => [
				...prev,
				{ id: viewId, sectorId, planetId, viewType } as ViewWindowType,
			]);
		} else {
			// Bring to front if already open (similar to sector handling)
			setOpenViewWindows((prev) => {
				const others = prev.filter((view) => view.id !== viewId);
				return [
					...others,
					{ id: viewId, sectorId, planetId, viewType } as ViewWindowType,
				];
			});
		}
	};

	const handleCloseViewWindow = (viewId: string) => {
		setOpenViewWindows((prev) => prev.filter((view) => view.id !== viewId));
	};

	return (
		<div className="mx-auto w-full flex-1 p-4 select-none">
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
							setOpenSectors((prev) => {
								const others = prev.filter((id) => id !== sectorId);
								return [...others, sectorId];
							});
						}}
						onClose={function (): void {
							setOpenSectors((prev) => prev.filter((id) => id !== sectorId));
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
							setOpenViewWindows((prev) => {
								const others = prev.filter((v) => v.id !== view.id);
								return [...others, view];
							});
						}}
						onClose={() => handleCloseViewWindow(view.id)}
					/>
				))}
		</div>
	);
};

export default GameContent;
