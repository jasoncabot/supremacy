import React, { useState } from "react";
import {
	TrashIcon,
	EyeIcon,
	XMarkIcon,
	Bars3Icon,
	ListBulletIcon,
} from "@heroicons/react/24/outline";
import { useActionQueue } from "./ActionQueueContextDef";
import { QueuedAction } from "./types/actionQueue";

const ActionQueueView: React.FC = () => {
	const { actions, removeAction, clearActions } = useActionQueue();
	const [detailViewAction, setDetailViewAction] = useState<QueuedAction | null>(
		null,
	);
	const [viewMode, setViewMode] = useState<"compact" | "detailed">("detailed");

	const formatActionType = (type: string): string => {
		return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const formatTimestamp = (timestamp: number): string => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString();
	};

	const formatFullTimestamp = (timestamp: number): string => {
		const date = new Date(timestamp);
		return date.toLocaleString();
	};

	const getActionDescription = (action: QueuedAction): string => {
		switch (action.type) {
			case "create_fleet": {
				const data = action.data as { newFleetName?: string };
				return `Create fleet "${data?.newFleetName || "Unnamed Fleet"}" from ship`;
			}
			case "move":
				return `Move to ${getTargetName(action)}`;
			case "scrap":
				return "Scrap unit";
			case "bombard":
				return `Bombard ${getTargetName(action)}`;
			case "assault":
				return `Assault ${getTargetName(action)}`;
			case "mission": {
				const data = action.data as { missionType?: string } | undefined;
				const missionType = data?.missionType ? ` (${data.missionType})` : "";
				return `Execute mission${missionType} at ${getTargetName(action)}`;
			}
			case "build": {
				const data = action.data as { buildType?: string } | undefined;
				const buildType = data?.buildType ? ` ${data.buildType}` : "";
				return `Build${buildType}`;
			}
			case "stop":
				return "Stop current production";
			case "rename": {
				const data = action.data as { newName?: string } | undefined;
				const newName = data?.newName ? ` to "${data.newName}"` : "";
				return `Rename unit${newName}`;
			}
			case "command": {
				const data = action.data as { commandType?: string } | undefined;
				const commandType = data?.commandType ? ` (${data.commandType})` : "";
				return `Issue command${commandType}`;
			}
			case "abort":
				return "Abort mission";
			default:
				return formatActionType(action.type);
		}
	};

	const getDetailedActionDescription = (action: QueuedAction): string => {
		const baseDescription = getActionDescription(action);

		switch (action.type) {
			case "create_fleet": {
				const data = action.data as {
					newFleetName?: string;
					newFleetId?: string;
				};
				return `${baseDescription}\n\nThis will create a new fleet with ID: ${data?.newFleetId || "TBD"}\nThe ship will become the flagship of the new fleet.`;
			}
			case "move":
				return `${baseDescription}\n\nThe unit will travel to the specified destination. Travel time depends on distance and unit speed.`;
			case "scrap":
				return `${baseDescription}\n\nThis action will permanently destroy the unit. Some resources may be recovered from scrapping.`;
			case "bombard":
				return `${baseDescription}\n\nOrbital bombardment will target surface installations and defenses on the planet.`;
			case "assault":
				return `${baseDescription}\n\nGround assault will attempt to capture or destroy enemy installations on the planet surface.`;
			case "mission": {
				const data = action.data as { missionType?: string } | undefined;
				const missionDetails = data?.missionType
					? `\nMission type: ${data.missionType}`
					: "";
				return `${baseDescription}\n\nPersonnel will execute a special mission at the target location.${missionDetails}`;
			}
			case "build": {
				const data = action.data as { buildType?: string } | undefined;
				const buildDetails = data?.buildType
					? `\nBuild type: ${data.buildType}`
					: "";
				return `${baseDescription}\n\nConstruction will begin at the specified facility.${buildDetails}`;
			}
			case "stop":
				return `${baseDescription}\n\nThis will halt all current production or construction activities at the facility.`;
			case "rename": {
				const data = action.data as { newName?: string } | undefined;
				const nameDetails = data?.newName
					? `\nNew name: "${data.newName}"`
					: "";
				return `${baseDescription}\n\nThe unit will be given a new identifier.${nameDetails}`;
			}
			case "command": {
				const data = action.data as { commandType?: string } | undefined;
				const commandDetails = data?.commandType
					? `\nCommand: ${data.commandType}`
					: "";
				return `${baseDescription}\n\nPersonnel will receive and execute the specified command.${commandDetails}`;
			}
			case "abort":
				return `${baseDescription}\n\nThe ongoing mission will be terminated and personnel will return to their base location.`;
			default:
				return baseDescription;
		}
	};

	const getTargetName = (action: QueuedAction): string => {
		if (!action.target) return "target";

		switch (action.target.type) {
			case "planet":
				return action.target.data?.metadata?.name || action.target.id;
			case "ship":
			case "fleet":
				return action.target.id;
			case "structure":
				return action.target.data?.name || action.target.id;
			case "unit":
				return action.target.data?.name || action.target.id;
			default: {
				// Exhaustive check for TypeScript
				const exhaustiveCheck: never = action.target;
				return String(exhaustiveCheck);
			}
		}
	};

	const getActionTypeColor = (actionType: string): string => {
		switch (actionType) {
			case "move":
				return "bg-blue-600";
			case "scrap":
				return "bg-red-600";
			case "create_fleet":
				return "bg-green-600";
			case "bombard":
			case "assault":
				return "bg-orange-600";
			case "mission":
				return "bg-purple-600";
			case "build":
				return "bg-cyan-600";
			case "stop":
				return "bg-yellow-600";
			case "rename":
			case "command":
				return "bg-gray-600";
			case "abort":
				return "bg-red-500";
			default:
				return "bg-gray-600";
		}
	};

	const getActionTypeIcon = (actionType: string): string => {
		switch (actionType) {
			case "move":
				return "🚀";
			case "scrap":
				return "🗑️";
			case "create_fleet":
				return "⚓";
			case "bombard":
				return "💥";
			case "assault":
				return "⚔️";
			case "mission":
				return "🎯";
			case "build":
				return "🔨";
			case "stop":
				return "⏹️";
			case "rename":
				return "📝";
			case "command":
				return "📋";
			case "abort":
				return "❌";
			default:
				return "❓";
		}
	};

	const getSourceTypeName = (sourceType: string): string => {
		return sourceType
			.replace(/_/g, " ")
			.replace(/\b\w/g, (l) => l.toUpperCase());
	};

	return (
		<div className="flex h-full flex-col bg-gray-900 text-gray-100">
			{/* Controls Bar */}
			<div className="border-b border-gray-700 bg-gray-800 p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1 rounded-lg bg-gray-700 p-1">
							<button
								onClick={() => setViewMode("compact")}
								className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
									viewMode === "compact"
										? "bg-gray-600 text-white"
										: "text-gray-300 hover:bg-gray-600 hover:text-white"
								}`}
								title="Compact view"
							>
								<Bars3Icon className="h-4 w-4" />
							</button>
							<button
								onClick={() => setViewMode("detailed")}
								className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
									viewMode === "detailed"
										? "bg-gray-600 text-white"
										: "text-gray-300 hover:bg-gray-600 hover:text-white"
								}`}
								title="Detailed view"
							>
								<ListBulletIcon className="h-4 w-4" />
							</button>
						</div>
						<span className="text-sm text-gray-400">
							{actions.length} action{actions.length !== 1 ? "s" : ""}
						</span>
					</div>
					<div>
						{actions.length > 0 && (
							<button
								onClick={clearActions}
								className="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
							>
								Clear All
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto p-4">
				{actions.length === 0 ? (
					<div className="flex h-full items-center justify-center">
						<div className="text-center text-gray-400">
							<p className="mb-2 text-lg">No orders queued</p>
							<p className="text-sm">
								Orders will appear here when you issue commands to your units.
							</p>
						</div>
					</div>
				) : viewMode === "compact" ? (
					// Compact View
					<div className="space-y-2">
						{actions.map((action, index) => (
							<div
								key={action.id}
								className="hover:bg-gray-750 rounded border border-gray-700 bg-gray-800 px-3 py-2 shadow-sm transition-colors"
							>
								<div className="flex items-center justify-between">
									<div className="flex min-w-0 flex-1 items-center gap-3">
										<span className="shrink-0 rounded bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
											{index + 1}
										</span>
										<span
											className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium text-white ${getActionTypeColor(action.type)}`}
										>
											{getActionTypeIcon(action.type)}
										</span>
										<span className="truncate text-sm text-gray-100">
											{getActionDescription(action)}
										</span>
										<span className="shrink-0 text-xs text-gray-400">
											{formatTimestamp(action.timestamp)}
										</span>
									</div>
									<div className="ml-2 flex items-center gap-1">
										<button
											onClick={() => setDetailViewAction(action)}
											className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-blue-400"
											title="View details"
										>
											<EyeIcon className="h-3.5 w-3.5" />
										</button>
										<button
											onClick={() => removeAction(action.id)}
											className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-red-400"
											title="Remove this order"
										>
											<TrashIcon className="h-3.5 w-3.5" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					// Detailed View
					<div className="space-y-3">
						{actions.map((action, index) => (
							<div
								key={action.id}
								className="hover:bg-gray-750 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm transition-colors"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="mb-2 flex items-center gap-2">
											<span className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white">
												{index + 1}
											</span>
											<span
												className={`rounded px-2 py-1 text-xs font-medium text-white ${getActionTypeColor(action.type)}`}
											>
												{getActionTypeIcon(action.type)}{" "}
												{formatActionType(action.type)}
											</span>
											<span className="text-sm text-gray-400">
												{getSourceTypeName(action.sourceType)}
											</span>
											<span className="text-xs text-gray-500">
												{formatTimestamp(action.timestamp)}
											</span>
										</div>
										<h3 className="mb-1 font-medium text-gray-100">
											{getActionDescription(action)}
										</h3>
										<div className="space-y-1">
											<p className="text-sm text-gray-400">
												Source:{" "}
												<span className="font-mono text-gray-300">
													{action.sourceId}
												</span>
											</p>
											{action.target && (
												<p className="text-sm text-gray-400">
													Target:{" "}
													<span className="font-mono text-gray-300">
														{getTargetName(action)}
													</span>
													<span className="ml-2 text-xs text-gray-500">
														({action.target.type})
													</span>
												</p>
											)}
											{action.data && Object.keys(action.data).length > 0 && (
												<p className="text-xs text-gray-500">
													📝 {Object.keys(action.data).length} additional
													parameter
													{Object.keys(action.data).length !== 1 ? "s" : ""}
												</p>
											)}
										</div>
									</div>
									<div className="ml-4 flex items-center gap-2">
										<button
											onClick={() => setDetailViewAction(action)}
											className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-blue-400"
											title="View details"
										>
											<EyeIcon className="h-4 w-4" />
										</button>
										<button
											onClick={() => removeAction(action.id)}
											className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-red-400"
											title="Remove this order"
										>
											<TrashIcon className="h-4 w-4" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Detail View Modal */}
			{detailViewAction && (
				<div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
					<div className="m-4 max-h-[80vh] w-full max-w-2xl overflow-auto rounded-lg bg-gray-800 shadow-xl">
						{/* Modal Header */}
						<div className="flex items-center justify-between border-b border-gray-700 p-6">
							<h3 className="text-xl font-semibold text-gray-100">
								Action Details
							</h3>
							<button
								onClick={() => setDetailViewAction(null)}
								className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
							>
								<XMarkIcon className="h-5 w-5" />
							</button>
						</div>

						{/* Modal Content */}
						<div className="space-y-6 p-6">
							{/* Basic Info */}
							<div>
								<h4 className="mb-3 text-lg font-medium text-gray-100">
									Overview
								</h4>
								<div className="space-y-3 rounded-lg bg-gray-900 p-4">
									<div className="flex items-center gap-3">
										<span className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white">
											Action #
											{actions.findIndex((a) => a.id === detailViewAction.id) +
												1}
										</span>
										<span className="text-lg font-medium text-gray-100">
											{formatActionType(detailViewAction.type)}
										</span>
									</div>
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-gray-400">Source Type:</span>
											<span className="ml-2 text-gray-100">
												{getSourceTypeName(detailViewAction.sourceType)}
											</span>
										</div>
										<div>
											<span className="text-gray-400">Source ID:</span>
											<span className="ml-2 font-mono text-gray-100">
												{detailViewAction.sourceId}
											</span>
										</div>
										<div>
											<span className="text-gray-400">Queued At:</span>
											<span className="ml-2 text-gray-100">
												{formatFullTimestamp(detailViewAction.timestamp)}
											</span>
										</div>
										<div>
											<span className="text-gray-400">Action ID:</span>
											<span className="ml-2 font-mono text-xs text-gray-100">
												{detailViewAction.id}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Action Description */}
							<div>
								<h4 className="mb-3 text-lg font-medium text-gray-100">
									Description
								</h4>
								<div className="rounded-lg bg-gray-900 p-4">
									<p className="whitespace-pre-line text-gray-200">
										{getDetailedActionDescription(detailViewAction)}
									</p>
								</div>
							</div>

							{/* Target Information */}
							{detailViewAction.target && (
								<div>
									<h4 className="mb-3 text-lg font-medium text-gray-100">
										Target Information
									</h4>
									<div className="space-y-3 rounded-lg bg-gray-900 p-4">
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="text-gray-400">Target Type:</span>
												<span className="ml-2 text-gray-100">
													{detailViewAction.target.type}
												</span>
											</div>
											<div>
												<span className="text-gray-400">Target ID:</span>
												<span className="ml-2 font-mono text-gray-100">
													{detailViewAction.target.id}
												</span>
											</div>
										</div>
										{"data" in detailViewAction.target &&
											detailViewAction.target.data && (
												<div>
													<span className="text-sm text-gray-400">
														Target Data:
													</span>
													<pre className="mt-2 overflow-auto rounded bg-gray-800 p-3 text-xs text-gray-300">
														{JSON.stringify(
															detailViewAction.target.data,
															null,
															2,
														)}
													</pre>
												</div>
											)}
									</div>
								</div>
							)}

							{/* Additional Data */}
							{detailViewAction.data &&
								Object.keys(detailViewAction.data).length > 0 && (
									<div>
										<h4 className="mb-3 text-lg font-medium text-gray-100">
											Action Data
										</h4>
										<div className="rounded-lg bg-gray-900 p-4">
											<pre className="overflow-auto text-sm text-gray-300">
												{JSON.stringify(detailViewAction.data, null, 2)}
											</pre>
										</div>
									</div>
								)}
						</div>

						{/* Modal Footer */}
						<div className="flex items-center justify-between border-t border-gray-700 p-6">
							<button
								onClick={() => {
									removeAction(detailViewAction.id);
									setDetailViewAction(null);
								}}
								className="rounded bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
							>
								Remove Action
							</button>
							<button
								onClick={() => setDetailViewAction(null)}
								className="rounded bg-gray-600 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ActionQueueView;
