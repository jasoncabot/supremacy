import React from "react";
import { PlanetView } from "../../worker/api";
import { DefenceOverview } from "./DefenceOverview";
import DraggableWindow from "./DraggableWindow";
import { FleetsOverview } from "./FleetsOverview";
import { ManufacturingOverview } from "./ManufacturingOverview";
import { MissionsOverview } from "./MissionsOverview";
import { ViewWindowViewType } from "./types/WindowTypes";

interface ViewWindowProps {
	planet: PlanetView;
	viewType: ViewWindowViewType;
	onClose: () => void;
	onMinimized: () => void;
	onActivated: () => void;
}

const ViewWindow: React.FC<ViewWindowProps> = ({
	planet,
	viewType,
	onClose,
	onMinimized,
	onActivated,
}) => {
	return (
		<DraggableWindow
			title={`${planet.metadata.name}`}
			onClose={onClose}
			onActivated={onActivated}
			onMinimized={onMinimized}
			initialPosition={{ x: 150, y: 150 }}
			zIndex={30}
		>
			{(() => {
				switch (viewType) {
					case "fleets":
						return <FleetsOverview planet={planet} />;
					case "defence":
						return <DefenceOverview planet={planet} />;
					case "manufacturing":
						return <ManufacturingOverview planet={planet} />;
					case "missions":
						return <MissionsOverview planet={planet} />;
					default:
						return "Unknown view type";
				}
			})()}
		</DraggableWindow>
	);
};

export default ViewWindow;
