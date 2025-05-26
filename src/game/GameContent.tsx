import React from "react";
import { FilterType } from "./Filters";
import Filters from "./Filters";
import Notifications from "./Notifications";
import SectorOverview from "./SectorOverview";
import { MenuView } from "./SideMenu";
import { useGame } from "./useGame";
import SectorDetailWindow from "./SectorDetailWindow";

interface GameContentProps {
	activeView: MenuView;
	filter: FilterType;
	onFilterChange: (filter: FilterType) => void;
}

const GameContent: React.FC<GameContentProps> = ({
	activeView,
	filter,
	onFilterChange,
}) => {
	const { sectors, planetsBySector, notifications, markNotificationAsRead } =
		useGame();

	const [openSectors, setOpenSectors] = React.useState<string[]>([]);

	// Handle opening a sector for detailed view
	const handleOpenSector = (sectorId: string) => {
		// This would typically open a sector detail view
		console.log("Open sector:", sectorId);
		if (!openSectors.includes(sectorId)) {
			setOpenSectors((prev) => [...prev, sectorId]);
		}
		// Implementation could dispatch to a modal/window manager
	};

	return (
		<div className="mx-auto max-w-5xl px-4 pt-8">
			{activeView === "sectorOverview" && (
				<>
					<SectorOverview
						sectors={sectors}
						planetsBySector={planetsBySector}
						filter={filter}
						onOpenSector={handleOpenSector}
					/>
					<Filters filter={filter} onChange={onFilterChange} />
				</>
			)}

			{activeView === "notifications" && (
				<Notifications
					notifications={notifications}
					onMarkRead={markNotificationAsRead}
					className="mx-auto w-full max-w-2xl"
				/>
			)}

			{/* Overlay everything with the set of sectors we have open  */}
			{openSectors.length > 0 &&
				openSectors.map((sectorId) => (
					<SectorDetailWindow
						key={sectorId}
						sector={sectors.find((s) => s.id === sectorId)!}
						planets={planetsBySector[sectorId] || []}
						onClose={function (): void {
							setOpenSectors((prev) => prev.filter((id) => id !== sectorId));
						}}
						filter={"none"}
					/>
				))}
		</div>
	);
};

export default GameContent;
