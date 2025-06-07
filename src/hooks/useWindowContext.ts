import { createContext, useContext } from "react";
import { WindowInfo } from "../game/WindowInfo";

export type MinimizedWindowInfo = WindowInfo & {
	position: { x: number; y: number };
};

interface WindowContextType {
	openWindows: WindowInfo[];
	minimizedWindows: MinimizedWindowInfo[];

	// Window actions
	handleOpenWindow: (info: WindowInfo) => void;
	handleMinimizeWindow: (windowInfo: MinimizedWindowInfo) => void;
	handleMaximizeWindow: (window: WindowInfo) => void;
	handleCloseWindow: (info: WindowInfo) => void;
	handleCloseAllWindows: () => void;
	
	// Z-index management
	isTopmost: (windowId: string) => boolean;
	bringToFront: (windowId: string) => void;
}

export const WindowContext = createContext<WindowContextType | undefined>(
	undefined,
);

export const useWindowContext = (): WindowContextType => {
	const context = useContext(WindowContext);
	if (context === undefined) {
		throw new Error("useWindowContext must be used within a WindowProvider");
	}
	return context;
};
