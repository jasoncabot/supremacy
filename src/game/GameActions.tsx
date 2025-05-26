import React from "react";
import { GameAction } from "../../worker/api";
import { useGame } from "./useGame";

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
		<div className="fixed right-4 bottom-4 flex gap-3">
			<button
				className="rounded-lg bg-purple-700 px-4 py-2 font-bold text-white shadow-lg transition-all hover:bg-purple-600"
				onClick={handleEndTurn}
			>
				End Turn {game?.turn}
			</button>
		</div>
	);
};

export default GameActions;
