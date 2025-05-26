import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { PlanetView, SectorMetadata } from "../../worker/api";
import { FilterType } from "./Filters";
import PlanetOverview from "./PlanetOverview";

interface SectorDetailWindowProps {
	sector: SectorMetadata;
	planets: PlanetView[];
	onClose: () => void;
	onActivated: () => void;
	filter: FilterType;
}

const SectorDetailWindow: React.FC<SectorDetailWindowProps> = ({
	sector,
	planets,
	onActivated,
	onClose,
}) => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 100, y: 100 });
	const [dragging, setDragging] = useState(false);
	const dragOffset = useRef({ x: 0, y: 0 });

	const onMouseDown = (e: React.MouseEvent) => {
		if ((e.target as HTMLElement).closest('button[aria-label="Close"]')) {
			// If close button was clicked, don't activate the window
			return;
		}

		if (nodeRef.current) {
			setDragging(true);
			dragOffset.current = {
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			};
			onActivated();
		}
	};

	const handleCloseClick = () => {
		onClose();
	};

	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			if (!dragging) return;
			setPosition({
				x: e.clientX - dragOffset.current.x,
				y: e.clientY - dragOffset.current.y,
			});
		};
		const onMouseUp = () => {
			setDragging(false);
		};
		if (dragging) {
			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);
		}
		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};
	}, [dragging]);

	return (
		<div
			ref={nodeRef}
			style={{ left: position.x, top: position.y }}
			onMouseDown={onMouseDown}
			className="absolute z-20 max-w-[90vw] min-w-[320px] cursor-grab rounded-xl border border-purple-700/40 bg-gradient-to-br from-slate-900 to-gray-900 p-8 shadow-2xl backdrop-blur-md"
		>
			<h2 className="mb-4 text-2xl font-bold text-white">{sector.name}</h2>

			<div className="max-h-[70vh] overflow-y-auto pr-2">
				{planets.map((planet) => (
					<PlanetOverview key={planet.metadata.id} planet={planet} />
				))}
			</div>

			<button
				onClick={handleCloseClick}
				className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700"
				aria-label="Close"
			>
				<XMarkIcon className={`h-6 w-6`} />
			</button>
		</div>
	);
};

export default SectorDetailWindow;
