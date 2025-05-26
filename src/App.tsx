import { Route, Routes } from "react-router";
import { GameScreen } from "./game";
import { EntryPoint, Matchmaking, NewGameConfig, RestoreGame } from "./setup";
import {
	LoginPage,
	RegisterPage,
	ForgotPasswordPage,
	ProtectedRoute,
} from "./auth";
import { NotFound } from "./NotFound";

const App = () => {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
			<div className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-cover opacity-50"></div>
			<div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950/60 to-purple-950/40"></div>
			<div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"></div>

			<div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center px-4 py-8">
				<Routes>
					<Route path="/" element={<EntryPoint />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route
						path="/new-game"
						element={
							<ProtectedRoute>
								<NewGameConfig />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/restore"
						element={
							<ProtectedRoute>
								<RestoreGame />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/matchmaking"
						element={
							<ProtectedRoute>
								<Matchmaking />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/game/:gameId"
						element={
							<ProtectedRoute>
								<GameScreen />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
		</div>
	);
};

export default App;
