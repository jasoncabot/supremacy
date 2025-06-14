import React, { useEffect } from "react";
import { useSoundManager } from "../hooks/useSoundManager";

interface BackgroundMusicProviderProps {
	children: React.ReactNode;
	autoStart?: boolean;
	startDelay?: number;
}

export const BackgroundMusicProvider: React.FC<BackgroundMusicProviderProps> = ({
	children,
	autoStart = false,
	startDelay = 1000,
}) => {
	const { playBackgroundMusic } = useSoundManager();

	useEffect(() => {
		if (!autoStart) return;

		// Small delay to ensure settings are loaded
		const timer = setTimeout(() => {
			playBackgroundMusic();
		}, startDelay);

		return () => clearTimeout(timer);
	}, [playBackgroundMusic, autoStart, startDelay]);

	return <>{children}</>;
};
