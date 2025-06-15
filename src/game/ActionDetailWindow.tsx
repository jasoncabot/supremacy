import {
	ClockIcon,
	ExclamationTriangleIcon,
	EyeIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { MissionType } from "../../worker/api";
import {
	SelectableItem,
	useSelectionContext,
} from "../hooks/useSelectionContext";
import { ActionDefinition } from "./types/actions";

interface ActionDetailWindowProps {
	actionDetails: {
		actionId: string;
		actionDef: ActionDefinition;
		sources: SelectableItem[];
		target?: SelectableItem;
		missionData?: { agents?: string[]; decoys?: string[]; missionType?: string };
	};
}

const ActionDetailWindow: React.FC<ActionDetailWindowProps> = ({
	actionDetails,
}) => {
	const { confirmAction, cancelActionConfirmation } = useSelectionContext();
	const { actionDef, sources, target, missionData } = actionDetails;

	// Local state for action-specific options - initialize with existing data
	const [selectedAgents, setSelectedAgents] = useState<string[]>(missionData?.agents || []);
	const [selectedDecoys, setSelectedDecoys] = useState<string[]>(missionData?.decoys || []);
	const [selectedMissionType, setSelectedMissionType] =
		useState<MissionType | null>(missionData?.missionType as MissionType || null);

	const handleConfirm = () => {
		// For mission actions, pass the mission data directly to confirmAction
		if (actionDef.type === "mission") {
			confirmAction({
				agents: selectedAgents,
				decoys: selectedDecoys,
				missionType: selectedMissionType || undefined,
			});
		} else {
			// For non-mission actions, confirm without mission data
			confirmAction();
		}
	};

	// Helper function to get display name for items
	const getDisplayName = (item: SelectableItem): string => {
		if (item.type === "planet") {
			return item.metadata?.name || `Planet ${item.id}`;
		}
		return item.name || `${item.type} ${item.id}`;
	};

	const renderActionSpecificUI = () => {
		switch (actionDef.type) {
			case "move": {
				const estimatedTime = sources.length * 2; // Simple calculation
				return (
					<div className="space-y-4">
						<div className="flex items-center gap-2 rounded bg-blue-600/20 p-3 text-blue-300">
							<ClockIcon className="size-5" />
							<span>Estimated travel time: {estimatedTime} hours</span>
						</div>
						<div className="text-sm text-slate-400">
							Moving {sources.length} unit(s) to{" "}
							<span className="text-white">
								{target ? getDisplayName(target) : "selected target"}
							</span>
						</div>
					</div>
				);
			}

			case "mission": {
				const availableAgents = sources.filter((s) => s.type === "personnel");
				const availableDecoys = sources.filter(
					(s) => s.type === "troop" || s.type === "squadron",
				);

				const hasExistingData = missionData && (missionData.agents?.length || missionData.decoys?.length || missionData.missionType);

				return (
					<div className="space-y-4">
						{hasExistingData && (
							<div className="text-sm text-slate-400 italic">
								Modify mission configuration below:
							</div>
						)}
						
						<div className="space-y-2">
							<label className="block text-sm font-medium text-slate-300">
								Mission Type
							</label>
							<select
								value={selectedMissionType || ""}
								onChange={(e) =>
									setSelectedMissionType(e.target.value as MissionType)
								}
								className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
							>
								<option value="">Select mission type...</option>
								<option value="reconnaissance">Reconnaissance</option>
								<option value="sabotage">Sabotage</option>
								<option value="espionage">Espionage</option>
								<option value="assassination">Assassination</option>
								<option value="diplomacy">Diplomacy</option>
								<option value="recruitment">Recruitment</option>
							</select>
						</div>

						{availableAgents.length > 0 && (
							<div className="space-y-2">
								<label className="block text-sm font-medium text-slate-300">
									Select Agents ({availableAgents.length} available)
								</label>
								<div className="max-h-32 space-y-1 overflow-y-auto">
									{availableAgents.map((agent) => (
										<label key={agent.id} className="flex items-center gap-2">
											<input
												type="checkbox"
												checked={selectedAgents.includes(agent.id)}
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedAgents([...selectedAgents, agent.id]);
													} else {
														setSelectedAgents(
															selectedAgents.filter((id) => id !== agent.id),
														);
													}
												}}
												className="rounded border-slate-600 bg-slate-800 text-purple-600 focus:ring-purple-500"
											/>
											<UserIcon className="size-4 text-slate-400" />
											<span className="text-sm text-white">
												{getDisplayName(agent)}
											</span>
										</label>
									))}
								</div>
							</div>
						)}

						{availableDecoys.length > 0 && (
							<div className="space-y-2">
								<label className="block text-sm font-medium text-slate-300">
									Select Decoys ({availableDecoys.length} available)
								</label>
								<div className="max-h-32 space-y-1 overflow-y-auto">
									{availableDecoys.map((decoy) => (
										<label key={decoy.id} className="flex items-center gap-2">
											<input
												type="checkbox"
												checked={selectedDecoys.includes(decoy.id)}
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedDecoys([...selectedDecoys, decoy.id]);
													} else {
														setSelectedDecoys(
															selectedDecoys.filter((id) => id !== decoy.id),
														);
													}
												}}
												className="rounded border-slate-600 bg-slate-800 text-purple-600 focus:ring-purple-500"
											/>
											<EyeIcon className="size-4 text-slate-400" />
											<span className="text-sm text-white">
												{getDisplayName(decoy)}
											</span>
										</label>
									))}
								</div>
							</div>
						)}

						<div className="text-sm text-slate-400">
							Mission target:{" "}
							<span className="text-white">
								{target ? getDisplayName(target) : "selected target"}
							</span>
						</div>
					</div>
				);
			}

			case "scrap": {
				return (
					<div className="space-y-4">
						<div className="flex items-center gap-2 rounded bg-red-600/20 p-3 text-red-300">
							<ExclamationTriangleIcon className="size-5" />
							<span>This action cannot be undone!</span>
						</div>
						<div className="text-sm text-slate-400">
							You are about to scrap {sources.length} unit(s). This will
							permanently remove them from the game.
						</div>
					</div>
				);
			}

			case "bombard": {
				return (
					<div className="space-y-4">
						<div className="flex items-center gap-2 rounded bg-orange-600/20 p-3 text-orange-300">
							<ExclamationTriangleIcon className="size-5" />
							<span>This will damage the target planet</span>
						</div>
						<div className="text-sm text-slate-400">
							Bombarding{" "}
							<span className="text-white">
								{target ? getDisplayName(target) : "selected target"}
							</span>{" "}
							with {sources.length} fleet(s).
						</div>
					</div>
				);
			}

			case "assault": {
				return (
					<div className="space-y-4">
						<div className="flex items-center gap-2 rounded bg-red-600/20 p-3 text-red-300">
							<ExclamationTriangleIcon className="size-5" />
							<span>High risk combat operation</span>
						</div>
						<div className="text-sm text-slate-400">
							Assaulting{" "}
							<span className="text-white">
								{target ? getDisplayName(target) : "selected target"}
							</span>{" "}
							with {sources.length} fleet(s). This may result in heavy
							casualties.
						</div>
					</div>
				);
			}

			default: {
				return (
					<div className="text-sm text-slate-400">
						Execute action:{" "}
						<span className="text-white">{actionDef.label}</span>
					</div>
				);
			}
		}
	};

	return (
		<div className="flex flex-1 flex-col space-y-4 p-4">
			{/* Sources */}
			<div className="space-y-2">
				<h4 className="text-sm font-medium text-slate-300">
					Selected Units ({sources.length})
				</h4>
				<div className="max-h-24 space-y-1 overflow-y-auto">
					{sources.map((source) => (
						<div key={source.id} className="flex items-center gap-2 text-sm">
							<span className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300">
								{source.type}
							</span>
							<span className="text-white">{getDisplayName(source)}</span>
						</div>
					))}
				</div>
			</div>

			{/* Target (if applicable) */}
			{target && (
				<div className="space-y-2">
					<h4 className="text-sm font-medium text-slate-300">Target</h4>
					<div className="flex items-center gap-2 text-sm">
						<span className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300">
							{target.type}
						</span>
						<span className="text-white">{getDisplayName(target)}</span>
					</div>
				</div>
			)}

			{/* Current Mission Data (if any) */}
			{actionDef.type === "mission" && missionData && (
				<div className="space-y-2">
					<h4 className="text-sm font-medium text-slate-300">Current Mission Configuration</h4>
					<div className="rounded bg-slate-800/50 p-3 space-y-2">
						{missionData.missionType && (
							<div className="flex items-center gap-2 text-sm">
								<span className="text-slate-400">Mission Type:</span>
								<span className="rounded bg-purple-600/20 px-2 py-1 text-xs text-purple-300 capitalize">
									{missionData.missionType}
								</span>
							</div>
						)}
						
						{missionData.agents && missionData.agents.length > 0 && (
							<div className="flex items-center gap-2 text-sm">
								<span className="text-slate-400">Selected Agents:</span>
								<div className="flex flex-wrap gap-1">
									{missionData.agents.map((agentId) => {
										const agent = sources.find(s => s.id === agentId);
										return agent ? (
											<span key={agentId} className="rounded bg-blue-600/20 px-2 py-1 text-xs text-blue-300">
												<UserIcon className="inline size-3 mr-1" />
												{getDisplayName(agent)}
											</span>
										) : null;
									})}
								</div>
							</div>
						)}

						{missionData.decoys && missionData.decoys.length > 0 && (
							<div className="flex items-center gap-2 text-sm">
								<span className="text-slate-400">Selected Decoys:</span>
								<div className="flex flex-wrap gap-1">
									{missionData.decoys.map((decoyId) => {
										const decoy = sources.find(s => s.id === decoyId);
										return decoy ? (
											<span key={decoyId} className="rounded bg-orange-600/20 px-2 py-1 text-xs text-orange-300">
												<EyeIcon className="inline size-3 mr-1" />
												{getDisplayName(decoy)}
											</span>
										) : null;
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Action-specific UI */}
			{renderActionSpecificUI()}

			{/* Action buttons */}
			<div className="flex gap-3 pt-4">
				<button
					onClick={handleConfirm}
					onTouchEnd={(e) => {
						// Prevent any potential event bubbling issues on mobile
						e.stopPropagation();
					}}
					className="flex-1 cursor-pointer rounded bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 active:bg-green-800"
				>
					Confirm {actionDef.label}
				</button>
				<button
					onClick={cancelActionConfirmation}
					onTouchEnd={(e) => {
						// Prevent any potential event bubbling issues on mobile
						e.stopPropagation();
					}}
					className="flex-1 cursor-pointer rounded bg-slate-600 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-700 active:bg-slate-800"
				>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default ActionDetailWindow;
