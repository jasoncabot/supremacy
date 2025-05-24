import { DurableObject } from "cloudflare:workers";
import { ApiError, SavedGameResponse, FactionMetadata } from "../api";
import { AuthScope } from "../middleware";

export interface UserGame {
	id: string;
	name: string;
	lastPlayed: string;
	faction: FactionMetadata;
	completed?: boolean;
}

interface User {
	id: string;
	createdAt: string;
	updatedAt: string;
	username: string;
}

export class UsersDurableObject extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async signup(username: string): Promise<{ error?: ApiError }> {
		// Check if the user already exists
		const existingUser = await this.getUser();
		if (existingUser) {
			return { error: new ApiError(409, "conflict", "user already exists") };
		}

		await this.ctx.storage.put<User>("user", {
			id: crypto.randomUUID().replace(/-/g, ""),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			username: username,
		} as User);
		return {};
	}

	async getUser(): Promise<User | undefined> {
		return this.ctx.storage.get<User>("user");
	}

	async hasScope(scope: AuthScope): Promise<boolean> {
		const availableScopes: AuthScope[] = [
			"game:create",
			"game:view",
			"game:list",
		];
		return availableScopes.includes(scope);
	}

	async getUserGames(): Promise<{ games: SavedGameResponse[] }> {
		// Get the current user
		const user = await this.getUser();
		if (!user) {
			throw new ApiError(404, "Not Found", "User not found");
		}

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
}
