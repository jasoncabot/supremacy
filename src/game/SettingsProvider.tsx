import { ReactNode, useEffect, useReducer } from "react";
import {
	GameSettings,
	SettingsContext,
	SettingsContextType,
} from "../hooks/useSettings";

const STORAGE_KEY = "supremacy:settings";

const defaultSettings: GameSettings = {
	soundEnabled: true,
	musicEnabled: true,
	soundVolume: 0.7,
	musicVolume: 0.5,
};

type SettingsAction =
	| { type: "UPDATE_SETTINGS"; payload: Partial<GameSettings> }
	| { type: "RESET_SETTINGS" };

// Pure reducer — persistence is a side effect handled in the provider.
function settingsReducer(
	state: GameSettings,
	action: SettingsAction,
): GameSettings {
	switch (action.type) {
		case "UPDATE_SETTINGS":
			return { ...state, ...action.payload };
		case "RESET_SETTINGS":
			return defaultSettings;
		default:
			return state;
	}
}

function initializeSettings(): GameSettings {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
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

	// Persist whenever settings change.
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		} catch (error) {
			console.warn("Failed to save settings to localStorage:", error);
		}
	}, [settings]);

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
