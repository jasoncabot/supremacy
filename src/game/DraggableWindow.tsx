import React, { useEffect, useRef, useState, ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface DraggableWindowProps {
	title: string;
	onClose: () => void;
	onActivated: () => void;
	children: ReactNode;
	initialPosition?: { x: number; y: number };
	zIndex?: number;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({
	title,
	onClose,
	onActivated,
	children,
	initialPosition = { x: 100, y: 100 },
	zIndex = 20,
}) => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState(initialPosition);
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
			style={{ left: position.x, top: position.y, zIndex }}
			onMouseDown={onMouseDown}
			className="absolute max-w-[90vw] min-w-[320px] cursor-grab rounded-xl border border-purple-700/40 bg-gradient-to-br from-slate-900 to-gray-900 p-6 shadow-2xl backdrop-blur-md"
		>
			<div className="mb-4 flex items-center justify-between border-b border-purple-700/30 pb-2">
				<h2 className="text-xl font-semibold text-white">{title}</h2>
				<button
					onClick={onClose}
					className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700"
					aria-label="Close"
				>
					<XMarkIcon className="h-6 w-6" />
				</button>
			</div>

			<div className="max-h-[70vh] overflow-y-auto">{children}</div>
		</div>
	);
};

export default DraggableWindow;
