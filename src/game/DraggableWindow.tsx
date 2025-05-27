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

	const handleDragStart = (clientX: number, clientY: number) => {
		if (nodeRef.current) {
			// Get the current computed transform matrix
			const computedStyle = window.getComputedStyle(nodeRef.current);
			const matrix = new DOMMatrix(computedStyle.transform);

			// Use the actual transformed position for accurate offset calculation
			const actualX = matrix.m41; // translateX value from the matrix
			const actualY = matrix.m42; // translateY value from the matrix

			dragOffset.current = {
				x: clientX - actualX,
				y: clientY - actualY,
			};

			setDragging(true);
			onActivated();
		}
	};

	const onMouseDown = (e: React.MouseEvent) => {
		if (
			(e.target as HTMLElement).closest('button[aria-label="Close"]') ||
			(e.target as HTMLElement).closest('button[aria-label="Minimize"]')
		) {
			// If close or minimize buttons were clicked, don't activate dragging
			return;
		}

		handleDragStart(e.clientX, e.clientY);
	};

	const onTouchStart = (e: React.TouchEvent) => {
		if (
			(e.target as HTMLElement).closest('button[aria-label="Close"]') ||
			(e.target as HTMLElement).closest('button[aria-label="Minimize"]')
		) {
			// If close or minimize buttons were touched, don't activate dragging
			return;
		}
		
		// Check if the touch started on a scrollable element
		const targetElement = e.target as HTMLElement;
		const isScrollableElement = (element: HTMLElement): boolean => {
			if (!element) return false;
			
			const computedStyle = window.getComputedStyle(element);
			const overflowY = computedStyle.overflowY;
			const overflowX = computedStyle.overflowX;
			
			// Check if element has scrollable content
			const hasVerticalScroll = element.scrollHeight > element.clientHeight;
			const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
			
			return ((overflowY === 'auto' || overflowY === 'scroll') && hasVerticalScroll) || 
				   ((overflowX === 'auto' || overflowX === 'scroll') && hasHorizontalScroll);
		};
		
		// Check if touch is within a scrollable area
		let currentElement: HTMLElement | null = targetElement;
		while (currentElement && currentElement !== nodeRef.current) {
			if (isScrollableElement(currentElement)) {
				// Don't prevent default and don't start dragging if in a scrollable area
				return;
			}
			currentElement = currentElement.parentElement;
		}

		// Prevent default to avoid scrolling while dragging
		e.preventDefault();

		const touch = e.touches[0];
		handleDragStart(touch.clientX, touch.clientY);
	};

	useEffect(() => {
		// Add Tailwind classes to the body to prevent scrolling when dragging
		const preventBodyScroll = () => {
			if (dragging) {
				document.body.classList.add('overflow-hidden', 'touch-none', 'overscroll-none');
			} else {
				document.body.classList.remove('overflow-hidden', 'touch-none', 'overscroll-none');
			}
		};
		
		preventBodyScroll();
		
		const handleMove = (clientX: number, clientY: number) => {
			if (!dragging) return;

			// Cancel any pending animation frame
			if (dragAnimationRef.current) {
				cancelAnimationFrame(dragAnimationRef.current);
			}

			// Schedule position update in the next animation frame
			dragAnimationRef.current = requestAnimationFrame(() => {
				// Apply position directly to DOM for immediate visual update
				if (nodeRef.current) {
					const newX = clientX - dragOffset.current.x;
					const newY = clientY - dragOffset.current.y;

					// Apply transform directly for maximum performance during drag
					nodeRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;

					// Update React state as well, but without causing re-renders during drag
					setPosition({ x: newX, y: newY });
				}
			});
		};

		const onMouseMove = (e: MouseEvent) => {
			handleMove(e.clientX, e.clientY);
		};

		const onTouchMove = (e: TouchEvent) => {
			if (!dragging) return;
			
			e.preventDefault(); // Prevent scrolling during drag
			const touch = e.touches[0];
			handleMove(touch.clientX, touch.clientY);
		};

		const endDrag = () => {
			setDragging(false);
			// Clean up any pending animation frame
			if (dragAnimationRef.current) {
				cancelAnimationFrame(dragAnimationRef.current);
			}
		};

		const onMouseUp = () => {
			endDrag();
		};

		const onTouchEnd = () => {
			endDrag();
		};

		if (dragging) {
			document.addEventListener("mousemove", onMouseMove, { passive: true });
			document.addEventListener("mouseup", onMouseUp);
			document.addEventListener("touchmove", onTouchMove, { passive: false });
			document.addEventListener("touchend", onTouchEnd);
			document.addEventListener("touchcancel", onTouchEnd);
		}

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
			document.removeEventListener("touchmove", onTouchMove);
			document.removeEventListener("touchend", onTouchEnd);
			document.removeEventListener("touchcancel", onTouchEnd);
			// Clean up any pending animation frame on unmount
			if (dragAnimationRef.current) {
				cancelAnimationFrame(dragAnimationRef.current);
			}
			// Ensure body scrolling is re-enabled when component unmounts
			document.body.classList.remove('overflow-hidden', 'touch-none', 'overscroll-none');
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
			className={`max-w-[90vw] min-w-[320px] rounded-xl border border-purple-700/40 bg-gradient-to-br from-slate-900 to-gray-900 shadow-2xl ${
				dragging ? "cursor-grabbing" : ""
			}`}
		>
			<div className="flex border-b border-purple-700/30">
				<h2 
					className="ml-2 flex-1 py-2 text-xl font-semibold text-white cursor-move"
					onMouseDown={onMouseDown}
					onTouchStart={onTouchStart}
				>
					{title}
				</h2>

				<div className="mr-2 flex items-center space-x-2">
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
