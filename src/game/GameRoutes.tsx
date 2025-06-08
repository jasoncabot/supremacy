import React from "react";
import { Route, Routes } from "react-router";
import GameScreen from "./GameScreen";
import GameSettings from "./GameSettings";
import { SettingsProvider } from "./SettingsProvider";

const GameRoutes: React.FC = () => {
	return (
		<SettingsProvider>
			<Routes>
				<Route index element={<GameScreen />} />
				<Route path="settings" element={<GameSettings />} />
			</Routes>
		</SettingsProvider>
	);
};

export default GameRoutes;
