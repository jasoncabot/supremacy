import { useEffect } from "react";
import { useWindowContext } from "../hooks/useWindowContext";
import { Command, useCommand } from "./CommandContextDef";
import { WindowInfo } from "./WindowInfo";

const ACTION_DETAIL_ID = "action-detail";

const getWindowTitle = ({ actionDef, sources, target }: Command): string => {
	if (actionDef.type === "mission") {
		const agentNames = sources
			.filter((item) => item.type === "personnel")
			.map((a) => a.name || `Agent ${a.id}`)
			.join(", ");
		const decoyNames = sources
			.filter((item) => item.type === "troop" || item.type === "squadron")
			.map((d) => d.name || `Decoy ${d.id}`)
			.join(", ");
		return `${actionDef.label} - Agents: ${agentNames} | Decoys: ${decoyNames}${
			target ? ` -> ${target.type}` : ""
		}`;
	}
	if (actionDef.type === "move") {
		const estimatedTime = sources.length * 2; // Simple calculation
		return `${actionDef.label} - ${sources.length} unit(s) moving to ${target ? target.type : "selected target"} (Estimated time: ${estimatedTime} hours)`;
	}
	return `${actionDef.label} - ${sources.length} unit(s) performing action${
		target ? ` on ${target.type}` : ""
	}`;
};

// Glue between the command flow and the window system: when a command enters the
// confirming phase, open the action-detail window; close it on leave. This is the
// only place that touches windows for the command flow, so neither SelectionContext
// nor CommandContext needs to import the window system.
export const ActionConfirmationController: React.FC = () => {
	const { phase, command } = useCommand();
	const { handleOpenWindow, handleCloseWindow } = useWindowContext();

	// The command is fixed while in the confirming phase, so this opens the window
	// once on entry and closes it on leave.
	useEffect(() => {
		if (phase !== "confirming" || !command) return;
		const window: WindowInfo = {
			id: ACTION_DETAIL_ID,
			title: getWindowTitle(command),
			type: "action-detail",
			position: {
				x: globalThis.innerWidth / 2 - 200,
				y: globalThis.innerHeight / 2 - 150,
			},
		};
		handleOpenWindow(window);
		return () =>
			handleCloseWindow({
				id: ACTION_DETAIL_ID,
				title: "",
				type: "action-detail",
				position: { x: 0, y: 0 },
			});
	}, [phase, command, handleOpenWindow, handleCloseWindow]);

	return null;
};
