import React from "react";
import DraggableWindow from "./DraggableWindow";

interface ViewWindowProps {
	title: string;
	onClose: () => void;
	onActivated: () => void;
	planetId: string;
	viewType: "fleets" | "defence" | "manufacturing" | "missions";
}

const ViewWindow: React.FC<ViewWindowProps> = ({
	title,
	onClose,
	onActivated,
	planetId,
	viewType,
}) => {
	return (
		<DraggableWindow
			title={title}
			onClose={onClose}
			onActivated={onActivated}
			initialPosition={{ x: 150, y: 150 }}
			zIndex={30}
		>
			<div className="pr-2 text-gray-300">
				<p className="py-8 text-center italic">
					TODO: Implement {viewType} data for planet {planetId}
				</p>
			</div>
		</DraggableWindow>
	);
};

export default ViewWindow;
