import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useGame } from "../hooks/useGame";
import { Loading } from "../Loading";
import Filters, { FilterType } from "./Filters";
import GameActions from "./GameActions";
import GameContent from "./GameContent";
import { GameProvider } from "./GameContext";
import MobileMenu from "./MobileMenu";
import SelectionOptions from "./SelectionOptions";
import { SelectionProvider } from "./SelectionContext";
import SideMenu, { MenuView } from "./SideMenu";
import StatusBar from "./StatusBar";
import TouchBlockingOverlay from "./TouchBlockingOverlay";
import { WindowProvider } from "./WindowProvider";

// Inner component that uses the game and window contexts
const GameScreenContent: React.FC = () => {
	const [filter, setFilter] = useState<FilterType>("OFF");
	const [menuExpanded, setMenuExpanded] = useState(false);
	const [activeView, setActiveView] = useState<MenuView>("sectorOverview");
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

	if (loading || !game) {
		return <Loading text={window.location.pathname.split("/").pop()} />;
	}

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white select-none">
			<div className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-cover opacity-50"></div>
			<div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950/60 to-purple-950/40"></div>
			<div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"></div>

			{/* Touch blocking overlay for mobile drag operations */}
			<TouchBlockingOverlay />

			{/* Mobile menu - shown on small screens only */}
			<div className="relative z-20 md:hidden">
				<MobileMenu
					activeView={activeView}
					onChangeView={handleChangeView}
					onExitGame={handleExitGame}
				/>
			</div>

			{/* Desktop side menu - hidden on small screens, shown on md and up */}
			<div className="hidden md:block">
				<SideMenu
					isExpanded={menuExpanded}
					onToggleExpand={handleToggleMenu}
					activeView={activeView}
					onChangeView={handleChangeView}
					onExitGame={handleExitGame}
				/>
			</div>

			{/* Main content container - position it to the right of SideMenu on desktop */}
			<div className="relative z-10 flex h-[calc(100vh-48px)] w-full flex-col md:h-screen md:w-[calc(100vw)] md:pl-12 md:transition-all md:duration-300 md:ease-in-out">
				{/* Adjust padding when menu is expanded */}
				<div
					className={`${menuExpanded ? "md:pl-52" : ""} flex w-full flex-1 flex-col overflow-hidden transition-all duration-300`}
				>
					{/* Status bar at the top */}
					<div className="border-b border-purple-700/30 bg-gray-900/80 backdrop-blur-md">
						<StatusBar turn={game.turn} resources={game.faction.resources} />
					</div>

					{/* Scrollable content area that takes remaining space */}
					<div className="flex-1 touch-pan-y overflow-auto overscroll-contain">
						<GameContent activeView={activeView} filter={filter} />
					</div>

					{/* Action bar at the bottom - fixed on mobile, part of flow on desktop */}
					<div className="fixed right-0 bottom-0 left-0 z-20 border-t border-purple-700/30 bg-gray-800/80 p-2 pb-2 shadow-lg backdrop-blur-md sm:p-4 sm:pb-4 md:static md:z-auto">
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
					{/* Spacer to prevent content from being hidden behind fixed action bar on mobile */}
					<div className="h-16 md:hidden"></div>
				</div>
			</div>
		</div>
	);
};

// Wrapper component that provides the GameContext and WindowContext
const GameScreen: React.FC = () => {
	return (
		<GameProvider>
			<WindowProvider>
				<SelectionProvider>
					<GameScreenContent />
				</SelectionProvider>
			</WindowProvider>
		</GameProvider>
	);
};

export default GameScreen;
