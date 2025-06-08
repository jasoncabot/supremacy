import React from "react";
import { useGame } from "../hooks/useGame";
import { FilterType } from "./Filters";
import Notifications from "./Notifications";
import SectorOverview from "./SectorOverview";
import { MenuView } from "./SideMenu";

interface GameContentProps {
	activeView: MenuView;
	filter: FilterType;
}

const GameContent: React.FC<GameContentProps> = ({ activeView, filter }) => {
	const { sectors, planetsBySector, notifications, markNotificationAsRead } =
		useGame();

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

				{activeView === "settings" && (
					<div className="mx-auto w-full max-w-2xl p-4">
						<h1 className="text-2xl font-bold text-white">Settings</h1>
						<p className="text-gray-400">
							Please use the Settings button to access game settings.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default GameContent;
