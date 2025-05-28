import React from "react";
import { GameAction } from "../../worker/api";
import { useGame } from "../hooks/useGame";

interface GameActionsProps {
	onEndTurn: () => void;
}

// This component will be responsible for managing and submitting player actions
const GameActions: React.FC<GameActionsProps> = ({ onEndTurn }) => {
	const { game, submitActions } = useGame();

	const handleEndTurn = async () => {
		try {
			// In a real implementation, you would collect all pending actions
			// and submit them before ending the turn
			const pendingActions: GameAction[] = []; // This would be populated with actual actions

			await submitActions(pendingActions);
			onEndTurn();
		} catch (error) {
			console.error("Failed to end turn:", error);
		}
	};

	return (
		<div className="flex">
			<button
				className="cursor-pointer rounded-lg bg-purple-700 px-3 py-2 font-bold text-white shadow-lg transition-all hover:bg-purple-600 sm:px-4"
				onClick={handleEndTurn}
			>
				<span className="">End Turn {game?.turn}</span>
			</button>
		</div>
	);
};

export default GameActions;
