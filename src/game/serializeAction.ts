import { GameAction } from "../../worker/api";
import { QueuedAction } from "./types/actionQueue";
import { ActionTarget } from "./types/actions";

// A minimal claim sent over the wire. Per the hidden-information rules, an order
// is a claim the server resolves against truth — so we strip the believed `data`
// snapshot carried in each ActionTarget down to identifying refs.
export interface CommandTargetRef {
	kind: ActionTarget["type"];
	id: string;
	planetId?: string;
	shipId?: string;
}

const toRef = (target: ActionTarget): CommandTargetRef => ({
	kind: target.type,
	id: target.id,
	// Planets have no planet location; every other target is located at one.
	planetId: target.type === "planet" ? undefined : target.planetId,
	shipId: target.type === "unit" ? target.shipId : undefined,
});

export const serializeQueuedAction = (action: QueuedAction): GameAction => ({
	type: action.type,
	payload: {
		sources: action.sources.map(toRef),
		...(action.target ? { target: toRef(action.target) } : {}),
		...(action.data ?? {}),
	},
	targetId: action.target?.id,
});
