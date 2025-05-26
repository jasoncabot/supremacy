import React from "react";
import { FilterType } from "./Filters";
import Notifications from "./Notifications";
import SectorDetailWindow from "./SectorDetailWindow";
import SectorOverview from "./SectorOverview";
import { MenuView } from "./SideMenu";
import { useGame } from "./useGame";

interface GameContentProps {
	activeView: MenuView;
	filter: FilterType;
}

const GameContent: React.FC<GameContentProps> = ({ activeView, filter }) => {
	const { sectors, planetsBySector, notifications, markNotificationAsRead } =
		useGame();

	const [openSectors, setOpenSectors] = React.useState<string[]>([]);

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
					/>
				))}
		</div>
	);
};

export default GameContent;
