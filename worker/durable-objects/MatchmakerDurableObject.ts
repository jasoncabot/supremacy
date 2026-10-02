import { DurableObject } from "cloudflare:workers";
import { CreateGameRequest, CreateGameResponse, Result } from "../api";
import { ok } from "../errors";

export class MatchmakerDurableObject extends DurableObject<Env> {
	async createGame(
		request: CreateGameRequest & { creatorId: string },
	): Promise<Result<CreateGameResponse>> {
		const gameId = "game-" + Math.random().toString(36).slice(2, 10);
		const gamesStub = this.env.GAMES.get(this.env.GAMES.idFromName(gameId));
		return ok(await gamesStub.create(gameId, request));
	}
}
