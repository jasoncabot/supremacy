import { DurableObject } from "cloudflare:workers";
import {
	Result,
	SavedGameResponse,
	FactionMetadata,
	SignupRequest,
} from "../api";
import { ok, err } from "../errors";
import { AuthScope } from "../middleware";

export interface UserGame {
	id: string;
	name: string;
	lastPlayed: string;
	faction: FactionMetadata;
	completed?: boolean;
}

interface User {
	createdAt: string;
	updatedAt: string;
	username: string;
	email?: string; // Optional email field
}

export class UsersDurableObject extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async signup(req: SignupRequest): Promise<Result<void>> {
		// Check if the user already exists
		const existingUser = await this.getUser();
		if (existingUser) {
			return err(409, "conflict", "A user with that name already exists");
		}

		await this.ctx.storage.put<User>("user", {
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			username: req.username,
			email: req.email || "",
		} as User);
		return ok();
	}

	async getUser(): Promise<User | undefined> {
		return this.ctx.storage.get<User>("user");
	}

	async hasScope(scope: AuthScope): Promise<boolean> {
		const availableScopes: AuthScope[] = [
			"game:create",
			"game:view",
			"game:list",
			"game:delete",
		];
		return availableScopes.includes(scope);
	}

	async getUserGames(): Promise<{ games: SavedGameResponse[] }> {
		// Get games associated with this user
		const userGames = (await this.ctx.storage.get<UserGame[]>("games")) || [];

		// Filter out completed games
		const inProgressGames = userGames.filter((game) => !game.completed);

		return {
			games: inProgressGames.map((game) => ({
				id: game.id,
				name: game.name,
				lastPlayed: game.lastPlayed,
				faction: game.faction,
			})),
		};
	}

	async trackGame(gameData: UserGame): Promise<void> {
		// Get current list of games
		const userGames = (await this.ctx.storage.get<UserGame[]>("games")) || [];

		// Check if the game already exists, update it if it does
		const existingGameIndex = userGames.findIndex(
			(game) => game.id === gameData.id,
		);

		if (existingGameIndex >= 0) {
			userGames[existingGameIndex] = {
				...userGames[existingGameIndex],
				...gameData,
				lastPlayed: new Date().toISOString(),
			};
		} else {
			// Add new game
			userGames.push({
				...gameData,
				lastPlayed: new Date().toISOString(),
			});
		}

		// Save updated games list
		await this.ctx.storage.put("games", userGames);
	}

	async deleteGame(gameId: string): Promise<void> {
		// Get current list of games
		const userGames = (await this.ctx.storage.get<UserGame[]>("games")) || [];

		// Filter out the game to delete
		const updatedGames = userGames.filter((game) => game.id !== gameId);

		// Save updated games list
		await this.ctx.storage.put("games", updatedGames);
	}
}
