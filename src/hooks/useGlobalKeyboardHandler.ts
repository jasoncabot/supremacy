import { useEffect } from "react";
import { useWindowContext } from "./useWindowContext";

interface GlobalKeyboardHandlerProps {
	onGlobalSearch?: () => void; // For "/" key to open global search
	onNavigateToFinder?: () => void; // For navigating to finder route
}

export const useGlobalKeyboardHandler = ({
	onGlobalSearch,
	onNavigateToFinder,
}: GlobalKeyboardHandlerProps = {}) => {
	const { openWindows, isTopmost, handleCloseWindow, handleCloseAllWindows } = useWindowContext();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Debug logging to help identify issues
			console.log('Key pressed:', {
				key: event.key,
				code: event.code,
				altKey: event.altKey,
				ctrlKey: event.ctrlKey,
				metaKey: event.metaKey,
				shiftKey: event.shiftKey
			});

			// Global shortcuts that work regardless of window focus
			if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey) {
				// Check if we're not in an input field
				const activeElement = document.activeElement;
				if (activeElement && (
					activeElement.tagName === "INPUT" || 
					activeElement.tagName === "TEXTAREA" || 
					(activeElement as HTMLElement).contentEditable === "true"
				)) {
					return; // Don't trigger if user is typing in an input
				}
				
				event.preventDefault();
				onGlobalSearch?.();
				return;
			}

			// Alt+W (Option+W) to close all windows (global shortcut)
			// Use event.code instead of event.key to avoid Mac's Option+letter character mapping
			if (event.altKey && event.code === "KeyW" && !event.ctrlKey && !event.metaKey) {
				console.log('Alt+W detected - closing all windows');
				event.preventDefault();
				handleCloseAllWindows();
				return;
			}

			// Alternative: Alt+Shift+C to close all windows
			if (event.altKey && event.shiftKey && event.code === "KeyC") {
				console.log('Alt+Shift+C detected - closing all windows');
				event.preventDefault();
				handleCloseAllWindows();
				return;
			}

			// Escape key - close topmost window
			if (event.key === "Escape") {
				// Find the topmost window
				const topmostWindow = openWindows.find(window => isTopmost(window.id));
				if (topmostWindow) {
					event.preventDefault();
					handleCloseWindow(topmostWindow);
				}
				return;
			}
		};

		// Add the global keyboard listener
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [openWindows, isTopmost, handleCloseWindow, handleCloseAllWindows, onGlobalSearch, onNavigateToFinder]);
};
