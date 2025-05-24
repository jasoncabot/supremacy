import { IRequest, json, Router } from "itty-router";
import {
	CreateGameRequest,
	CreateGameResponse,
	SavedGameResponse,
} from "../api";
import {
	GamesDurableObject,
	MatchmakerDurableObject,
	UsersDurableObject,
} from "../durable-objects";
import { AuthenticatedRequest, withAuthUser } from "../middleware/authUser";
import { UserGame } from "../durable-objects/UsersDurableObject";

const gameRouter = Router<IRequest, [Env, ExecutionContext]>({
	base: "/api/games",
})
	.post(
		"/",
		withAuthUser("game:create"),
		async (req: AuthenticatedRequest, env: Env) => {
			const body = (await req.json()) as CreateGameRequest;
			// Use the authenticated user's ID as the creator
			const creatorId = req.user.toString();

			// Call the Matchmaker durable object to create a new game
			const matchmakerId = env.MATCHMAKER.idFromName("singleton");
			const matchmakerStub = env.MATCHMAKER.get(
				matchmakerId,
			) as unknown as MatchmakerDurableObject;
			const { gameId } = await matchmakerStub.createGame({
				...body,
				creatorId,
			});

			// Get the user's durable object to set their saved games
			const userStub = env.USERS.get(req.user) as unknown as UsersDurableObject;

			// Get the list of saved games
			await userStub.trackGame({
				id: gameId,
				name: "New Game",
				lastPlayed: new Date().toISOString(),
				faction: body.faction,
				completed: false
			} as UserGame);

			return json({ gameId } satisfies CreateGameResponse);
		},
	)
	.get(
		"/:id",
		withAuthUser("game:view"),
		async (req: AuthenticatedRequest, env: Env) => {
			const gameId = req.params.id;
			const user = req.user;
			// Call the Games durable object to get the view for this game
			const gameObjId = env.GAMES.idFromName(gameId);
			const gameStub = env.GAMES.get(
				gameObjId,
			) as unknown as GamesDurableObject;

			// For demonstration, include user info in the response
			const view = await gameStub.view(user.toString());
			return { ...view, user };
		},
	)
	.get(
		"/",
		withAuthUser("game:list"),
		async (req: AuthenticatedRequest, env: Env) => {
			const userId = req.user;

			// Get the user's durable object to retrieve their saved games
			const userStub = env.USERS.get(userId) as unknown as UsersDurableObject;

			// Get the list of saved games
			const { games } = await userStub.getUserGames();

			return json({ games } satisfies { games: SavedGameResponse[] });
		},
	);

export { gameRouter };
