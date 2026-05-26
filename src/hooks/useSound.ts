import { createContext, useContext } from "react";
import { SoundType } from "../sounds";

export interface SoundContextType {
	playSound: (type: SoundType) => void;
	playBackgroundMusic: () => void;
	stopBackgroundMusic: () => void;
}

export const SoundContext = createContext<SoundContextType | undefined>(
	undefined,
);

export const useSound = (): SoundContextType => {
	const context = useContext(SoundContext);
	if (context === undefined) {
		throw new Error("useSound must be used within a SoundProvider");
	}
	return context;
};
