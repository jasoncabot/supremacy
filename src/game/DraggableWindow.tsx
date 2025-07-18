import { GlobeAltIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useGame } from "../hooks/useGame";
import { useSelectionContext } from "../hooks/useSelectionContext";
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
	const { sectors } = useGame();
	const { cancelActionConfirmation } = useSelectionContext();

	const {
		handleMinimizeWindow,
		handleCloseWindow,
		handleOpenWindow,
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
		const viewportHeight = window.innerHeight;
		const windowWidth = 400; // Default width of the window

		// Ensure window is not positioned outside the right edge
		const x = Math.min(pos.x, viewportWidth - windowWidth);

		// Ensure window is not positioned outside the left edge
		const finalX = Math.max(x, 0);

		const maxY = Math.max(0, viewportHeight * 0.25 - 48);
		const finalY = Math.min(Math.max(pos.y, 0), maxY);

		return { x: finalX, y: finalY };
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
		// Check if touch target is any button, input, select, or other interactive element
		const targetElement = e.target as HTMLElement;
		if (
			targetElement.closest("button") ||
			targetElement.closest("input") ||
			targetElement.closest("select") ||
			targetElement.closest("textarea") ||
			targetElement.closest('[role="button"]') ||
			targetElement.closest("a[href]")
		) {
			// If any interactive element was touched, don't activate dragging
			return;
		}

		// Check if the touch started on a scrollable element
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
				document.body.classList.add("window-dragging");
			} else {
				document.body.classList.remove("window-dragging");
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
			className={`flex max-w-full flex-col rounded-xl border border-purple-700/40 bg-gradient-to-br from-slate-900 to-gray-900 shadow-2xl ${className}`}
			// Bring window to front when clicking anywhere in the window
			onClick={bringWindowToFront}
		>
			<div className="flex border-b border-purple-700/30">
				{/* Sector overview button - only show for non-sector windows that have a sectorId */}
				{windowInfo.type !== "sector" && windowInfo.sectorId && (
					<button
						onClick={(e) => {
							// Prevent event from bubbling up to the window's onClick handler
							e.stopPropagation();

							// Find the sector name
							const sector = sectors.find((s) => s.id === windowInfo.sectorId);
							const sectorName = sector ? sector.name : "Sector";

							// Calculate position with 25% viewport constraint
							const isMobile = window.innerWidth < 768;
							const maxY = Math.max(0, window.innerHeight * 0.25 - 48);

							// Use handleOpenWindow to open sector overview
							handleOpenWindow({
								id: `sector-${windowInfo.sectorId}`,
								title: sectorName,
								type: "sector",
								sectorId: windowInfo.sectorId,
								position: {
									x: isMobile ? 0 : position.x - 50,
									y: Math.min(position.y + 50, maxY),
								},
							});
						}}
						className="m-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700"
						title={`Open ${sectors.find((s) => s.id === windowInfo.sectorId)?.name}`}
						aria-label="Open Sector Overview"
					>
						<GlobeAltIcon className="h-4 w-4" />
					</button>
				)}

				<div
					className={`flex flex-1 items-center ${dragging ? "cursor-grabbing" : "cursor-grab"} touch-none text-center font-semibold text-white select-none ${windowInfo.type === "sector" ? "text-xl" : "text-xs"}`}
					onMouseDown={onMouseDown}
					onTouchStart={onTouchStart}
				>
					<h2
						className={`flex-1 ${windowInfo.type === "sector" ? "pl-20" : ""}`}
					>
						{windowInfo.title}
					</h2>
				</div>

				<div className="mx-2 my-2 flex items-start space-x-2">
					<button
						onClick={() => handleMinimizeWindow({ ...windowInfo, position })}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700"
						aria-label="Minimize"
					>
						<span className="text-sm">_</span>
					</button>
					<button
						onClick={() => {
							// If this is an action-detail window, call cancelActionConfirmation first
							if (windowInfo.type === "action-detail") {
								cancelActionConfirmation();
							}
							handleCloseWindow(windowInfo);
						}}
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gray-800 text-white hover:bg-gray-700"
						aria-label="Close"
					>
						<XMarkIcon className="h-6 w-6" />
					</button>
				</div>
			</div>

			<div
				className={`flex flex-1 ${
					windowInfo.type === "fleets"
						? "h-[500px] overscroll-contain"
						: "scrollbar-none max-h-[500px] overflow-y-auto overscroll-contain"
				}`}
			>
				{children}
			</div>
		</div>
	);
};

export default DraggableWindow;
