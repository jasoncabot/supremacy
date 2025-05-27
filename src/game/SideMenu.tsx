import {
	ArrowLeftEndOnRectangleIcon,
	Bars3Icon,
	BellAlertIcon,
	BookOpenIcon,
	GlobeAltIcon,
	MagnifyingGlassIcon,
	SparklesIcon,
	WindowIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

import {
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	MenuSeparator,
} from "@headlessui/react";
import React from "react";
import { MinimizedWindowType } from "./types/WindowTypes";

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
	minimizedWindows: MinimizedWindowType[];
	onMaximizeWindow: (windowId: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
	isExpanded,
	onToggleExpand,
	activeView,
	onChangeView,
	onExitGame,
	minimizedWindows,
	onMaximizeWindow,
}) => {
	return (
		<div
			className={`relative flex h-full flex-col overflow-hidden transition-all duration-300 ${
				isExpanded
					? "w-64 border-r border-purple-700/30 bg-gradient-to-b from-slate-900 to-gray-900 shadow-xl"
					: "w-12 bg-slate-900/80"
			}`}
		>
			{/* Fixed width toggle button that stays in the same position */}
			<button
				className="relative z-20 flex h-12 w-12 cursor-pointer items-center justify-center text-purple-300 transition-colors hover:text-purple-100"
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

			{/* Expanded menu content - always rendered but hidden when collapsed */}
			<div
				className={`absolute top-0 right-0 bottom-0 left-0 flex w-64 flex-col transition-all duration-300 ease-out ${
					isExpanded
						? "translate-x-0 opacity-100"
						: "pointer-events-none -translate-x-4 opacity-0"
				}`}
			>
				<div className="h-12 w-full"></div> {/* Spacer for the toggle button */}
				<div className="flex-1 overflow-y-auto p-4">
					{/* Main Navigation Options */}
					<div className="mb-6 space-y-2">
						<button
							className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left transition-colors ${
								activeView === "sectorOverview"
									? "bg-purple-800/60 text-white"
									: "text-purple-200 hover:bg-purple-900/40"
							}`}
							onClick={() => onChangeView("sectorOverview")}
							disabled={!isExpanded}
						>
							<div className="flex items-center">
								<GlobeAltIcon className="mr-2 h-5 w-5" />
								Sector Overview
							</div>
						</button>

						<button
							className="w-full rounded-lg px-3 py-2 text-left text-purple-200 transition-colors"
							disabled={!isExpanded}
						>
							<div className="flex items-center">
								<div className="relative mr-2">
									<WindowIcon className="h-5 w-5" />
									{minimizedWindows.length > 0 && (
										<span className="absolute -top-1 -right-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-purple-600 text-xs font-medium">
											{minimizedWindows.length}
										</span>
									)}
								</div>
								Windows
							</div>
						</button>

						{/* List of minimized windows */}
						{minimizedWindows.length > 0 && (
							<div className="ml-4 space-y-2">
								{minimizedWindows.map((window) => (
									<button
										key={window.id}
										className="w-full cursor-pointer rounded-lg px-3 py-1 text-left text-sm text-purple-200 transition-colors hover:bg-purple-900/40"
										onClick={() => onMaximizeWindow(window.id)}
										disabled={!isExpanded}
									>
										{window.type === "sector" && (
											<SparklesIcon className="mr-2 inline h-4 w-4" />
										)}
										{window.type === "view" && (
											<GlobeAltIcon className="mr-2 inline h-4 w-4" />
										)}
										{window.title}
									</button>
								))}
							</div>
						)}

						<button
							className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left transition-colors ${
								activeView === "notifications"
									? "bg-purple-800/60 text-white"
									: "text-purple-200 hover:bg-purple-900/40"
							}`}
							onClick={() => onChangeView("notifications")}
							disabled={!isExpanded}
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
							disabled={!isExpanded}
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
							disabled={!isExpanded}
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
							disabled={!isExpanded}
						>
							<div className="flex items-center">
								<ArrowLeftEndOnRectangleIcon className="mr-2 h-5 w-5" />
								Exit Game
							</div>
						</button>
					</div>
				</div>
			</div>

			{/* Collapsed menu icons - always rendered but hidden when expanded */}
			<div
				className={`absolute top-0 bottom-0 left-0 flex w-12 flex-col transition-all duration-300 ease-out ${
					isExpanded
						? "pointer-events-none translate-x-4 opacity-0"
						: "translate-x-0 opacity-100"
				}`}
			>
				<div className="h-12 w-full"></div> {/* Spacer for the toggle button */}
				<div className="mt-4 flex flex-col items-center space-y-2">
					<Menu>
						<MenuButton
							className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ${
								activeView === "sectorOverview"
									? "bg-purple-800 text-white"
									: "text-purple-300 hover:text-purple-100"
							}`}
							title="Sector Overview"
							onClick={() => onChangeView("sectorOverview")}
							disabled={isExpanded}
						>
							<GlobeAltIcon className="h-5 w-5" />
						</MenuButton>
					</Menu>
					<Menu>
						<MenuButton
							className={`flex h-10 w-10 items-center justify-center rounded-md text-purple-300 hover:text-purple-100 ${
								minimizedWindows.length > 0
									? "cursor-pointer"
									: "cursor-not-allowed text-purple-300 hover:text-purple-100"
							}`}
							title="Windows"
							disabled={minimizedWindows.length === 0 || isExpanded}
						>
							<div className="relative">
								<WindowIcon className="h-5 w-5" />
								{minimizedWindows.length > 0 && (
									<span className="absolute -top-1 -right-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-purple-600 text-xs font-medium">
										{minimizedWindows.length}
									</span>
								)}
							</div>
						</MenuButton>

						<MenuItems
							transition
							anchor="left start"
							className="z-50 flex w-52 origin-top-right flex-col rounded-sm border border-white/5 bg-gray-900 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
						>
							{minimizedWindows.map((window) => (
								<MenuItem key={window.id}>
									<button
										className="w-full cursor-pointer rounded-sm p-3 text-left text-sm text-purple-200 transition-colors hover:bg-purple-900/40"
										onClick={() => onMaximizeWindow(window.id)}
									>
										{window.title}
									</button>
								</MenuItem>
							))}
						</MenuItems>
					</Menu>

					<Menu>
						<MenuButton
							className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ${
								activeView === "notifications"
									? "bg-purple-800 text-white"
									: "text-purple-300 hover:text-purple-100"
							}`}
							title="Notifications"
							onClick={() => onChangeView("notifications")}
							disabled={isExpanded}
						>
							<BellAlertIcon className="h-5 w-5" />
						</MenuButton>
					</Menu>

					<Menu>
						<MenuButton
							className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ${
								activeView === "finder"
									? "bg-purple-800 text-white"
									: "text-purple-300 hover:text-purple-100"
							}`}
							title="Finder"
							onClick={() => onChangeView("finder")}
							disabled={isExpanded}
						>
							<MagnifyingGlassIcon className="h-5 w-5" />
						</MenuButton>
					</Menu>

					<Menu>
						<MenuButton
							className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ${
								activeView === "encyclopaedia"
									? "bg-purple-800 text-white"
									: "text-purple-300 hover:text-purple-100"
							}`}
							title="Encyclopaedia"
							onClick={() => onChangeView("encyclopaedia")}
							disabled={isExpanded}
						>
							<BookOpenIcon className="h-5 w-5" />
						</MenuButton>
					</Menu>

					<MenuSeparator className="h-6 w-px bg-purple-700/30" />

					<Menu>
						<MenuButton
							className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-purple-300 hover:text-purple-100"
							title="Exit Game"
							onClick={onExitGame}
							disabled={isExpanded}
						>
							<ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
						</MenuButton>
					</Menu>
				</div>
			</div>
		</div>
	);
};

export default SideMenu;
