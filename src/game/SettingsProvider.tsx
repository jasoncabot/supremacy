import { ReactNode, useReducer } from "react";
import {
	GameSettings,
	SettingsContext,
	SettingsContextType,
} from "../hooks/useSettings";

const defaultSettings: GameSettings = {
	soundEnabled: true,
	musicEnabled: true,
	soundVolume: 0.7,
	musicVolume: 0.5,
};

type SettingsAction =
	| { type: "UPDATE_SETTINGS"; payload: Partial<GameSettings> }
	| { type: "RESET_SETTINGS" };

function settingsReducer(
	state: GameSettings,
	action: SettingsAction,
): GameSettings {
	switch (action.type) {
		case "UPDATE_SETTINGS": {
			const newSettings = { ...state, ...action.payload };
			// Save to localStorage immediately
			try {
				localStorage.setItem("supremacy:settings", JSON.stringify(newSettings));
			} catch (error) {
				console.warn("Failed to save settings to localStorage:", error);
			}
			return newSettings;
		}
		case "RESET_SETTINGS": {
			try {
				localStorage.setItem(
					"supremacy:settings",
					JSON.stringify(defaultSettings),
				);
			} catch (error) {
				console.warn("Failed to save settings to localStorage:", error);
			}
			return defaultSettings;
		}
		default:
			return state;
	}
}

function initializeSettings(): GameSettings {
	try {
		const stored = localStorage.getItem("supremacy:settings");
		if (stored) {
			const parsedSettings = JSON.parse(stored);
			return { ...defaultSettings, ...parsedSettings };
		}
	} catch (error) {
		console.warn("Failed to load settings from localStorage:", error);
	}

	return defaultSettings;
}

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [settings, dispatch] = useReducer(
		settingsReducer,
		defaultSettings,
		initializeSettings,
	);

	const updateSettings = (newSettings: Partial<GameSettings>) => {
		dispatch({ type: "UPDATE_SETTINGS", payload: newSettings });
	};

	const resetSettings = () => {
		dispatch({ type: "RESET_SETTINGS" });
	};

	const value: SettingsContextType = {
		settings,
		updateSettings,
		resetSettings,
	};

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
};
