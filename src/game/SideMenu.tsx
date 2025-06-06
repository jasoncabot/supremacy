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
import React from "react";
import { useWindowContext } from "../hooks/useWindowContext";

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
	const { minimizedWindows, handleMaximizeWindow } = useWindowContext();

	const renderMenuButton = (
		icon: React.ComponentType<{ className?: string }>,
		label: string,
		view: MenuView | null = null,
		onClick?: () => void,
		isActive = false,
	) => {
		const Icon = icon;
		const handleClick =
			onClick || (view ? () => onChangeView(view) : undefined);

		return (
			<button
				className={`group flex h-12 w-full cursor-pointer items-center rounded-lg px-3 py-2 transition-colors duration-200 ${
					isActive
						? "bg-purple-800 text-white"
						: "text-purple-300 hover:bg-purple-900/40 hover:text-purple-100"
				}`}
				onClick={handleClick}
				title={!isExpanded ? label : undefined}
			>
				<div
					className={`flex items-center ${isExpanded ? "w-full" : "w-full justify-center"}`}
				>
					<Icon className="h-5 w-5 flex-shrink-0" />
					{isExpanded && <span className="ml-3 truncate">{label}</span>}
				</div>
			</button>
		);
	};

	return (
		<div
			className={`fixed top-0 bottom-0 left-0 z-30 flex h-screen transform-gpu flex-col overflow-hidden bg-slate-900 transition-[width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
				isExpanded
					? "w-64 border-r border-purple-700/30 bg-gradient-to-b from-slate-900 to-gray-900 shadow-xl"
					: "w-12"
			}`}
		>
			{/* Toggle button */}
			<div className="flex h-12 w-full items-center border-b border-purple-700/20">
				<button
					className="flex h-12 w-12 cursor-pointer items-center justify-center text-purple-300 transition-colors duration-200 hover:text-purple-100"
					onClick={onToggleExpand}
					aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
				>
					{isExpanded ? (
						<XMarkIcon className="h-5 w-5" />
					) : (
						<Bars3Icon className="h-5 w-5" />
					)}
				</button>
				{isExpanded && (
					<span className="ml-2 text-sm font-medium text-purple-200"></span>
				)}
			</div>

			{/* Menu content */}
			<div className={`flex-1 overflow-hidden p-1`}>
				<div className="flex h-full flex-col space-y-1 overflow-y-auto">
					{/* Main Navigation */}
					{renderMenuButton(
						GlobeAltIcon,
						"Sector Overview",
						"sectorOverview",
						undefined,
						activeView === "sectorOverview",
					)}

					{/* Windows section */}
					<div className="relative">
						{renderMenuButton(
							({ className }) => (
								<div className="relative">
									<WindowIcon className={className} />
									{minimizedWindows.length > 0 && (
										<span className="absolute -top-1 -right-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-purple-600 text-xs font-medium">
											{minimizedWindows.length}
										</span>
									)}
								</div>
							),
							"Windows",
							null,
							undefined,
							false,
						)}

						{/* Minimized windows list - only show when expanded */}
						{isExpanded && minimizedWindows.length > 0 && (
							<div className="mt-1 ml-6 space-y-1">
								{minimizedWindows.map((window) => (
									<button
										key={window.id}
										className="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-left text-sm text-purple-200 transition-colors hover:bg-purple-900/40"
										onClick={() => handleMaximizeWindow(window)}
									>
										{(() => {
											switch (window.type) {
												case "sector":
													return (
														<SparklesIcon className="mr-2 h-4 w-4 flex-shrink-0" />
													);
												case "fleets":
												case "defence":
												case "manufacturing":
												case "missions":
													return (
														<GlobeAltIcon className="mr-2 h-4 w-4 flex-shrink-0" />
													);
												default:
													return null;
											}
										})()}
										<span className="truncate">{window.title}</span>
									</button>
								))}
							</div>
						)}
					</div>

					{renderMenuButton(
						BellAlertIcon,
						"Notifications",
						"notifications",
						undefined,
						activeView === "notifications",
					)}

					{renderMenuButton(
						MagnifyingGlassIcon,
						"Finder",
						"finder",
						undefined,
						activeView === "finder",
					)}

					{renderMenuButton(
						BookOpenIcon,
						"Encyclopaedia",
						"encyclopaedia",
						undefined,
						activeView === "encyclopaedia",
					)}

					{/* Spacer */}
					<div className="flex-1" />

					{/* Separator */}
					<div className={`${isExpanded ? "h-px bg-purple-700/30" : "h-2"}`} />

					{/* Exit Game */}
					{renderMenuButton(
						ArrowLeftEndOnRectangleIcon,
						"Exit Game",
						null,
						onExitGame,
					)}
				</div>
			</div>
		</div>
	);
};

export default SideMenu;
