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
	// Enhanced handlers that include sound effects
	const handleGlobalSearch = () => {
		onGlobalSearch?.();
	};

	const handleNavigateToFinder = () => {
		onNavigateToFinder?.();
	};

	useGlobalKeyboardHandler({
		onGlobalSearch: handleGlobalSearch,
		onNavigateToFinder: handleNavigateToFinder,
	});

	// This component doesn't render anything, it just handles keyboard events
	return null;
};
