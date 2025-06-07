import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useWindowContext } from "../hooks/useWindowContext";
import { useZIndex } from "../hooks/useZIndexContext";
import { WindowInfo } from "./WindowInfo";

export interface DraggableWindowProps {
	windowInfo: WindowInfo;
	children: ReactNode;
	className?: string;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({
	windowInfo,
	children,
	className = "",
}) => {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [windowZIndex, setWindowZIndex] = useState(100);
	const { getNextZIndex } = useZIndex();

	const {
		handleMinimizeWindow,
		handleCloseWindow,
		bringToFront,
	} = useWindowContext();

	// Function to bring window to front - now uses the context method
	const bringWindowToFront = () => {
		// Get the next highest z-index from our context
		const nextZIndex = getNextZIndex();
		setWindowZIndex(nextZIndex);
		// Update the context to move this window to front of array
		bringToFront(windowInfo.id);
	};

	// Function to ensure the window opens within the viewport
	const ensureWithinViewport = (pos: { x: number; y: number }) => {
		const viewportWidth = window.innerWidth;
		const windowWidth = 280; // Minimum width from CSS

		// Ensure window is not positioned outside the right edge
		const x = Math.min(pos.x, viewportWidth - windowWidth);

		// Ensure window is not positioned outside the left edge
		const finalX = Math.max(x, 0);
		return { x: finalX, y: pos.y };
	};

	// Use the position from windowInfo if available, otherwise use initialPosition
	const [position, setPosition] = useState(() => {
		return ensureWithinViewport(windowInfo.position);
	});
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
			// Always bring window to front when starting to drag
			bringWindowToFront();

			// Dispatch custom event for the TouchBlockingOverlay
			window.dispatchEvent(new CustomEvent("window-drag-start"));
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

		// Bring window to front when mouse down on title bar
		bringWindowToFront();
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

			return (
				((overflowY === "auto" || overflowY === "scroll") &&
					hasVerticalScroll) ||
				((overflowX === "auto" || overflowX === "scroll") &&
					hasHorizontalScroll)
			);
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
		e.stopPropagation();

		// Bring window to front when touch on title bar
		bringWindowToFront();

		const touch = e.touches[0];
		handleDragStart(touch.clientX, touch.clientY);
	};

	useEffect(() => {
		// Add Tailwind classes to the body to prevent scrolling when dragging
		const preventBodyScroll = () => {
			if (dragging) {
				// Use the custom CSS class defined in index.css
				document.documentElement.classList.add("overflow-hidden");
				document.body.classList.add("window-dragging");
				// Apply cursor-grabbing globally when dragging
				document.body.style.cursor = "grabbing";
			} else {
				document.documentElement.classList.remove("overflow-hidden");
				document.body.classList.remove("window-dragging");
				// Reset cursor
				document.body.style.cursor = "";
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
			e.stopPropagation(); // Stop event from propagating to parent elements
			const touch = e.touches[0];
			handleMove(touch.clientX, touch.clientY);
		};

		const endDrag = () => {
			setDragging(false);
			// Clean up any pending animation frame
			if (dragAnimationRef.current) {
				cancelAnimationFrame(dragAnimationRef.current);
			}

			// Dispatch custom event for the TouchBlockingOverlay
			window.dispatchEvent(new CustomEvent("window-drag-end"));
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
			document.documentElement.classList.remove("overflow-hidden");
			document.body.classList.remove("window-dragging");
			// Reset cursor on cleanup
			document.body.style.cursor = "";
		};
	}, [dragging]);

	// When component mounts, bring it to front initially
	useEffect(() => {
		bringWindowToFront();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			ref={nodeRef}
			style={{
				transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
				zIndex: windowZIndex,
				willChange: dragging ? "transform" : "auto",
				position: "fixed", // Fixed position relative to viewport
				left: 0,
				top: 0,
				touchAction: dragging ? "none" : "auto", // Explicitly disable touch actions when dragging
			}}
			className={`min-h-[50vh] max-w-full rounded-xl border border-purple-700/40 bg-gradient-to-br from-slate-900 to-gray-900 shadow-2xl ${className}`}
			// Bring window to front when clicking anywhere in the window
			onClick={bringWindowToFront}
		>
			<div className="flex border-b border-purple-700/30">
				<h2
					className={`ml-2 flex-1 ${dragging ? "cursor-grabbing" : "cursor-grab"} touch-none py-2 text-xl font-semibold text-white select-none`}
					onMouseDown={onMouseDown}
					onTouchStart={onTouchStart}
				>
					{windowInfo.title}
				</h2>

				<div className="mx-2 flex items-center space-x-2">
					<button
						onClick={() => handleMinimizeWindow({ ...windowInfo, position })}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700"
						aria-label="Minimize"
					>
						<span className="text-sm">_</span>
					</button>
					<button
						onClick={() => handleCloseWindow(windowInfo)}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700"
						aria-label="Close"
					>
						<XMarkIcon className="h-6 w-6" />
					</button>
				</div>
			</div>

			<div className="max-h-[50vh] flex-1 overflow-y-auto overscroll-contain sm:max-h-[70vh]">
				{children}
			</div>
		</div>
	);
};

export default DraggableWindow;
