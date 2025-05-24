import { DurableObject } from "cloudflare:workers";
import { CreateGameRequest, CreateGameResponse } from "../api";
import { GamesDurableObject } from "./GamesDurableObject";

export class MatchmakerDurableObject extends DurableObject<Env> {
	state: DurableObjectState;
	env: Env;
	constructor(state: DurableObjectState, env: Env) {
		super(state, env);
		this.state = state;
		this.env = env;
	}

	async createGame(request: CreateGameRequest & { creatorId: string }): Promise<CreateGameResponse> {
		// Generate a new gameId
		const gameId = "game-" + Math.random().toString(36).slice(2, 10);
		// Create the game in the Games durable object
		const gamesId = this.env.GAMES.idFromName(gameId);
		const gamesStub = this.env.GAMES.get(
			gamesId,
		) as unknown as GamesDurableObject;

		return gamesStub.create(gameId, request);
	}
}
