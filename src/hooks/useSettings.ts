import {
	createContext,
	useContext
} from "react";

export interface GameSettings {
	soundEnabled: boolean;
	musicEnabled: boolean;
	soundVolume: number; // 0-1
	musicVolume: number; // 0-1
}

export interface SettingsContextType {
	settings: GameSettings;
	updateSettings: (newSettings: Partial<GameSettings>) => void;
	resetSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined,
);

export const useSettings = (): SettingsContextType => {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
};
