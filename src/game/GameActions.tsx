import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { GameAction } from "../../worker/api";
import { useGame } from "../hooks/useGame";
import { useActionQueue } from "./ActionQueueContextDef";
import ActionQueueView from "./ActionQueueView";

interface GameActionsProps {
	onEndTurn: () => void;
}

// This component will be responsible for managing and submitting player actions
const GameActions: React.FC<GameActionsProps> = ({ onEndTurn }) => {
	const { game, submitActions } = useGame();
	const { actions, clearActions } = useActionQueue();
	const [showActionQueue, setShowActionQueue] = useState(false);

	const handleEndTurn = async () => {
		try {
			// In a real implementation, you would collect all pending actions
			// and submit them before ending the turn
			const pendingActions: GameAction[] = []; // This would be populated with actual actions

			await submitActions(pendingActions);
			clearActions(); // Clear the action queue after submitting
			onEndTurn();
		} catch (error) {
			console.error("Failed to end turn:", error);
		}
	};

	return (
		<>
			<div className="flex gap-2">
				{/* Action Queue Button */}
				<button
					className={`cursor-pointer rounded-lg px-3 py-2 font-bold text-white shadow-lg transition-all hover:bg-blue-600 sm:px-4 ${
						actions.length > 0
							? "border-2 border-blue-400 bg-blue-700"
							: "bg-gray-600 hover:bg-gray-500"
					}`}
					onClick={() => setShowActionQueue(true)}
					title={`View action queue (${actions.length} actions)`}
				>
					<span className="hidden sm:inline">Orders</span>
					<span className="sm:hidden">📋</span>
					{actions.length > 0 && (
						<span className="ml-1 rounded-full bg-blue-400 px-2 py-0.5 text-xs">
							{actions.length}
						</span>
					)}
				</button>

				{/* End Turn Button */}
				<button
					className="cursor-pointer rounded-lg bg-purple-700 px-3 py-2 font-bold text-white shadow-lg transition-all hover:bg-purple-600 sm:px-4"
					onClick={handleEndTurn}
				>
					<span className="">End Turn {game?.turn}</span>
				</button>
			</div>

			{/* Action Queue Dialog */}
			<Dialog
				open={showActionQueue}
				onClose={() => setShowActionQueue(false)}
				className="relative z-50"
			>
				{/* Backdrop */}
				<div className="fixed inset-0 bg-black/50" aria-hidden="true" />

				{/* Full-screen container to center the panel */}
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<DialogPanel className="relative h-[80vh] w-full max-w-4xl rounded-lg bg-gray-900 shadow-xl">
						{/* Header */}
						<div className="flex items-center justify-between border-b border-gray-700 p-4">
							<DialogTitle className="text-lg font-semibold text-gray-100">
								Queued Orders
							</DialogTitle>
							<button
								onClick={() => setShowActionQueue(false)}
								className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
							>
								<XMarkIcon className="h-5 w-5" />
							</button>
						</div>

						{/* Content */}
						<div className="h-[calc(80vh-4rem)]">
							<ActionQueueView />
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	);
};

export default GameActions;
