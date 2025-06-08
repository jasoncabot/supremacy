import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGame } from "../hooks/useGame";
import { Loading } from "../Loading";
import { BackgroundMusicProvider } from "./BackgroundMusicProvider";
import Filters, { FilterType } from "./Filters";
import FloatingWindows from "./FloatingWindows";
import GameActions from "./GameActions";
import GameContent from "./GameContent";
import { GameProvider } from "./GameContext";
import { GlobalKeyboardHandler } from "./GlobalKeyboardHandler";
import MobileMenu from "./MobileMenu";
import { SelectionProvider } from "./SelectionContext";
import SelectionOptions from "./SelectionOptions";
import SideMenu, { MenuView } from "./SideMenu";
import StatusBar from "./StatusBar";
import TouchBlockingOverlay from "./TouchBlockingOverlay";
import { WindowProvider } from "./WindowProvider";

// Inner component that uses the game and window contexts
const GameScreenContent: React.FC = () => {
	const [filter, setFilter] = useState<FilterType>("LOYALTY_SUPPORT");
	const [menuExpanded, setMenuExpanded] = useState(false);
	const [activeView, setActiveView] = useState<MenuView>("sectorOverview");
	const { game, loading, submitActions } = useGame();
	const { gameId } = useParams<{ gameId: string }>();
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

	const handleOpenSettings = () => {
		navigate(`/game/${gameId}/settings`);
	};

	const handleEndTurn = () => {
		submitActions([]); // TODO: Implement actual end turn logic
	};

	if (loading || !game) {
		return <Loading text={window.location.pathname.split("/").pop()} />;
	}

	return (
		<div className="relative flex h-dvh flex-col overflow-hidden bg-black text-white select-none">
			<div className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-cover opacity-50"></div>
			<div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950/60 to-purple-950/40"></div>
			<div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"></div>

			{/* Touch blocking overlay for mobile drag operations */}
			<TouchBlockingOverlay />

			{/* Desktop side menu - hidden on small screens, shown on md and up */}
			<div className="hidden md:block">
				<SideMenu
					isExpanded={menuExpanded}
					onToggleExpand={handleToggleMenu}
					activeView={activeView}
					onChangeView={handleChangeView}
					onExitGame={handleExitGame}
					onOpenSettings={handleOpenSettings}
				/>
			</div>

			{/* Floating Windows - rendered outside of content flow */}
			<FloatingWindows filter={filter} />

			{/* Main content container - flexbox layout */}
			<div className="relative z-10 flex h-full w-full flex-col md:w-[calc(100vw)] md:pl-12 md:transition-all md:duration-300 md:ease-in-out">
				{/* Adjust padding when menu is expanded */}
				<div className="flex w-full flex-1 flex-col overflow-hidden transition-all duration-300">
					{/* Header - always visible at top */}
					<div className="flex-shrink-0">
						{/* Mobile menu - only on mobile */}
						<div className="md:hidden">
							<MobileMenu
								activeView={activeView}
								onChangeView={handleChangeView}
								onExitGame={handleExitGame}
								onOpenSettings={handleOpenSettings}
							/>
						</div>

						{/* Status bar - always visible */}
						<div className="border-b border-purple-700/30 bg-gray-900/80 backdrop-blur-md">
							<StatusBar turn={game.turn} resources={game.faction.resources} />
						</div>
					</div>

					{/* Scrollable content area - takes remaining space */}
					<div
						className={`flex flex-1 touch-pan-y overflow-auto overscroll-contain ${menuExpanded ? "md:pl-52" : ""} transition-all duration-300`}
					>
						<GameContent activeView={activeView} filter={filter} />
					</div>

					{/* Footer - always visible at bottom */}
					<div className="flex-shrink-0 border-t border-purple-700/30 bg-gray-800/80 p-2 pb-2 shadow-lg backdrop-blur-md sm:p-4 sm:pb-4">
						{/* Mobile: Selection options as separate row */}
						<div className="mb-2 md:hidden">
							<SelectionOptions className="justify-center" />
						</div>
						<div className="flex flex-row items-center justify-between">
							<Filters filter={filter} onChange={setFilter} />
							{/* Desktop: Selection options in the same row */}
							<div className="hidden md:flex md:flex-1 md:justify-center">
								<SelectionOptions className="justify-center" />
							</div>
							<GameActions onEndTurn={handleEndTurn} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// Wrapper component that provides the GameContext and WindowContext
const GameScreen: React.FC = () => {
	return (
		<BackgroundMusicProvider>
			<GameProvider>
				<WindowProvider>
					<GlobalKeyboardHandler
						onGlobalSearch={() => {
							// TODO: Implement global search functionality
							console.log("Global search triggered");
						}}
						onNavigateToFinder={() => {
							// TODO: Implement navigation to finder route
							console.log("Navigate to finder triggered");
						}}
					/>
					<SelectionProvider>
						<GameScreenContent />
					</SelectionProvider>
				</WindowProvider>
			</GameProvider>
		</BackgroundMusicProvider>
	);
};

export default GameScreen;
