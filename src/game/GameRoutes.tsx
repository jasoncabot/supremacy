import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { Loading } from "../Loading";
import { SettingsProvider } from "./SettingsProvider";

const GameScreen = lazy(() => import("./GameScreen"));
const GameSettings = lazy(() => import("./GameSettings"));

const GameRoutes: React.FC = () => {
	return (
		<SettingsProvider>
			<Suspense fallback={<Loading text="Loading sector map..." />}>
				<Routes>
					<Route index element={<GameScreen />} />
					<Route path="settings" element={<GameSettings />} />
				</Routes>
			</Suspense>
		</SettingsProvider>
	);
};

export default GameRoutes;
