import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Loading } from "../Loading";
import Filters, { FilterType } from "./Filters";
import GameActions from "./GameActions";
import GameContent from "./GameContent";
import { GameProvider } from "./GameContext";
import SideMenu, { MenuView } from "./SideMenu";
import StatusBar from "./StatusBar";
import { useGame } from "./useGame";
import { WindowProvider } from "./WindowContext";

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
				/>

				<div className="flex flex-1 flex-col">
					<StatusBar turn={game.turn} resources={game.faction.resources} />

					<GameContent activeView={activeView} filter={filter} />

					<div className="flex flex-row justify-between border-t border-purple-700/30 bg-gray-800/50 p-4 backdrop-blur-md">
						<Filters filter={filter} onChange={setFilter} />
						<GameActions onEndTurn={handleEndTurn} />
					</div>
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
				<GameScreenContent />
			</WindowProvider>
		</GameProvider>
	);
};

export default GameScreen;
