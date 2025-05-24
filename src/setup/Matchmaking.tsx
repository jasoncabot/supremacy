// Matchmaking state for multiplayer games
import React from "react";

const Matchmaking: React.FC = () => {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 text-white">
			<div className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-10" />
			<div className="relative z-10 flex flex-col items-center gap-8 rounded-2xl bg-slate-900/70 p-8 text-center shadow-2xl backdrop-blur-md">
				<h2 className="mb-2 text-4xl font-extrabold tracking-wider text-sky-300 [text-shadow:_0_0_20px_theme(colors.sky.500)]">
					Waiting for Opponent...
				</h2>
				<p className="mb-4 max-w-xs text-lg text-slate-300">
					Your galactic battle will begin once another player joins. Stand by
					for hyperspace engagement!
				</p>
				<div className="flex items-center justify-center">
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
			</div>
		</div>
	);
};

export default Matchmaking;
