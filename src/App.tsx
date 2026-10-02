import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Loading } from "./Loading";
import { NotFound } from "./NotFound";
import { WebLayout } from "./WebLayout";

const LoginPage = lazy(() => import("./auth/LoginPage"));
const RegisterPage = lazy(() => import("./auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./auth/ResetPasswordPage"));
const EntryPoint = lazy(() => import("./setup/EntryPoint"));
const NewGameConfig = lazy(() => import("./setup/NewGameConfig"));
const RestoreGame = lazy(() => import("./setup/RestoreGame"));
const Matchmaking = lazy(() => import("./setup/Matchmaking"));
const GameRoutes = lazy(() => import("./game/GameRoutes"));

const App = () => {
	const withPageLoader = (element: React.ReactNode) => (
		<Suspense fallback={<Loading text="Loading page..." />}>
			{element}
		</Suspense>
	);

	return (
		<Routes>
			<Route
				path="/"
				element={
					<WebLayout>
						{withPageLoader(<EntryPoint />)}
					</WebLayout>
				}
			/>
			<Route
				path="/login"
				element={
					<WebLayout>
						{withPageLoader(<LoginPage />)}
					</WebLayout>
				}
			/>
			<Route
				path="/register"
				element={
					<WebLayout>
						{withPageLoader(<RegisterPage />)}
					</WebLayout>
				}
			/>
			<Route
				path="/forgot-password"
				element={
					<WebLayout>
						{withPageLoader(<ForgotPasswordPage />)}
					</WebLayout>
				}
			/>
			<Route
				path="/reset-password"
				element={
					<WebLayout>
						{withPageLoader(<ResetPasswordPage />)}
					</WebLayout>
				}
			/>
			<Route
				path="/new-game"
				element={
					<WebLayout>
						<ProtectedRoute>
							{withPageLoader(<NewGameConfig />)}
						</ProtectedRoute>
					</WebLayout>
				}
			/>
			<Route
				path="/restore"
				element={
					<WebLayout>
						<ProtectedRoute>
							{withPageLoader(<RestoreGame />)}
						</ProtectedRoute>
					</WebLayout>
				}
			/>
			<Route
				path="/matchmaking"
				element={
					<WebLayout>
						<ProtectedRoute>
							{withPageLoader(<Matchmaking />)}
						</ProtectedRoute>
					</WebLayout>
				}
			/>
			<Route
				path="/game/:gameId/*"
				element={
					<ProtectedRoute>
						{withPageLoader(<GameRoutes />)}
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
