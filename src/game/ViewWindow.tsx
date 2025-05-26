import React from "react";
import { PlanetView } from "../../worker/api";
import DraggableWindow from "./DraggableWindow";

interface ViewWindowProps {
	planet: PlanetView;
	viewType: "fleets" | "defence" | "manufacturing" | "missions";
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
			title={`${viewType.charAt(0).toUpperCase() + viewType.slice(1)} View`}
			onClose={onClose}
			onActivated={onActivated}
			onMinimized={onMinimized}
			initialPosition={{ x: 150, y: 150 }}
			zIndex={30}
		>
			<div className="pr-2 text-gray-300">
				<p className="py-8 text-center italic">
					{(() => {
						switch (viewType) {
							case "fleets":
								return `Fleets information for planet ${planet.metadata.name}`;
							case "defence":
								return `Defence information for planet ${planet.metadata.name}`;
							case "manufacturing":
								return `Manufacturing information for planet ${planet.metadata.name}`;
							case "missions":
								return `Missions information for planet ${planet.metadata.name}`;
							default:
								return "Unknown view type";
						}
					})()}
				</p>
			</div>
		</DraggableWindow>
	);
};

export default ViewWindow;
