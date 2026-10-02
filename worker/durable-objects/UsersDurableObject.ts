import { DurableObject } from "cloudflare:workers";
import {
	DEFAULT_GAME_PAGE_SIZE,
	GameLink,
	MAX_GAME_PAGE_SIZE,
	Result,
	SavedGameListResponse,
	SignupRequest,
} from "../api";
import { ok, err } from "../errors";

interface User {
	createdAt: string;
	updatedAt: string;
	username: string;
	email?: string; // Optional email field
}

interface GameRow {
	[column: string]: SqlStorageValue;
	game_id: string;
	name: string;
	faction: "Empire" | "Rebellion";
	last_played: string;
}

/**
 * One instance per user. Holds the profile and a cache of links to that
 * user's games; the Games Durable Objects remain the source of truth and keep
 * these links in sync, so they can always be rebuilt.
 */
export class UsersDurableObject extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		ctx.blockConcurrencyWhile(async () => {
			this.ctx.storage.sql.exec(`
				CREATE TABLE IF NOT EXISTS games (
					game_id TEXT PRIMARY KEY,
					name TEXT NOT NULL,
					faction TEXT NOT NULL,
					last_played TEXT NOT NULL,
					completed INTEGER NOT NULL DEFAULT 0
				);
				CREATE TABLE IF NOT EXISTS deleted_games (game_id TEXT PRIMARY KEY);
				CREATE INDEX IF NOT EXISTS games_recent
					ON games (completed, last_played DESC, game_id DESC);
			`);
		});
	}

	async signup(req: SignupRequest): Promise<Result<void>> {
		if (await this.ctx.storage.get("user")) {
			return err(409, "conflict", "A user with that name already exists");
		}

		// The email index goes first: if the user write then fails, retrying the
		// signup finds the same claim and carries on, rather than being stuck
		// with an account nobody can reset.
		if (req.email) {
			const mapped = await this.env.USERS.getByName(
				`email:${req.email.trim().toLowerCase()}`,
			).storeEmailMapping(req.username);
			if (!mapped.ok) return mapped;
		}

		const now = new Date().toISOString();
		await this.ctx.storage.put<User>("user", {
			createdAt: now,
			updatedAt: now,
			username: req.username,
			email: req.email || "",
		});

		return ok();
	}

	// Called on an email-keyed instance to store the reverse mapping. First
	// claim wins, so a later signup can't hijack an address's reset emails.
	async storeEmailMapping(username: string): Promise<Result<void>> {
		if (!(await this.ctx.storage.get("username"))) {
			await this.ctx.storage.put("username", username);
		}
		return ok();
	}

	// Called on an email-keyed instance to retrieve the username.
	async getUsernameForEmail(): Promise<Result<string>> {
		const username = await this.ctx.storage.get<string>("username");
		return username ? ok(username) : err(404, "not_found", "No account for that email");
	}

	async getUser(): Promise<Result<User>> {
		const user = await this.ctx.storage.get<User>("user");
		return user ? ok(user) : err(404, "not_found", "User not found");
	}

	/**
	 * Adds or refreshes the cached link to a game. Idempotent, and safe against
	 * reordering: a link for a deleted game is ignored, and an older copy never
	 * overwrites a newer one (`lastPlayed` only moves forwards).
	 */
	async linkGame(link: GameLink): Promise<Result<void>> {
		this.ctx.storage.sql.exec(
			`INSERT INTO games (game_id, name, faction, last_played, completed)
			 SELECT ?1, ?2, ?3, ?4, ?5
			 WHERE NOT EXISTS (SELECT 1 FROM deleted_games WHERE game_id = ?1)
			 ON CONFLICT (game_id) DO UPDATE SET
				name = excluded.name,
				faction = excluded.faction,
				last_played = excluded.last_played,
				completed = excluded.completed
			 WHERE excluded.last_played >= games.last_played`,
			link.gameId,
			link.name,
			link.faction,
			link.lastPlayed,
			link.completed ? 1 : 0,
		);
		return ok();
	}

	/**
	 * Removes the cached link to a game. Idempotent. Pass `deleted` when the
	 * game itself is gone for good, so a late link can't bring the entry back.
	 */
	async unlinkGame(gameId: string, deleted = false): Promise<Result<void>> {
		const sql = this.ctx.storage.sql;
		this.ctx.storage.transactionSync(() => {
			sql.exec("DELETE FROM games WHERE game_id = ?", gameId);
			if (deleted) {
				sql.exec("INSERT OR IGNORE INTO deleted_games (game_id) VALUES (?)", gameId);
			}
		});
		return ok();
	}

	/** In-progress games, most recently played first, one page at a time. */
	async listGames(
		limit: number = DEFAULT_GAME_PAGE_SIZE,
		cursor?: string,
	): Promise<Result<SavedGameListResponse>> {
		const pageSize = Math.min(Math.max(Math.trunc(limit) || DEFAULT_GAME_PAGE_SIZE, 1), MAX_GAME_PAGE_SIZE);

		let after: { lastPlayed: string; gameId: string } | undefined;
		if (cursor) {
			const [lastPlayed, gameId] = cursor.split("|");
			if (!lastPlayed || !gameId) {
				return err(400, "bad_request", "Invalid cursor");
			}
			after = { lastPlayed, gameId };
		}

		// A row-value comparison lets SQLite seek straight to the cursor in the
		// index, where an OR of the two columns would walk every earlier row
		const columns = "SELECT game_id, name, faction, last_played FROM games WHERE completed = 0";
		const order = "ORDER BY last_played DESC, game_id DESC LIMIT ?";
		const rows = (
			after
				? this.ctx.storage.sql.exec<GameRow>(
						`${columns} AND (last_played, game_id) < (?, ?) ${order}`,
						after.lastPlayed,
						after.gameId,
						pageSize + 1,
					)
				: this.ctx.storage.sql.exec<GameRow>(`${columns} ${order}`, pageSize + 1)
		).toArray();

		const page = rows.slice(0, pageSize);
		const last = page[page.length - 1];
		return ok({
			games: page.map((row) => ({
				id: row.game_id,
				name: row.name,
				lastPlayed: row.last_played,
				faction: row.faction,
			})),
			nextCursor:
				rows.length > pageSize ? `${last.last_played}|${last.game_id}` : undefined,
		});
	}
}
