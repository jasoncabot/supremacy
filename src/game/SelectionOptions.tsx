import React from "react";
import {
	HandRaisedIcon,
	StarIcon,
	ArrowRightIcon,
	XMarkIcon,
	EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
	useSelectionContext,
	SelectionKind,
} from "../hooks/useSelectionContext";

interface SelectionOptionsProps {
	className?: string;
}

const SelectionOptions: React.FC<SelectionOptionsProps> = ({
	className = "",
}) => {
	const { selectionMode, selectedItems, toggleSelectionKind, clearSelection } =
		useSelectionContext();

	const getButtonClasses = (mode: SelectionKind) => {
		const baseClasses =
			"flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm transition-colors";
		const activeClasses = "bg-indigo-600 text-white";
		const inactiveClasses =
			"bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white";

		return `${baseClasses} ${selectionMode === mode ? activeClasses : inactiveClasses}`;
	};

	// Get contextual actions based on selected items
	const getContextualActions = () => {
		if (selectedItems.length === 0) return [];

		// Group selected items by type
		const itemsByType = selectedItems.reduce(
			(acc, item) => {
				if (!acc[item.type]) acc[item.type] = [];
				acc[item.type].push(item);
				return acc;
			},
			{} as Record<string, typeof selectedItems>,
		);

		const actions = [];

		// Personnel-specific actions
		if (itemsByType.personnel) {
			const personnelItems = itemsByType.personnel;
			const activePersonnel = personnelItems.filter(
				(item) => item.status === "active",
			);

			if (activePersonnel.length > 0) {
				actions.push(
					{ id: "move-personnel", label: "Move", icon: ArrowRightIcon },
					{ id: "disband-personnel", label: "Disband", icon: XMarkIcon },
				);
			}
		}

		// Troops-specific actions
		if (itemsByType.troops) {
			const troopsItems = itemsByType.troops;
			const activeTroops = troopsItems.filter(
				(item) => item.status === "active",
			);

			if (activeTroops.length > 0) {
				actions.push(
					{ id: "move-troops", label: "Move", icon: ArrowRightIcon },
					{ id: "disband-troops", label: "Disband", icon: XMarkIcon },
				);
			}
		}

		// Squadrons-specific actions
		if (itemsByType.squadrons) {
			const squadronItems = itemsByType.squadrons;
			const activeSquadrons = squadronItems.filter(
				(item) => item.status === "active",
			);

			if (activeSquadrons.length > 0) {
				actions.push(
					{ id: "deploy-squadrons", label: "Deploy", icon: ArrowRightIcon },
					{ id: "disband-squadrons", label: "Disband", icon: XMarkIcon },
				);
			}
		}

		// Shields-specific actions
		if (itemsByType.shields) {
			actions.push({
				id: "configure-shields",
				label: "Configure",
				icon: ArrowRightIcon,
			});
		}

		// Batteries-specific actions
		if (itemsByType.batteries) {
			actions.push({
				id: "configure-batteries",
				label: "Configure",
				icon: ArrowRightIcon,
			});
		}

		return actions;
	};

	const handleAction = (actionId: string) => {
		// Placeholder action handling
		console.log(`Executing action: ${actionId} on items:`, selectedItems);

		// Reset selection after action
		clearSelection();
	};

	const contextualActions = getContextualActions();

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{/* Selection mode buttons */}
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

			{/* Selection count indicator */}
			{selectedItems.length > 0 && (
				<div className="flex items-center gap-2 rounded bg-blue-600/20 px-2 py-1 text-sm text-blue-300">
					<span className="hidden sm:inline">
						{selectedItems.length} selected
					</span>
					<span className="sm:hidden">{selectedItems.length}</span>
				</div>
			)}

			{/* Contextual actions menu */}
			{contextualActions.length > 0 && (
				<Popover className="relative">
					<PopoverButton className="flex cursor-pointer items-center gap-1 rounded bg-green-600 px-2 py-1 text-sm text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none">
						<EllipsisHorizontalIcon className="size-4" />
						<span className="hidden sm:inline">Actions</span>
					</PopoverButton>

					<PopoverPanel
						anchor="bottom start"
						className="z-50 mt-2 w-48 rounded-md border border-slate-600 bg-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none"
					>
						<div className="p-1">
							{contextualActions.map((action) => {
								const IconComponent = action.icon;
								return (
									<button
										key={action.id}
										className="group flex w-full cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
										onClick={() => handleAction(action.id)}
									>
										<IconComponent className="size-4 text-slate-400 transition-colors group-hover:text-white" />
										{action.label}
									</button>
								);
							})}
						</div>
					</PopoverPanel>
				</Popover>
			)}
		</div>
	);
};

export default SelectionOptions;
