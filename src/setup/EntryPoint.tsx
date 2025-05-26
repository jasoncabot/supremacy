// Entry point for restoring or starting a new game
import React from "react";
import { useNavigate } from "react-router";

const EntryPoint: React.FC = () => {
	const navigate = useNavigate();
	return (
		<div className="relative w-full max-w-md rounded-2xl border border-indigo-800/50 bg-slate-950/80 p-10 shadow-2xl backdrop-blur-md transition-all duration-500">
			<h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
				<span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
					SUPREMACY
				</span>
				<div className="mt-2 text-xl font-normal text-indigo-300">
					Get started
				</div>
			</h2>
			<div className="mx-auto w-full max-w-xs flex-col gap-4 space-y-6 p-4">
				<button
					className="focus:ring-opacity-60 mb-4 h-14 w-full cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 ease-in-out hover:brightness-110 focus:ring-2 focus:ring-purple-400 focus:outline-none"
					onClick={() => navigate("/new-game")}
				>
					New Game
				</button>
				<button
					className="focus:ring-opacity-60 h-14 w-full cursor-pointer rounded-xl bg-gradient-to-r from-sky-600 to-purple-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 ease-in-out hover:brightness-110 focus:ring-2 focus:ring-sky-400 focus:outline-none"
					onClick={() => navigate("/restore")}
				>
					Restore Game
				</button>
			</div>
		</div>
	);
};

export default EntryPoint;
