import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { Loading } from "../Loading";
import Filters, { FilterType } from "./Filters";
import GameActions from "./GameActions";
import GameContent from "./GameContent";
import { GameProvider } from "./GameContext";
import SideMenu, { MenuView } from "./SideMenu";
import StatusBar from "./StatusBar";
import { useGame } from "./useGame";

// Types for minimized windows
export type MinimizedWindowType = {
	id: string;
	title: string;
	type: "sector" | "view";
	// For sectors we just need the sectorId
	sectorId?: string;
	// For view windows we need both sectorId and planetId plus the view type
	planetId?: string;
	viewType?: "fleets" | "defence" | "manufacturing" | "missions";
};

// Define view window type that will be used in GameContent and GameScreen
export type ViewWindowViewType =
	| "fleets"
	| "defence"
	| "manufacturing"
	| "missions";

export type ViewWindowType = {
	id: string;
	sectorId: string;
	planetId: string;
	viewType: ViewWindowViewType;
};

// Inner component that uses the game context
const GameScreenContent: React.FC = () => {
	const [filter, setFilter] = useState<FilterType>("OFF");
	const [menuExpanded, setMenuExpanded] = useState(false);
	const [activeView, setActiveView] = useState<MenuView>("sectorOverview");
	const [minimizedWindows, setMinimizedWindows] = useState<
		MinimizedWindowType[]
	>([]);

	// Move the window state management from GameContent to here
	const [openSectors, setOpenSectors] = useState<string[]>([]);
	const [openViewWindows, setOpenViewWindows] = useState<ViewWindowType[]>([]);

	const { game, loading, submitActions } = useGame();
	const navigate = useNavigate();

	const handleToggleMenu = () => {
		setMenuExpanded(!menuExpanded);
	};

	const handleChangeView = (view: MenuView) => {
		setActiveView(view);
	};

	const handleExitGame = () => {
		navigate("/");
	};

	const handleEndTurn = () => {
		submitActions([]); // TODO: Implement actual end turn logic
	};

	const handleMinimizeWindow = (windowInfo: MinimizedWindowType) => {
		setMinimizedWindows((prev) => [...prev, windowInfo]);
	};

	const handleCloseViewWindow = useCallback((viewId: string) => {
		setOpenViewWindows((prev) => prev.filter((view) => view.id !== viewId));
	}, []);

	const handleCloseSector = useCallback((sectorId: string) => {
		setOpenSectors((prev) => prev.filter((id) => id !== sectorId));
	}, []);

	// Define this first to avoid dependency ordering issues
	const handleMaximizeWindow = useCallback(
		(windowId: string) => {
			const windowToRestore = minimizedWindows.find((w) => w.id === windowId);
			if (windowToRestore) {
				// If it's a sector window
				if (windowToRestore.type === "sector" && windowToRestore.sectorId) {
					// Special case to avoid recursion - directly manipulate the state
					if (!openSectors.includes(windowToRestore.sectorId)) {
						setOpenSectors((prev) => [...prev, windowToRestore.sectorId!]);
					} else {
						setOpenSectors((prev) => {
							const others = prev.filter(
								(id) => id !== windowToRestore.sectorId,
							);
							return [...others, windowToRestore.sectorId!];
						});
					}
				}
				// If it's a view window
				else if (
					windowToRestore.type === "view" &&
					windowToRestore.sectorId &&
					windowToRestore.planetId &&
					windowToRestore.viewType
				) {
					const viewId = `${windowToRestore.planetId}-${windowToRestore.viewType}`;
					// Special case to avoid recursion - directly manipulate the state
					if (!openViewWindows.some((view) => view.id === viewId)) {
						setOpenViewWindows((prev) => [
							...prev,
							{
								id: viewId,
								sectorId: windowToRestore.sectorId!,
								planetId: windowToRestore.planetId!,
								viewType: windowToRestore.viewType!,
							},
						]);
					} else {
						setOpenViewWindows((prev) => {
							const others = prev.filter((view) => view.id !== viewId);
							return [
								...others,
								{
									id: viewId,
									sectorId: windowToRestore.sectorId!,
									planetId: windowToRestore.planetId!,
									viewType: windowToRestore.viewType!,
								},
							];
						});
					}
				}

				// Remove from minimized list
				setMinimizedWindows((prev) => prev.filter((w) => w.id !== windowId));
			}
		},
		[minimizedWindows, openSectors, openViewWindows],
	);

	// Handle sector opening/closing
	const handleOpenSector = useCallback(
		(sectorId: string) => {
			// Check if the sector window is in minimized windows
			const minimizedSector = minimizedWindows.find(
				(w) => w.type === "sector" && w.sectorId === sectorId,
			);

			if (minimizedSector) {
				// Restore from minimized
				handleMaximizeWindow(minimizedSector.id);
				return;
			}

			// Otherwise handle normally
			if (!openSectors.includes(sectorId)) {
				setOpenSectors((prev) => [...prev, sectorId]);
			} else {
				setOpenSectors((prev) => {
					const others = prev.filter((id) => id !== sectorId);
					return [...others, sectorId];
				});
			}
		},
		[openSectors, minimizedWindows, handleMaximizeWindow],
	);

	// Handle view planet opening/closing
	const handleViewPlanet = useCallback(
		(sectorId: string, planetId: string, viewType: ViewWindowViewType) => {
			const viewId = `${planetId}-${viewType}`;

			// Check if this view window is in minimized windows
			const minimizedView = minimizedWindows.find(
				(w) =>
					w.type === "view" &&
					w.sectorId === sectorId &&
					w.planetId === planetId &&
					w.viewType === viewType,
			);

			if (minimizedView) {
				// Restore from minimized
				handleMaximizeWindow(minimizedView.id);
				return;
			}

			// Check if this view is already open
			if (!openViewWindows.some((view) => view.id === viewId)) {
				setOpenViewWindows((prev) => [
					...prev,
					{ id: viewId, sectorId, planetId, viewType } as ViewWindowType,
				]);
			} else {
				// Bring to front if already open
				setOpenViewWindows((prev) => {
					const others = prev.filter((view) => view.id !== viewId);
					return [
						...others,
						{ id: viewId, sectorId, planetId, viewType } as ViewWindowType,
					];
				});
			}
		},
		[openViewWindows, minimizedWindows, handleMaximizeWindow],
	);

	if (loading || !game) {
		return <Loading text={window.location.pathname.split("/").pop()} />;
	}

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
			<div className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-cover opacity-50"></div>
			<div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950/60 to-purple-950/40"></div>
			<div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"></div>

			<div className="relative z-10 flex h-screen w-full flex-row">
				<SideMenu
					isExpanded={menuExpanded}
					onToggleExpand={handleToggleMenu}
					activeView={activeView}
					onChangeView={handleChangeView}
					onExitGame={handleExitGame}
					minimizedWindows={minimizedWindows}
					onMaximizeWindow={handleMaximizeWindow}
				/>

				<div className="flex flex-1 flex-col">
					<StatusBar turn={game.turn} resources={game.faction.resources} />

					<GameContent
						activeView={activeView}
						filter={filter}
						onMinimizeWindow={handleMinimizeWindow}
						openSectors={openSectors}
						openViewWindows={openViewWindows}
						onOpenSector={handleOpenSector}
						onViewPlanet={handleViewPlanet}
						onCloseViewWindow={handleCloseViewWindow}
						onCloseSector={handleCloseSector}
					/>

					<div className="flex flex-row justify-between border-t border-purple-700/30 bg-gray-800/50 p-4 backdrop-blur-md">
						<Filters filter={filter} onChange={setFilter} />
						<GameActions onEndTurn={handleEndTurn} />
					</div>
				</div>
			</div>
		</div>
	);
};

// Wrapper component that provides the GameContext
const GameScreen: React.FC = () => {
	return (
		<GameProvider>
			<GameScreenContent />
		</GameProvider>
	);
};

export default GameScreen;
