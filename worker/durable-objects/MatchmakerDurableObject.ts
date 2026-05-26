import { DurableObject } from "cloudflare:workers";
import { CreateGameRequest, CreateGameResponse } from "../api";

export class MatchmakerDurableObject extends DurableObject<Env> {
	async createGame(
		request: CreateGameRequest & { creatorId: string },
	): Promise<CreateGameResponse> {
		// Generate a new gameId
		const gameId = "game-" + Math.random().toString(36).slice(2, 10);
		const gamesStub = this.env.GAMES.get(this.env.GAMES.idFromName(gameId));
		return gamesStub.create(gameId, request);
	}
}
