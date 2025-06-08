import React, { useCallback, useState } from "react";
import { MinimizedWindowInfo, WindowContext } from "../hooks/useWindowContext";
import { WindowInfo } from "./WindowInfo";
import { useSoundManager } from "../hooks/useSoundManager";

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [openWindows, setOpenWindows] = useState<WindowInfo[]>([]);
	const [minimizedWindows, setMinimizedWindows] = useState<
		MinimizedWindowInfo[]
	>([]);

	// Open a window - brings it to the front if already open, otherwise adds it
	const handleOpenWindow = useCallback((info: WindowInfo) => {
		setOpenWindows((currentWindows) => {
			// Check if the window is already open
			const existingWindowIndex = currentWindows.findIndex(
				(window) => window.id === info.id,
			);

			// If window exists, remove it from its current position
			if (existingWindowIndex !== -1) {
				const updatedWindows = [...currentWindows];
				updatedWindows.splice(existingWindowIndex, 1);
				// Add it to the end (highest z-index)
				return [...updatedWindows, info];
			}

			// If it doesn't exist, add it to the end
			return [...currentWindows, info];
		});

		// Remove from minimized windows if it was there
		setMinimizedWindows((current) =>
			current.filter((window) => window.id !== info.id),
		);
	}, []);

	// Minimize a window - remove from open windows and add to minimized
	const handleMinimizeWindow = useCallback(
		(windowInfo: MinimizedWindowInfo) => {
			// Remove from open windows
			setOpenWindows((current) =>
				current.filter((window) => window.id !== windowInfo.id),
			);

			// Add to minimized windows if not already there
			setMinimizedWindows((current) => {
				// Check if already minimized
				const alreadyMinimized = current.some(
					(window) => window.id === windowInfo.id,
				);

				if (alreadyMinimized) {
					return current;
				}
				// Add to minimized windows
				return [...current, windowInfo];
			});
		},
		[],
	);

	// Maximize a window - remove from minimized and add to open at the top
	const handleMaximizeWindow = useCallback((window: WindowInfo) => {
		// Remove from minimized windows
		setMinimizedWindows((current) => current.filter((w) => w.id !== window.id));

		// Add to open windows at the top (highest z-index)
		setOpenWindows((current) => {
			// Remove if already in open windows
			const filtered = current.filter((w) => w.id !== window.id);
			// Add to the end (top z-index)
			return [...filtered, window];
		});
	}, []);

	const { playSound } = useSoundManager();
	// Close a window - remove from both open and minimized windows
	const handleCloseWindow = useCallback(
		(info: WindowInfo) => {
			if (info.type == "sector") {
				playSound("sectorClose");
			} else {
				playSound("itemClose");
			}

			// Remove from open windows
			setOpenWindows((current) =>
				current.filter((window) => window.id !== info.id),
			);

			// Remove from minimized windows
			setMinimizedWindows((current) =>
				current.filter((window) => window.id !== info.id),
			);
		},
		[playSound],
	);

	// Close all windows - remove from both open and minimized windows
	const handleCloseAllWindows = useCallback(() => {
		playSound("sectorClose");
		setOpenWindows([]);
		setMinimizedWindows([]);
	}, [playSound]);

	// Simple z-index management - last window in array is topmost
	const isTopmost = useCallback(
		(windowId: string) => {
			if (openWindows.length === 0) return false;
			return openWindows[openWindows.length - 1].id === windowId;
		},
		[openWindows],
	);

	// Move window to front by moving it to end of array
	const bringToFront = useCallback((windowId: string) => {
		setOpenWindows((current) => {
			const windowIndex = current.findIndex((w) => w.id === windowId);
			if (windowIndex === -1) return current; // Window not found

			const window = current[windowIndex];
			const filtered = current.filter((w) => w.id !== windowId);
			return [...filtered, window];
		});
	}, []);

	const value = {
		openWindows,
		minimizedWindows,

		handleOpenWindow,
		handleMinimizeWindow,
		handleMaximizeWindow,
		handleCloseWindow,
		handleCloseAllWindows,

		isTopmost,
		bringToFront,
	};

	return (
		<WindowContext.Provider value={value}>{children}</WindowContext.Provider>
	);
};
