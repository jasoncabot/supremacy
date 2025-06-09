import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SavedGameResponse } from "../../worker/api";
import { useApi } from "../hooks/useApi";
import { Loading } from "../Loading";

const RestoreGame: React.FC = () => {
	const navigate = useNavigate();
	const [savedGames, setSavedGames] = useState<SavedGameResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
		null,
	);
	const [deleting, setDeleting] = useState<string | null>(null);

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
		navigate(`/game/${gameId}`);
	};

	const handleDeleteGame = async (gameId: string) => {
		setDeleting(gameId);
		try {
			await fetchData(`/api/games/${gameId}`, { method: "DELETE" });
			// Remove the game from local state
			setSavedGames((prev) => prev.filter((game) => game.id !== gameId));
			setShowDeleteConfirm(null);
		} catch (err) {
			console.error("Error deleting game:", err);
			setError(err as Error);
		} finally {
			setDeleting(null);
		}
	};

	const confirmDelete = (gameId: string) => {
		setShowDeleteConfirm(gameId);
	};

	const cancelDelete = () => {
		setShowDeleteConfirm(null);
	};

	return (
		<div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-indigo-800/50 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-md transition-all duration-500">
			<h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
				<span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
					SUPREMACY
				</span>
				<div className="mt-2 text-xl font-normal text-indigo-300">
					Continue your galactic campaign from a previous save.
				</div>
			</h2>
			<div className="flex-1 overflow-scroll scrollbar-none">
				{loading ? (
					<Loading text="Loading saved games..." />
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
							>
								<div
									className="mb-4 flex-grow text-left sm:mb-0"
									onClick={() => handleRestore(game.id)}
								>
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
								<div className="flex gap-3">
									<button
										className="focus:ring-opacity-50 h-12 cursor-pointer rounded-md bg-red-600 px-4 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-red-500 focus:ring-2 focus:ring-red-400 focus:outline-none disabled:opacity-50"
										onClick={(e) => {
											e.stopPropagation();
											confirmDelete(game.id);
										}}
										disabled={deleting === game.id}
									>
										{deleting === game.id ? "..." : "Delete"}
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="mt-8 text-xl text-slate-400">No saved games found.</p>
				)}

				{/* Delete Confirmation Dialog */}
				{showDeleteConfirm && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
						<div className="mx-4 max-w-md rounded-xl border border-red-700/50 bg-slate-900/95 p-6 shadow-2xl">
							<h3 className="mb-4 text-xl font-bold text-red-400">
								Delete Game
							</h3>
							<p className="mb-6 text-slate-300">
								Are you sure you want to delete this saved game? This action
								cannot be undone.
							</p>
							<div className="flex justify-end gap-3">
								<button
									className="cursor-pointer rounded-md bg-slate-700 px-4 py-2 text-white transition-colors hover:bg-slate-600"
									onClick={cancelDelete}
									disabled={deleting === showDeleteConfirm}
								>
									Cancel
								</button>
								<button
									className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-500 disabled:opacity-50"
									onClick={() => handleDeleteGame(showDeleteConfirm)}
									disabled={deleting === showDeleteConfirm}
								>
									{deleting === showDeleteConfirm ? "Deleting..." : "Delete"}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
			<button
				className="focus:ring-opacity-50 mt-12 h-12 cursor-pointer rounded-lg bg-slate-700 px-8 py-3 text-lg text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-slate-600 focus:ring-2 focus:ring-slate-500 focus:outline-none"
				onClick={() => navigate("/")}
			>
				Back to Main Menu
			</button>
		</div>
	);
};

export default RestoreGame;
