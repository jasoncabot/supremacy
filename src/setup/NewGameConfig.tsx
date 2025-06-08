// Game configuration flow for new game
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
	CreateGameRequest,
	CreateGameResponse,
	DifficultyMetadata,
	FactionMetadata,
	GalaxySizeMetadata,
	GameModeMetadata,
	WinConditionMetadata,
} from "../../worker/api";
import { useAuthentication } from "../auth/useAuthentication";
import { useApi } from "../hooks/useApi";

const factions: FactionMetadata[] = ["Empire", "Rebellion"];
const difficulties: DifficultyMetadata[] = ["Easy", "Medium", "Hard"];
const galaxySizes: GalaxySizeMetadata[] = ["Small", "Medium", "Large"];
const winConditions: WinConditionMetadata[] = ["Standard", "Headquarters Only"];
const modes: GameModeMetadata[] = ["Single Player", "Multiplayer"];

const NewGameConfig: React.FC = () => {
	const [faction, setFaction] = useState<FactionMetadata>(factions[0]);
	const [difficulty, setDifficulty] = useState<DifficultyMetadata>(
		difficulties[0],
	);
	const [galaxySize, setGalaxySize] = useState<GalaxySizeMetadata>(
		galaxySizes[0],
	);
	const [winCondition, setWinCondition] = useState<WinConditionMetadata>(
		winConditions[0],
	);
	const [mode, setMode] = useState<GameModeMetadata>(modes[0]);
	const navigate = useNavigate();
	const { isAuthenticated } = useAuthentication();
	const { fetchData, loading, error } = useApi<CreateGameResponse>();

	const handleStart = async () => {
		// Ensure user is authenticated before creating a game
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		const body: CreateGameRequest = {
			faction,
			difficulty,
			galaxySize,
			winCondition,
			mode,
		};

		try {
			// Use the hook's fetchData method with proper typing
			const data = await fetchData("/api/games", {
				method: "POST",
				body: body,
			});

			if (mode === "Multiplayer") {
				navigate("/matchmaking");
			} else {
				navigate(`/game/${data.gameId}`);
			}
		} catch (error) {
			// Error is handled by the useApi hook
			console.error("Failed to create game:", error);
		}
	};

	return (
		<div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-indigo-800/50 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-md transition-all duration-500">
			<h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
				<span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
					SUPREMACY
				</span>
				<div className="mt-2 text-xl font-normal text-indigo-300">
					Create a new game
				</div>
			</h2>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleStart();
				}}
				className="flex flex-col space-y-4 overflow-hidden"
			>
				<div className="flex flex-1 flex-col space-y-4 overflow-scroll">
					{/* Faction */}
					<div className="space-y-2">
						<label
							htmlFor="faction-select"
							className="mb-1 block text-left text-lg font-semibold tracking-wide text-slate-200"
						>
							Faction
						</label>
						<Listbox value={faction} onChange={setFaction}>
							<div className="relative">
								<ListboxButton className="flex min-h-[56px] w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-4 text-xl text-white shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500">
									{faction}
									<ChevronDownIcon className="ml-2 h-6 w-6 text-slate-400 transition-transform duration-200 group-data-[open]:rotate-180" />
								</ListboxButton>
								<ListboxOptions
									anchor="bottom"
									className="animate-fade-in absolute left-0 z-20 mt-2 w-72 rounded-xl bg-slate-900/80 shadow-2xl ring-1 ring-black/10 backdrop-blur-lg focus:outline-none"
								>
									{factions.map((f) => (
										<ListboxOption
											key={f}
											value={f}
											className="group flex cursor-pointer gap-2 px-5 py-4 text-xl text-slate-200 transition-colors duration-200 select-none data-[focus]:bg-purple-700/60 data-[selected]:text-white"
										>
											{f}
										</ListboxOption>
									))}
								</ListboxOptions>
							</div>
						</Listbox>
					</div>

					{/* Difficulty */}
					<div className="space-y-2">
						<label
							htmlFor="difficulty-select"
							className="mb-1 block text-left text-lg font-semibold tracking-wide text-slate-200"
						>
							Difficulty
						</label>
						<Listbox value={difficulty} onChange={setDifficulty}>
							<div className="relative">
								<ListboxButton className="flex min-h-[56px] w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-4 text-xl text-white shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500">
									{difficulty}
									<ChevronDownIcon className="ml-2 h-6 w-6 text-slate-400 transition-transform duration-200 group-data-[open]:rotate-180" />
								</ListboxButton>
								<ListboxOptions
									anchor="bottom"
									className="animate-fade-in absolute left-0 z-20 mt-2 w-72 rounded-xl bg-slate-900/80 shadow-2xl ring-1 ring-black/10 backdrop-blur-lg focus:outline-none"
								>
									{difficulties.map((d) => (
										<ListboxOption
											key={d}
											value={d}
											className="group flex cursor-pointer gap-2 px-5 py-4 text-xl text-slate-200 transition-colors duration-200 select-none data-[focus]:bg-purple-700/60 data-[selected]:text-white"
										>
											{d}
										</ListboxOption>
									))}
								</ListboxOptions>
							</div>
						</Listbox>
					</div>

					{/* Galaxy Size */}
					<div className="space-y-2">
						<label
							htmlFor="galaxy-size-select"
							className="mb-1 block text-left text-lg font-semibold tracking-wide text-slate-200"
						>
							Galaxy Size
						</label>
						<Listbox value={galaxySize} onChange={setGalaxySize}>
							<div className="relative">
								<ListboxButton className="flex min-h-[56px] w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-4 text-xl text-white shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500">
									{galaxySize}
									<ChevronDownIcon className="ml-2 h-6 w-6 text-slate-400 transition-transform duration-200 group-data-[open]:rotate-180" />
								</ListboxButton>
								<ListboxOptions
									anchor="bottom"
									className="animate-fade-in absolute left-0 z-20 mt-2 w-72 rounded-xl bg-slate-900/80 shadow-2xl ring-1 ring-black/10 backdrop-blur-lg focus:outline-none"
								>
									{galaxySizes.map((g) => (
										<ListboxOption
											key={g}
											value={g}
											className="group flex cursor-pointer gap-2 px-5 py-4 text-xl text-slate-200 transition-colors duration-200 select-none data-[focus]:bg-purple-700/60 data-[selected]:text-white"
										>
											{g}
										</ListboxOption>
									))}
								</ListboxOptions>
							</div>
						</Listbox>
					</div>

					{/* Win Condition */}
					<div className="space-y-2">
						<label
							htmlFor="win-condition-select"
							className="mb-1 block text-left text-lg font-semibold tracking-wide text-slate-200"
						>
							Winning Condition
						</label>
						<Listbox value={winCondition} onChange={setWinCondition}>
							<div className="relative">
								<ListboxButton className="flex min-h-[56px] w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-4 text-xl text-white shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500">
									{winCondition}
									<ChevronDownIcon className="ml-2 h-6 w-6 text-slate-400 transition-transform duration-200 group-data-[open]:rotate-180" />
								</ListboxButton>
								<ListboxOptions
									anchor="bottom"
									className="animate-fade-in absolute left-0 z-20 mt-2 w-72 rounded-xl bg-slate-900/80 shadow-2xl ring-1 ring-black/10 backdrop-blur-lg focus:outline-none"
								>
									{winConditions.map((w) => (
										<ListboxOption
											key={w}
											value={w}
											className="group flex cursor-pointer gap-2 px-5 py-4 text-xl text-slate-200 transition-colors duration-200 select-none data-[focus]:bg-purple-700/60 data-[selected]:text-white"
										>
											{w}
										</ListboxOption>
									))}
								</ListboxOptions>
							</div>
						</Listbox>
					</div>

					{/* Mode */}
					<div className="space-y-2">
						<label
							htmlFor="mode-select"
							className="mb-1 block text-left text-lg font-semibold tracking-wide text-slate-200"
						>
							Mode
						</label>
						<Listbox value={mode} onChange={setMode}>
							<div className="relative">
								<ListboxButton className="flex min-h-[56px] w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-4 text-xl text-white shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500">
									{mode}
									<ChevronDownIcon className="ml-2 h-6 w-6 text-slate-400 transition-transform duration-200 group-data-[open]:rotate-180" />
								</ListboxButton>
								<ListboxOptions
									anchor="bottom"
									className="animate-fade-in absolute left-0 z-20 mt-2 w-72 rounded-xl bg-slate-900/80 shadow-2xl ring-1 ring-black/10 backdrop-blur-lg focus:outline-none"
								>
									{modes.map((m) => (
										<ListboxOption
											key={m}
											value={m}
											className="group flex cursor-pointer gap-2 px-5 py-4 text-xl text-slate-200 transition-colors duration-200 select-none data-[focus]:bg-purple-700/60 data-[selected]:text-white"
										>
											{m}
										</ListboxOption>
									))}
								</ListboxOptions>
							</div>
						</Listbox>
					</div>
				</div>

				<div className="flex flex-col space-y-4">
					{error && (
						<div className="mb-4 rounded-lg bg-red-500/20 p-3 text-red-200">
							Error: {error.message}
						</div>
					)}
					<button
						type="submit"
						disabled={loading}
						className={`h-14 w-full rounded-xl ${
							loading
								? "cursor-not-allowed bg-gray-600"
								: "cursor-pointer bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:brightness-110"
						} text-xl font-bold shadow-lg backdrop-blur-md transition-all duration-300 focus:ring-2 focus:ring-purple-400 focus:outline-none`}
					>
						{loading
							? "Processing..."
							: mode === "Multiplayer"
								? "Find Match"
								: "Start Game"}
					</button>
					<button
						type="button"
						onClick={() => navigate("/")}
						className="h-14 w-full cursor-pointer rounded-xl bg-slate-700/80 text-xl font-bold shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-slate-600/80 focus:ring-2 focus:ring-slate-400 focus:outline-none"
					>
						Back to Main Menu
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewGameConfig;
