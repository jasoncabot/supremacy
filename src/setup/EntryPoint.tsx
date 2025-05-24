// Entry point for restoring or starting a new game
import React from "react";
import { useNavigate } from "react-router";

const EntryPoint: React.FC = () => {
	const navigate = useNavigate();
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden p-4 text-white">
			<div className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-10" />
			<div className="relative z-10 flex flex-col items-center gap-8 p-4 text-center">
				<div className="flex flex-col items-center gap-4 p-4">
					<h1 className="mb-2 bg-gradient-to-r from-purple-400 via-sky-400 to-pink-400 bg-clip-text p-4 text-6xl font-extrabold tracking-widest text-transparent drop-shadow-lg">
						SUPREMACY
					</h1>
				</div>
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
		</div>
	);
};

export default EntryPoint;
