import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import {
	SelectableItem,
	useSelectionContext,
} from "../hooks/useSelectionContext";
import { getAvailableActions, type ActionDefinition } from "./types/actions";

interface UnitContextMenuProps {
	unit: SelectableItem;
	children: React.ReactNode; // The unit element that triggers the menu
}

const UnitContextMenu: React.FC<UnitContextMenuProps> = ({
	unit,
	children,
}) => {
	const { startTargetSelection, showActionConfirmation } =
		useSelectionContext();

	// Get available actions for this specific unit
	const availableActions = React.useMemo<ActionDefinition[]>(
		() => getAvailableActions([unit]),
		[unit],
	);

	const handleAction = (action: ActionDefinition) => {
		if (action.requiresTarget) {
			// Start target selection mode with the action definition and this unit as source
			startTargetSelection(action.id, action, [unit]);
		} else {
			// Show action confirmation window immediately (no target required)
			showActionConfirmation(action.id, action, [unit]);
		}
	};

	// Don't render the menu if there are no actions available
	if (availableActions.length === 0) {
		return <>{children}</>;
	}

	return (
		<Menu as="div" className="relative">
			<MenuButton as="div" className="cursor-pointer">
				{children}
			</MenuButton>

			<MenuItems
				transition
				anchor="bottom start"
				className="z-50 mt-1 flex w-48 origin-top-left flex-col rounded border border-white/5 bg-gray-900 p-1 text-sm text-white shadow-lg transition duration-100 ease-out focus:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0"
			>
				{availableActions.map((action) => (
					<MenuItem key={action.id}>
						<button
							onClick={() => handleAction(action)}
							className="flex w-full cursor-pointer items-center rounded p-2 text-left text-white hover:bg-gray-700 data-active:bg-gray-700 data-focus:bg-gray-700"
						>
							<ArrowRightIcon className="mr-3 size-4 text-slate-400" />
							{action.label}
						</button>
					</MenuItem>
				))}
			</MenuItems>
		</Menu>
	);
};

export default UnitContextMenu;
