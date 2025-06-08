import { Route, Routes } from "react-router";
import {
	ForgotPasswordPage,
	LoginPage,
	ProtectedRoute,
	RegisterPage,
} from "./auth";
import GameRoutes from "./game/GameRoutes";
import { NotFound } from "./NotFound";
import { EntryPoint, Matchmaking, NewGameConfig, RestoreGame } from "./setup";
import { WebLayout } from "./WebLayout";

const App = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<WebLayout>
						<EntryPoint />
					</WebLayout>
				}
			/>
			<Route
				path="/login"
				element={
					<WebLayout>
						<LoginPage />
					</WebLayout>
				}
			/>
			<Route
				path="/register"
				element={
					<WebLayout>
						<RegisterPage />
					</WebLayout>
				}
			/>
			<Route
				path="/forgot-password"
				element={
					<WebLayout>
						<ForgotPasswordPage />
					</WebLayout>
				}
			/>
			<Route
				path="/new-game"
				element={
					<WebLayout>
						<ProtectedRoute>
							<NewGameConfig />
						</ProtectedRoute>
					</WebLayout>
				}
			/>
			<Route
				path="/restore"
				element={
					<WebLayout>
						<ProtectedRoute>
							<RestoreGame />
						</ProtectedRoute>
					</WebLayout>
				}
			/>
			<Route
				path="/matchmaking"
				element={
					<WebLayout>
						<ProtectedRoute>
							<Matchmaking />
						</ProtectedRoute>
					</WebLayout>
				}
			/>
			<Route
				path="/game/:gameId/*"
				element={
					<ProtectedRoute>
						<GameRoutes />
					</ProtectedRoute>
				}
			/>
			<Route
				path="*"
				element={
					<WebLayout>
						<NotFound />
					</WebLayout>
				}
			/>
		</Routes>
	);
};

export default App;
