import { IRequest, json, Router } from "itty-router";
import {
	ApiError,
	CreateGameRequest,
	CreateGameResponse,
	DEFAULT_GAME_PAGE_SIZE,
	DeleteGameResponse,
	Result,
} from "../api";
import { AuthenticatedRequest, withAuthUser } from "../middleware/authUser";
import { unwrap } from "../errors";

/**
 * Runs a call against a game. A 404 means the game is gone, or the caller isn't
 * in it, so any link the caller still has to it is stale: drop it.
 */
async function pruningStaleLink<T>(
	env: Env,
	user: DurableObjectId,
	gameId: string,
	call: Promise<Result<T>>,
): Promise<Result<T>> {
	const result = await call;
	if (!result.ok && result.error.status === 404) {
		unwrap(await env.USERS.get(user).unlinkGame(gameId));
	}
	return result;
}

const gameRouter = Router<IRequest, [Env, ExecutionContext]>({
	base: "/api/games",
})
	.post(
		"/",
		withAuthUser("game:create"),
		async (req: AuthenticatedRequest, env: Env) => {
			const body = (await req.json()) as CreateGameRequest;
			const creatorId = req.user.toString();

			// Each game is its own Durable Object, addressed by its generated id.
			// It links itself into the creator's list.
			const gameId = `game-${crypto.randomUUID()}`;
			unwrap(await env.GAMES.getByName(gameId).create(gameId, { ...body, creatorId }));

			return json({ gameId } satisfies CreateGameResponse);
		},
	)
	.get(
		"/:id",
		withAuthUser("game:view"),
		async (req: AuthenticatedRequest, env: Env) => {
			const gameId = req.params.id;
			const user = req.user;

			const view = unwrap(
				await pruningStaleLink(
					env,
					user,
					gameId,
					env.GAMES.getByName(gameId).view(user.toString()),
				),
			);
			// For demonstration, include user info in the response
			return { ...view, user };
		},
	)
	.get(
		"/",
		withAuthUser("game:list"),
		async (req: AuthenticatedRequest, env: Env) => {
			const limit = Number(req.query.limit ?? DEFAULT_GAME_PAGE_SIZE);
			const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
			if (!Number.isFinite(limit)) {
				throw new ApiError(400, "bad_request", "Invalid limit");
			}

			return json(unwrap(await env.USERS.get(req.user).listGames(limit, cursor)));
		},
	)
	.delete(
		"/:id",
		withAuthUser("game:delete"),
		async (req: AuthenticatedRequest, env: Env) => {
			const gameId = req.params.id;

			// Deleting something already gone is a success
			const result = await pruningStaleLink(
				env,
				req.user,
				gameId,
				env.GAMES.getByName(gameId).delete(req.user.toString()),
			);
			if (!result.ok && result.error.status !== 404) unwrap(result);

			return json({ success: true } satisfies DeleteGameResponse);
		},
	);

export { gameRouter };
