import {
	ArrowLeftEndOnRectangleIcon,
	Bars3Icon,
	BellAlertIcon,
	GlobeAltIcon,
	BookOpenIcon,
	MagnifyingGlassIcon,
	WindowIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

import React from "react";

export type MenuView =
	| "sectorOverview"
	| "notifications"
	| "encyclopaedia"
	| "finder";

interface SideMenuProps {
	isExpanded: boolean;
	onToggleExpand: () => void;
	activeView: MenuView;
	onChangeView: (view: MenuView) => void;
	onExitGame: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
	isExpanded,
	onToggleExpand,
	activeView,
	onChangeView,
	onExitGame,
}) => {
	return (
		<div
			className={`flex h-full flex-col overflow-x-hidden transition-all duration-300 ${
				isExpanded
					? "w-64 border-r border-purple-700/30 bg-gradient-to-b from-slate-900 to-gray-900 shadow-xl"
					: "w-12 bg-slate-900/80"
			}`}
		>
			<button
				className="flex h-12 w-12 cursor-pointer items-center justify-center text-purple-300 transition-colors hover:text-purple-100"
				onClick={onToggleExpand}
				aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
			>
				<span className="relative inline-block h-6 w-6">
					<Bars3Icon
						className={`absolute top-0 left-0 h-6 w-6 transition-all duration-300 ${
							isExpanded
								? "scale-90 rotate-45 opacity-0"
								: "scale-100 rotate-0 opacity-100"
						}`}
					/>
					<XMarkIcon
						className={`absolute top-0 left-0 h-6 w-6 transition-all duration-300 ${
							isExpanded
								? "scale-100 rotate-0 opacity-100"
								: "scale-90 -rotate-45 opacity-0"
						}`}
					/>
				</span>
			</button>

			{isExpanded ? (
				<div className="p-4">
					{/* Main Navigation Options */}
					<div className="mb-6 space-y-2">
						<button
							className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left transition-colors ${
								activeView === "sectorOverview"
									? "bg-purple-800/60 text-white"
									: "text-purple-200 hover:bg-purple-900/40"
							}`}
							onClick={() => onChangeView("sectorOverview")}
						>
							<div className="flex items-center">
								<GlobeAltIcon className="mr-2 h-5 w-5" />
								Sector Overview
							</div>
						</button>

						<button
							className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-purple-200 transition-colors hover:bg-purple-900/40`}
							onClick={() => {
								// TODO: show a list of open windows
								alert("Open windows feature not implemented yet.");
							}}
						>
							<div className="flex items-center">
								<WindowIcon className="mr-2 h-5 w-5" />
								Windows
							</div>
						</button>

						<button
							className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left transition-colors ${
								activeView === "notifications"
									? "bg-purple-800/60 text-white"
									: "text-purple-200 hover:bg-purple-900/40"
							}`}
							onClick={() => onChangeView("notifications")}
						>
							<div className="flex items-center">
								<BellAlertIcon className="mr-2 h-5 w-5" />
								Notifications
							</div>
						</button>

						<button
							className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left transition-colors ${
								activeView === "finder"
									? "bg-purple-800/60 text-white"
									: "text-purple-200 hover:bg-purple-900/40"
							}`}
							onClick={() => onChangeView("finder")}
						>
							<div className="flex items-center">
								<MagnifyingGlassIcon className="mr-2 h-5 w-5" />
								Finder
							</div>
						</button>

						<button
							className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left transition-colors ${
								activeView === "encyclopaedia"
									? "bg-purple-800/60 text-white"
									: "text-purple-200 hover:bg-purple-900/40"
							}`}
							onClick={() => onChangeView("encyclopaedia")}
						>
							<div className="flex items-center">
								<BookOpenIcon className="mr-2 h-5 w-5" />
								Encyclopaedia
							</div>
						</button>
					</div>

					{/* Horizontal Rule */}
					<div className="my-4 h-px bg-purple-700/30"></div>

					{/* Game Options */}
					<div className="space-y-2">
						<button
							className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-purple-200 transition-colors hover:bg-purple-900/40"
							onClick={onExitGame}
						>
							<div className="flex items-center">
								<ArrowLeftEndOnRectangleIcon className="mr-2 h-5 w-5" />
								Exit Game
							</div>
						</button>
					</div>
				</div>
			) : (
				// Collapsed menu - only show icons
				<div className="mt-4 flex flex-col items-center space-y-2">
					<button
						className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ${
							activeView === "sectorOverview"
								? "bg-purple-800 text-white"
								: "text-purple-300 hover:text-purple-100"
						}`}
						onClick={() => onChangeView("sectorOverview")}
						title="Sector Overview"
					>
						<GlobeAltIcon className="h-5 w-5" />
					</button>

					<button
						className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-purple-300 hover:text-purple-100`}
						onClick={() => {
							// TODO: show a list of open windows
							alert("Open windows feature not implemented yet.");
						}}
						title="Windows"
					>
						<WindowIcon className="h-5 w-5" />
					</button>

					<button
						className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ${
							activeView === "notifications"
								? "bg-purple-800 text-white"
								: "text-purple-300 hover:text-purple-100"
						}`}
						onClick={() => onChangeView("notifications")}
						title="Notifications"
					>
						<BellAlertIcon className="h-5 w-5" />
					</button>

					<button
						className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ${
							activeView === "finder"
								? "bg-purple-800 text-white"
								: "text-purple-300 hover:text-purple-100"
						}`}
						onClick={() => onChangeView("finder")}
						title="Finder"
					>
						<MagnifyingGlassIcon className="h-5 w-5" />
					</button>

					<button
						className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ${
							activeView === "encyclopaedia"
								? "bg-purple-800 text-white"
								: "text-purple-300 hover:text-purple-100"
						}`}
						onClick={() => onChangeView("encyclopaedia")}
						title="Encyclopaedia"
					>
						<BookOpenIcon className="h-5 w-5" />
					</button>

					{/* Horizontal Rule as a small vertical line */}
					<div className="h-6 w-px bg-purple-700/30"></div>

					<button
						className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-purple-300 hover:text-purple-100"
						onClick={onExitGame}
						title="Exit Game"
					>
						<ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
					</button>
				</div>
			)}
		</div>
	);
};

export default SideMenu;
