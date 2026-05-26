import { useCallback } from "react";
import { useCommand } from "../game/CommandContextDef";
import { createActionTarget } from "../game/types/actions";
import { SelectableItemWithLocation, useSelection } from "./useSelection";

// The single click handler for selectable items. While a command is awaiting a
// target the click supplies that target; otherwise it toggles selection. This is
// the only seam where selection and the command flow meet, keeping SelectionContext
// pure and letting CommandContext intercept clicks only while targeting.
export const useItemClick = () => {
	const { selectionMode, isSelected, selectItem, deselectItem } = useSelection();
	const { phase, command, provideTarget } = useCommand();

	return useCallback(
		(item: SelectableItemWithLocation) => {
			if (phase === "awaiting-target") {
				const target = createActionTarget(item);
				if (target && command?.actionDef.validTargets.includes(target.type)) {
					provideTarget(target);
				}
				return;
			}
			if (selectionMode === "none") return;
			if (isSelected(item.id)) {
				deselectItem(item.id);
			} else {
				selectItem(item);
			}
		},
		[phase, command, provideTarget, selectionMode, isSelected, selectItem, deselectItem],
	);
};
