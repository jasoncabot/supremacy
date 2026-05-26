import { createContext, useContext } from "react";
import {
	DefenseResource,
	FleetResource,
	ManufacturingResource,
	MissionResource,
	PlanetView,
	ShipResource,
} from "../../worker/api";

type SelectableItem =
	| DefenseResource
	| ManufacturingResource
	| ShipResource
	| FleetResource
	| MissionResource
	| (PlanetView & { type: "planet"; id: string });

export type SelectableItemWithLocation = SelectableItem & {
	location: {
		planetId?: string;
		fleetId?: string;
		shipId?: string;
	};
};

export type SelectionMode = "none" | "single" | "multiple";

// Pure selection: which items are selected and in what mode. It knows nothing
// about actions or windows — see CommandContext for the command flow.
export interface SelectionContextType {
	selectedItems: SelectableItemWithLocation[];
	selectionMode: SelectionMode;
	toggleSelectionMode: (mode: SelectionMode) => void;
	selectItem: (item: SelectableItemWithLocation) => void;
	deselectItem: (itemId: string) => void;
	clearSelection: () => void;
	isSelected: (itemId: string) => boolean;
}

export const SelectionContext = createContext<SelectionContextType | undefined>(
	undefined,
);

export const useSelection = (): SelectionContextType => {
	const context = useContext(SelectionContext);
	if (!context) {
		throw new Error("useSelection must be used within a SelectionProvider");
	}
	return context;
};
