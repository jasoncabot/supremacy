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
	<div className="bg-opacity-70 fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-purple-700/40 bg-gradient-to-r from-purple-900/80 to-slate-900/80 px-6 py-3 font-mono text-base tracking-wide text-white shadow-lg backdrop-blur-md">
		<span className="font-bold text-purple-300 [text-shadow:_0_0_8px_theme(colors.purple.700)]">
			Turn: {turn}
		</span>
		<span className="flex gap-6">
			{Object.entries(resources).map(([key, value]) => (
				<span key={key} className="flex items-center gap-1 text-slate-200">
					<span className="font-semibold text-purple-400">
						{displayName[key as keyof FactionView["resources"]]}:
					</span>
					<span className="font-mono text-lg">{value}</span>
				</span>
			))}
		</span>
	</div>
);

export default StatusBar;
