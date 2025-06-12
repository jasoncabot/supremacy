import React from "react";
import {
	HandRaisedIcon,
	StarIcon,
	ArrowRightIcon,
	XMarkIcon,
	EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
	useSelectionContext,
	SelectionKind,
} from "../hooks/useSelectionContext";
import { getAvailableActions, type ActionDefinition } from "./types/actions";

interface SelectionOptionsProps {
	className?: string;
}

const SelectionOptions: React.FC<SelectionOptionsProps> = ({
	className = "",
}) => {
	const {
		selectionMode,
		selectedItems,
		selectionState,
		currentAction,
		toggleSelectionKind,
		startTargetSelection,
		cancelTargetSelection,
		showActionConfirmation,
	} = useSelectionContext();

	const getButtonClasses = (mode: SelectionKind) => {
		const baseClasses =
			"flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm transition-colors";
		const activeClasses = "bg-indigo-600 text-white";
		const inactiveClasses =
			"bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white";

		return `${baseClasses} ${selectionMode === mode ? activeClasses : inactiveClasses}`;
	};

	const handleAction = (action: ActionDefinition) => {
		if (action.requiresTarget) {
			// Start target selection mode
			startTargetSelection(action.id);
		} else {
			// Show action confirmation window immediately (no target required)
			showActionConfirmation(action.id, action, selectedItems);
		}
	};

	const contextualActions = React.useMemo<ActionDefinition[]>(
		() => getAvailableActions(selectedItems),
		[selectedItems],
	);

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{/* Target selection mode indicator */}
			{selectionState === "awaiting-target" && (
				<div className="flex items-center gap-2 rounded bg-orange-600/20 px-3 py-1 text-sm text-orange-300">
					<span>Select target for: {currentAction}</span>
					<button
						onClick={cancelTargetSelection}
						className="text-orange-400 hover:text-orange-200"
						title="Cancel target selection"
					>
						<XMarkIcon className="size-4" />
					</button>
				</div>
			)}

			{/* Selection mode buttons - hidden during target selection */}
			{selectionState === "idle" && (
				<>
					<button
						className={getButtonClasses("single")}
						onClick={() => toggleSelectionKind("single")}
						title="Select Single Item"
					>
						<HandRaisedIcon className="size-8 p-1" />
					</button>

					<button
						className={getButtonClasses("multiple")}
						onClick={() => toggleSelectionKind("multiple")}
						title="Select Multiple Items"
					>
						<div className="relative">
							<HandRaisedIcon className="size-8 p-1" />
							<StarIcon className="absolute -top-0.5 -right-0.5 size-3" />
						</div>
					</button>
				</>
			)}

			{/* Target selection button */}
			{selectionState === "awaiting-target" && (
				<button
					className={getButtonClasses("target")}
					title="Target Selection Mode (Active)"
				>
					<div className="relative">
						<HandRaisedIcon className="size-8 p-1" />
						<ArrowRightIcon className="absolute -top-0.5 -right-0.5 size-3" />
					</div>
				</button>
			)}

			{/* Selection count indicator - only show during idle state */}
			{selectionState === "idle" && selectedItems.length > 0 && (
				<div className="flex items-center gap-2 rounded bg-blue-600/20 px-2 py-1 text-sm text-blue-300">
					<span className="hidden sm:inline">
						{selectedItems.length} selected
					</span>
					<span className="sm:hidden">{selectedItems.length}</span>
				</div>
			)}

			{/* Contextual actions menu - only show during idle state */}
			{selectionState === "idle" && contextualActions.length > 0 && (
				<Menu as="div" className="relative">
					<MenuButton className="flex cursor-pointer items-center gap-1 rounded bg-green-600 px-2 py-1 text-sm text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none">
						<EllipsisHorizontalIcon className="size-4" />
						<span className="hidden sm:inline">Actions</span>
					</MenuButton>

					<MenuItems
						anchor="bottom start"
						className="z-50 mt-1 w-48 divide-y divide-slate-700 overflow-y-auto scrollbar-none rounded-md bg-slate-900/95 shadow-lg ring-1 ring-purple-700/30 focus:outline-none"
					>
						{contextualActions.map((action) => (
							<MenuItem key={action.id}>
								<button
									className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-slate-200 hover:bg-green-700/60 hover:text-white data-[focus]:bg-green-700/60 data-[focus]:text-white"
									onClick={() => handleAction(action)}
								>
									<ArrowRightIcon className="size-4 text-slate-400 group-hover:text-white group-data-[focus]:text-white" />
									{action.label}
								</button>
							</MenuItem>
						))}
					</MenuItems>
				</Menu>
			)}
		</div>
	);
};

export default SelectionOptions;
