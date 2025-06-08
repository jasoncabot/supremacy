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
		<div className="flex flex-1 flex-col overscroll-none select-none">
			{activeView === "sectorOverview" && (
				<SectorOverview
					sectors={sectors}
					planetsBySector={planetsBySector}
					filter={filter}
				/>
			)}

			{activeView === "notifications" && (
				<div className="w-full max-w-2xl">
					<Notifications
						notifications={notifications}
						onMarkRead={markNotificationAsRead}
					/>
				</div>
			)}

			{activeView === "finder" && (
				<div className="w-full max-w-2xl p-4">
					<h1 className="text-2xl font-bold text-white">Finder</h1>
					<p className="text-gray-400">
						This section is under construction. Stay tuned for updates!
					</p>
				</div>
			)}

			{activeView === "encyclopaedia" && (
				<div className="w-full max-w-2xl p-4">
					<h1 className="text-2xl font-bold text-white">Encyclopaedia</h1>
					<p className="text-gray-400">
						This section is under construction. Stay tuned for updates!
					</p>
				</div>
			)}

			{activeView === "settings" && (
				<div className="w-full max-w-2xl p-4">
					<h1 className="text-2xl font-bold text-white">Settings</h1>
					<p className="text-gray-400">
						Please use the Settings button to access game settings.
					</p>
				</div>
			)}
		</div>
	);
};

export default GameContent;
