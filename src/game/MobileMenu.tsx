import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
	ArrowLeftEndOnRectangleIcon,
	BellAlertIcon,
	BookOpenIcon,
	ClipboardDocumentListIcon,
	Cog6ToothIcon,
	EllipsisHorizontalIcon,
	GlobeAltIcon,
	MagnifyingGlassIcon,
	WindowIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useWindowContext } from "../hooks/useWindowContext";
import { MenuView } from "./SideMenu";
import { useActionQueue } from "./ActionQueueContextDef";

interface MobileMenuProps {
	activeView: MenuView;
	onChangeView: (view: MenuView) => void;
	onExitGame: () => void;
	onOpenSettings: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
	activeView,
	onChangeView,
	onExitGame,
	onOpenSettings,
}) => {
	const { minimizedWindows, handleMaximizeWindow } = useWindowContext();
	const { actions } = useActionQueue();

	const mainMenuItems = [
		{
			id: "sectorOverview",
			label: "Sectors",
			icon: <GlobeAltIcon className="h-5 w-5" />,
		},
		{
			id: "notifications",
			label: "Notifications",
			icon: <BellAlertIcon className="h-5 w-5" />,
		},
	];

	const overflowMenuItems = [
		{
			id: "orders",
			label: "Orders",
			icon: (
				<div className="relative">
					<ClipboardDocumentListIcon className="h-5 w-5" />
					{actions.length > 0 && (
						<span className="absolute -top-1 -right-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-blue-600 text-xs font-medium">
							{actions.length}
						</span>
					)}
				</div>
			),
		},
		{
			id: "finder",
			label: "Finder",
			icon: <MagnifyingGlassIcon className="h-5 w-5" />,
		},
		{
			id: "encyclopaedia",
			label: "Encyclopaedia",
			icon: <BookOpenIcon className="h-5 w-5" />,
		},
	];

	const hasMinimizedWindows = minimizedWindows.length > 0;
	return (
		<div className="flex h-12 w-full items-center justify-between border-b border-purple-700/30 bg-gray-900/90 px-2 backdrop-blur">
			{/* Main horizontal menu items */}
			<div className="flex flex-1 items-center gap-1 overflow-x-auto px-1">
				{mainMenuItems.map((item) => (
					<button
						key={item.id}
						className={`flex items-center rounded px-3 py-1.5 text-sm whitespace-nowrap ${
							activeView === item.id
								? "bg-purple-800/60 text-white"
								: "text-purple-200 hover:bg-purple-900/40"
						}`}
						onClick={() => onChangeView(item.id as MenuView)}
					>
						<span className="mr-1">{item.icon}</span>
						<span>{item.label}</span>
					</button>
				))}

				{/* Windows dropdown */}
				<Menu as="div" className="relative">
					<MenuButton
						className={`flex items-center rounded px-3 py-1.5 text-sm ${
							hasMinimizedWindows
								? "cursor-pointer text-purple-200 hover:bg-purple-900/40"
								: "text-purple-400 opacity-50"
						}`}
						disabled={!hasMinimizedWindows}
					>
						<div className="relative mr-1">
							<WindowIcon className="h-5 w-5" />
							{hasMinimizedWindows && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-xs font-medium">
									{minimizedWindows.length}
								</span>
							)}
						</div>
						<span>Windows</span>
					</MenuButton>

					{hasMinimizedWindows && (
						<MenuItems
							transition
							anchor="bottom start"
							className="z-50 mt-1 flex w-52 origin-top-left flex-col rounded border border-white/5 bg-gray-900 p-1 text-sm text-white shadow-lg transition duration-100 ease-out focus:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0"
						>
							{minimizedWindows.map((minimizedWindow) => (
								<MenuItem key={minimizedWindow.id}>
									<button
										className="w-full rounded p-2 text-left text-sm text-purple-200 data-active:bg-purple-900/40 data-active:text-white"
										onClick={() => handleMaximizeWindow(minimizedWindow)}
									>
										{minimizedWindow.title}
									</button>
								</MenuItem>
							))}
						</MenuItems>
					)}
				</Menu>
			</div>

			{/* Overflow menu */}
			<Menu as="div" className="relative">
				<MenuButton className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-purple-200 hover:bg-purple-900/40">
					<EllipsisHorizontalIcon className="h-5 w-5" />
				</MenuButton>

				<MenuItems
					transition
					anchor="bottom end"
					className="z-50 mt-1 flex w-52 origin-top-right flex-col rounded border border-white/5 bg-gray-900 p-1 text-sm text-white shadow-lg transition duration-100 ease-out focus:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0"
				>
					{/* Overflow menu items */}
					{overflowMenuItems.map((item) => (
						<MenuItem key={item.id}>
							<button
								className="flex w-full cursor-pointer items-center rounded p-2 text-left text-purple-200 data-active:bg-purple-900/40 data-active:text-white data-focus:bg-purple-800/60 data-focus:text-white"
								onClick={() => onChangeView(item.id as MenuView)}
							>
								<span className="mr-2">{item.icon}</span>
								<span>{item.label}</span>
							</button>
						</MenuItem>
					))}

					{/* Separator */}
					<div className="my-1 h-px bg-purple-700/30"></div>

					{/* Settings */}
					<MenuItem>
						<button
							className="flex w-full cursor-pointer items-center rounded p-2 text-left text-purple-200 data-active:bg-purple-900/40 data-active:text-white"
							onClick={onOpenSettings}
						>
							<Cog6ToothIcon className="mr-2 h-5 w-5" />
							<span>Settings</span>
						</button>
					</MenuItem>

					{/* Exit game */}
					<MenuItem>
						<button
							className="flex w-full cursor-pointer items-center rounded p-2 text-left text-purple-200 data-active:bg-purple-900/40 data-active:text-white"
							onClick={onExitGame}
						>
							<ArrowLeftEndOnRectangleIcon className="mr-2 h-5 w-5" />
							<span>Exit Game</span>
						</button>
					</MenuItem>
				</MenuItems>
			</Menu>
		</div>
	);
};

export default MobileMenu;
