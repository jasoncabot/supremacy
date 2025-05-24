import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SavedGameResponse } from "../../worker/api";
import { useApi } from "../hooks/useApi";

const RestoreGame: React.FC = () => {
	const navigate = useNavigate();
	const [savedGames, setSavedGames] = useState<SavedGameResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const { fetchData } = useApi<{ games: SavedGameResponse[] }>();

	useEffect(() => {
		fetchData("/api/games")
			.then((response) => {
				setSavedGames(response.games);
				setLoading(false);
			})
			.catch((err) => {
				if (err.name === "AbortError") {
					return;
				}
				console.error("Error fetching saved games:", err);
				setError(err);
				setLoading(false);
			});
	}, [fetchData]);

	const handleRestore = (gameId: string) => {
		// Placeholder for actual restore logic
		navigate(`/game/${gameId}`); // Navigate to the game screen
	};

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden p-4 pt-16 text-white md:pt-24">
			<div className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-10" />
			<div className="relative z-10 w-full max-w-2xl text-center">
				<div className="mb-8 flex flex-col items-center gap-2">
					<h2 className="mb-2 text-5xl font-extrabold tracking-wider text-sky-300 [text-shadow:_0_0_20px_theme(colors.sky.500)]">
						Restore Game
					</h2>
					<p className="mx-auto max-w-md text-lg font-medium tracking-wide text-slate-300">
						Continue your galactic campaign from a previous save.
					</p>
				</div>
				{loading ? (
					<div className="flex h-64 items-center justify-center">
						<svg
							className="animate-spin-slow h-16 w-16 text-sky-400"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
				) : error ? (
					<div className="mt-8 rounded-lg bg-red-900/50 p-6 text-center">
						<p className="text-xl text-red-200">
							Error loading saved games. Please try again later.
						</p>
						<p className="mt-2 text-sm text-red-300">{error.message}</p>
					</div>
				) : savedGames.length > 0 ? (
					<div className="space-y-6">
						{savedGames.map((game) => (
							<div
								key={game.id}
								className="group flex cursor-pointer flex-col items-center justify-between rounded-xl border border-purple-700/30 bg-slate-900/80 p-6 shadow-xl transition-all duration-300 ease-in-out hover:border-purple-400 hover:bg-slate-800/90 sm:flex-row"
								onClick={() => handleRestore(game.id)}
							>
								<div className="mb-4 flex-grow text-left sm:mb-0">
									<h3 className="text-2xl font-bold text-sky-400 transition-colors duration-300 group-hover:text-sky-300">
										{game.name}
									</h3>
									<p className="text-sm text-slate-400">
										Faction: {game.faction}
									</p>
									<p className="text-xs text-slate-500">
										Last Played: {game.lastPlayed}
									</p>
								</div>
								<button className="focus:ring-opacity-50 h-12 rounded-md bg-sky-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-sky-500 focus:ring-2 focus:ring-sky-400 focus:outline-none">
									Load Game
								</button>
							</div>
						))}
					</div>
				) : (
					<p className="mt-8 text-xl text-slate-400">No saved games found.</p>
				)}
				<button
					className="focus:ring-opacity-50 mt-12 h-12 cursor-pointer rounded-lg bg-slate-700 px-8 py-3 text-lg text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-slate-600 focus:ring-2 focus:ring-slate-500 focus:outline-none"
					onClick={() => navigate("/")}
				>
					Back to Main Menu
				</button>
			</div>
		</div>
	);
};

export default RestoreGame;
