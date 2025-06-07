import React from "react";
import { useGlobalKeyboardHandler } from "../hooks/useGlobalKeyboardHandler";

interface GlobalKeyboardHandlerProps {
	onGlobalSearch?: () => void;
	onNavigateToFinder?: () => void;
}

export const GlobalKeyboardHandler: React.FC<GlobalKeyboardHandlerProps> = ({
	onGlobalSearch,
	onNavigateToFinder,
}) => {
	useGlobalKeyboardHandler({
		onGlobalSearch,
		onNavigateToFinder,
	});

	// This component doesn't render anything, it just handles keyboard events
	return null;
};
