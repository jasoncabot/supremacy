import React from "react";
import { FactionView } from "../../worker/api";

interface StatusBarProps {
	turn: number;
	resources: FactionView["resources"];
}

const displayName: Record<keyof FactionView["resources"], string> = {
	mines: "Raw Materials",
	refineries: "Refined Materials",
	refined: "Maintenance",
};

const StatusBar: React.FC<StatusBarProps> = ({ turn, resources }) => (
	<div className="bg-opacity-70 flex w-full items-center justify-between border-b border-purple-700/40 bg-gradient-to-r from-purple-900/80 to-slate-900/80 px-2 py-1.5 font-mono text-sm tracking-wide text-white shadow-lg backdrop-blur-md sm:px-3 sm:py-2 sm:text-base md:px-6">
		<span className="font-bold text-purple-300 select-none [text-shadow:_0_0_8px_theme(colors.purple.700)]">
			Turn: {turn}
		</span>
		<span className="flex flex-wrap justify-end gap-2 sm:gap-3 md:gap-6">
			{Object.entries(resources).map(([key, value]) => (
				<span
					key={key}
					className="flex items-center gap-1 text-slate-200 select-none"
				>
					<span className="hidden font-semibold text-purple-400 sm:inline">
						{displayName[key as keyof FactionView["resources"]]}:
					</span>
					<span className="font-semibold text-purple-400 sm:hidden">
						{key.charAt(0).toUpperCase()}:
					</span>
					<span className="font-mono text-base sm:text-lg">{value}</span>
				</span>
			))}
		</span>
	</div>
);

export default StatusBar;
