import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useEffect, useRef, useState } from "react";

export interface DraggableWindowProps {
	title: string;
	onClose: () => void;
	onMinimized: () => void;
	onActivated: () => void;
	children: ReactNode;
	initialPosition?: { x: number; y: number };
	zIndex?: number;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({
	title,
	onClose,
	onMinimized,
	onActivated,
	children,
	initialPosition = { x: 100, y: 100 },
	zIndex = 20,
}) => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState(initialPosition);
	const [dragging, setDragging] = useState(false);
	const dragOffset = useRef({ x: 0, y: 0 });
	const dragAnimationRef = useRef<number | undefined>(undefined);

	const onMouseDown = (e: React.MouseEvent) => {
		if (
			(e.target as HTMLElement).closest('button[aria-label="Close"]') ||
			(e.target as HTMLElement).closest('button[aria-label="Minimize"]')
		) {
			// If close or minimize buttons were clicked, don't activate dragging
			return;
		}

		if (nodeRef.current) {
			// Get the current computed transform matrix
			const computedStyle = window.getComputedStyle(nodeRef.current);
			const matrix = new DOMMatrix(computedStyle.transform);

			// Use the actual transformed position for accurate offset calculation
			const actualX = matrix.m41; // translateX value from the matrix
			const actualY = matrix.m42; // translateY value from the matrix

			dragOffset.current = {
				x: e.clientX - actualX,
				y: e.clientY - actualY,
			};

			setDragging(true);
			onActivated();
		}
	};

	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			if (!dragging) return;

			// Cancel any pending animation frame
			if (dragAnimationRef.current) {
				cancelAnimationFrame(dragAnimationRef.current);
			}

			// Schedule position update in the next animation frame
			dragAnimationRef.current = requestAnimationFrame(() => {
				// Apply position directly to DOM for immediate visual update
				if (nodeRef.current) {
					const newX = e.clientX - dragOffset.current.x;
					const newY = e.clientY - dragOffset.current.y;

					// Apply transform directly for maximum performance during drag
					nodeRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;

					// Update React state as well, but without causing re-renders during drag
					setPosition({ x: newX, y: newY });
				}
			});
		};

		const onMouseUp = () => {
			setDragging(false);
			// Clean up any pending animation frame
			if (dragAnimationRef.current) {
				cancelAnimationFrame(dragAnimationRef.current);
			}
		};

		if (dragging) {
			document.addEventListener("mousemove", onMouseMove, { passive: true });
			document.addEventListener("mouseup", onMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
			// Clean up any pending animation frame on unmount
			if (dragAnimationRef.current) {
				cancelAnimationFrame(dragAnimationRef.current);
			}
		};
	}, [dragging]);

	return (
		<div
			ref={nodeRef}
			style={{
				transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
				zIndex,
				willChange: dragging ? "transform" : "auto",
				position: "absolute",
				left: 0,
				top: 0,
			}}
			onMouseDown={onMouseDown}
			className={`max-w-[90vw] min-w-[320px] rounded-xl border border-purple-700/40 bg-gradient-to-br from-slate-900 to-gray-900 p-6 shadow-2xl ${
				dragging ? "cursor-grabbing" : "cursor-grab"
			}`}
		>
			<div className="mb-4 flex items-center justify-between border-b border-purple-700/30 pb-2">
				<h2 className="flex-1 text-xl font-semibold text-white">{title}</h2>

				<div className="flex items-center space-x-2">
					<button
						onClick={onMinimized}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700"
						aria-label="Minimize"
					>
						<span className="text-sm">_</span>
					</button>
					<button
						onClick={onClose}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700"
						aria-label="Close"
					>
						<XMarkIcon className="h-6 w-6" />
					</button>
				</div>
			</div>

			<div className="max-h-[70vh] overflow-y-auto">{children}</div>
		</div>
	);
};

export default DraggableWindow;
