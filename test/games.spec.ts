import { env, exports } from "cloudflare:workers";
import { runDurableObjectAlarm, runInDurableObject } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import type {
	CreateGameRequest,
	GameView,
	SavedGameListResponse,
	TokenPair,
} from "../worker/api";

const newGame: CreateGameRequest = {
	faction: "Empire",
	difficulty: "Easy",
	galaxySize: "Small",
	winCondition: "Standard",
	mode: "Single Player",
};

const call = (path: string, init: RequestInit & { token?: string } = {}) =>
	exports.default.fetch(
		new Request(`http://example.com/api${path}`, {
			...init,
			headers: {
				"Content-Type": "application/json",
				"X-Client-ID": "test-client-id",
				...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
				...(init.headers as Record<string, string> | undefined),
			},
		}),
	);

async function signUp(email?: string): Promise<string> {
	const response = await call("/auth/signup", {
		method: "POST",
		body: JSON.stringify({
			username: `user-${crypto.randomUUID()}`,
			password: "correct horse battery",
			email,
		}),
	});
	expect(response.status).toBe(201);
	return ((await response.json()) as TokenPair).accessToken;
}

async function createGame(token: string, body = newGame): Promise<string> {
	const response = await call("/games", {
		method: "POST",
		token,
		body: JSON.stringify(body),
	});
	expect(response.status).toBe(200);
	return ((await response.json()) as { gameId: string }).gameId;
}

async function listGames(token: string, query = ""): Promise<SavedGameListResponse> {
	const response = await call(`/games${query}`, { token });
	expect(response.status).toBe(200);
	return (await response.json()) as SavedGameListResponse;
}

// deleteAll() drops the tables, so a fully deleted game has none
const expectWiped = (gameId: string) =>
	runInDurableObject(env.GAMES.getByName(gameId), (_, state) => {
		const { n } = state.storage.sql
			.exec("SELECT COUNT(*) AS n FROM sqlite_master WHERE name IN ('game', 'planets', 'factions', 'notifications', 'players')")
			.one() as { n: number };
		expect(n).toBe(0);
	});

const ids = (list: SavedGameListResponse) => list.games.map((game) => game.id);

describe("game lifecycle", () => {
	it("links a new game into the creator's list and lets them view it", async () => {
		const token = await signUp();
		const gameId = await createGame(token);

		expect(ids(await listGames(token))).toEqual([gameId]);

		const view = await call(`/games/${gameId}`, { token });
		expect(view.status).toBe(200);
		expect(((await view.json()) as GameView).side).toBe("Empire");
	});

	it("pages through a long list, most recent first", async () => {
		const token = await signUp();
		const created = [];
		for (let i = 0; i < 5; i++) created.push(await createGame(token));

		const first = await listGames(token, "?limit=2");
		expect(first.games).toHaveLength(2);
		expect(first.nextCursor).toBeDefined();

		const seen = [...ids(first)];
		let cursor = first.nextCursor;
		while (cursor) {
			const page = await listGames(token, `?limit=2&cursor=${encodeURIComponent(cursor)}`);
			seen.push(...ids(page));
			cursor = page.nextCursor;
		}
		expect([...seen].sort()).toEqual([...created].sort());
		expect(new Set(seen).size).toBe(5);
	});

	it("deletes a game everywhere, and deleting again is harmless", async () => {
		const token = await signUp();
		const gameId = await createGame(token);

		expect((await call(`/games/${gameId}`, { method: "DELETE", token })).status).toBe(200);
		await expectWiped(gameId);
		expect(await listGames(token)).toEqual({ games: [] });
		expect((await call(`/games/${gameId}`, { token })).status).toBe(404);
		expect((await call(`/games/${gameId}`, { method: "DELETE", token })).status).toBe(200);
	});

	it("doesn't let someone else see or delete a game", async () => {
		const owner = await signUp();
		const other = await signUp();
		const gameId = await createGame(owner);

		expect((await call(`/games/${gameId}`, { token: other })).status).toBe(404);
		await call(`/games/${gameId}`, { method: "DELETE", token: other });

		expect(ids(await listGames(owner))).toEqual([gameId]);
		expect((await call(`/games/${gameId}`, { token: owner })).status).toBe(200);
	});

	it("drops a stale link when the game it points at is gone", async () => {
		const token = await signUp();
		const gameId = await createGame(token);
		const ghost = await env.USERS.get(
			env.USERS.idFromString(
				await runInDurableObject(env.GAMES.getByName(gameId), (_, state) =>
					(state.storage.sql.exec("SELECT user_id FROM players").one() as { user_id: string }).user_id,
				),
			),
		).linkGame({
			gameId: "game-ghost",
			name: "Ghost",
			faction: "Rebellion",
			lastPlayed: new Date().toISOString(),
			completed: false,
		});
		expect(ghost.ok).toBe(true);
		expect(ids(await listGames(token))).toContain("game-ghost");

		expect((await call("/games/game-ghost", { token })).status).toBe(404);
		expect(ids(await listGames(token))).toEqual([gameId]);
	});

	it("rejects creating the same game twice", async () => {
		const stub = env.GAMES.getByName("game-duplicate");
		const request = { ...newGame, creatorId: env.USERS.newUniqueId().toString() };

		expect((await stub.create("game-duplicate", request)).ok).toBe(true);
		const again = await stub.create("game-duplicate", request);
		expect(again).toMatchObject({ ok: false, error: { status: 409 } });
	});

	it("keeps every row far below the 2 MB SQLite row limit", async () => {
		const stub = env.GAMES.getByName("game-large");
		await stub.create("game-large", {
			...newGame,
			galaxySize: "Large",
			creatorId: env.USERS.newUniqueId().toString(),
		});
		await runInDurableObject(stub, (_, state) => {
			const { bytes } = state.storage.sql
				.exec("SELECT MAX(LENGTH(data)) AS bytes FROM planets")
				.one() as { bytes: number };
			expect(bytes).toBeLessThan(100_000);
		});
	});
});

describe("link recovery", () => {
	it("restores a missing link when the alarm runs", async () => {
		const token = await signUp();
		const gameId = await createGame(token);
		const game = env.GAMES.getByName(gameId);

		// Simulate the link push having been lost
		const [user] = await runInDurableObject(game, (_, state) =>
			state.storage.sql.exec<{ user_id: string }>("SELECT user_id FROM players").toArray(),
		);
		await env.USERS.get(env.USERS.idFromString(user.user_id)).unlinkGame(gameId);
		await runInDurableObject(game, (_, state) => {
			state.storage.sql.exec("UPDATE players SET link_state = 'pending'");
			return state.storage.setAlarm(Date.now() + 60_000);
		});
		expect(await listGames(token)).toEqual({ games: [] });

		expect(await runDurableObjectAlarm(game)).toBe(true);
		expect(ids(await listGames(token))).toEqual([gameId]);
	});

	it("finishes an interrupted delete when the alarm runs", async () => {
		const token = await signUp();
		const gameId = await createGame(token);
		const game = env.GAMES.getByName(gameId);

		// Simulate dying after the delete transaction but before the links went
		await runInDurableObject(game, (_, state) => {
			const sql = state.storage.sql;
			sql.exec("UPDATE game SET status = 'deleting'");
			sql.exec("DELETE FROM planets");
			sql.exec("DELETE FROM factions");
			sql.exec("DELETE FROM notifications");
			sql.exec("UPDATE players SET link_state = 'unlink_pending'");
			return state.storage.setAlarm(Date.now() + 60_000);
		});
		expect(await call(`/games/${gameId}`, { token })).toMatchObject({ status: 404 });

		expect(await runDurableObjectAlarm(game)).toBe(true);
		expect(await listGames(token)).toEqual({ games: [] });
		await expectWiped(gameId);
	});
});

describe("authentication", () => {
	it("rejects a missing, malformed or wrong token", async () => {
		const token = await signUp();
		const [prefix, id] = token.split(":");
		const wrong = `${prefix}:${id}:${"0".repeat(32)}`;

		expect((await call("/games")).status).toBe(401);
		expect((await call("/games", { token: "nonsense" })).status).toBe(401);
		expect((await call("/games", { token: wrong })).status).toBe(401);
		expect((await call("/games", { token })).status).toBe(200);
	});
});

describe("list queries", () => {
	it("seek to the cursor in the index rather than scanning earlier rows", async () => {
		await runInDurableObject(env.USERS.getByName("user:plan-check"), (_, state) => {
			const plan = (sql: string, ...bindings: (string | number)[]) =>
				(state.storage.sql.exec(`EXPLAIN QUERY PLAN ${sql}`, ...bindings).toArray() as { detail: string }[])
					.map((row) => row.detail)
					.join(" | ");

			// Mirrors listGames, so a change there should change this
			const next = plan(
				"SELECT game_id FROM games WHERE completed = 0 AND (last_played, game_id) < (?, ?) ORDER BY last_played DESC, game_id DESC LIMIT ?",
				"2026", "game", 51,
			);
			expect(next).toMatch(/USING (COVERING )?INDEX games_recent \(completed=\? AND \(last_played,game_id\)<\(\?,\?\)\)/);
			expect(next).not.toContain("TEMP B-TREE");
		});
	});
});

describe("unchanged views", () => {
	const get = (gameId: string, token: string, ifNoneMatch?: string) =>
		call(`/games/${gameId}`, {
			token,
			headers: ifNoneMatch ? { "If-None-Match": ifNoneMatch } : undefined,
		});

	const inGame = (gameId: string, work: (sql: SqlStorage) => void) =>
		runInDurableObject(env.GAMES.getByName(gameId), (_, state) => {
			work(state.storage.sql);
		});

	it("says 304 while nothing has changed, and sends nothing", async () => {
		const token = await signUp();
		const gameId = await createGame(token);

		const first = await get(gameId, token);
		const etag = first.headers.get("ETag");
		expect(etag).toBeTruthy();
		expect(first.headers.get("Cache-Control")).toBe("private, no-cache");
		expect(first.headers.get("Vary")).toBe("Authorization");
		await first.arrayBuffer();

		const again = await get(gameId, token, etag as string);
		expect(again.status).toBe(304);
		expect(await again.text()).toBe("");
		expect(again.headers.get("ETag")).toBe(etag);

		// Same answer however the validator is written
		expect((await get(gameId, token, `"other", ${etag}`)).status).toBe(304);
		expect((await get(gameId, token, (etag as string).replace("W/", ""))).status).toBe(304);
		expect((await get(gameId, token, "*")).status).toBe(304);
	});

	it("sends the new view once a notification, a planet or a faction changes", async () => {
		const token = await signUp();
		const gameId = await createGame(token);
		let etag = (await get(gameId, token)).headers.get("ETag") as string;

		const changes: Record<string, (sql: SqlStorage) => void> = {
			notification: (sql) => {
				sql.exec("INSERT INTO notifications (id, faction, turn, message) VALUES ('n1', 'Empire', 1, 'hello')");
			},
			planet: (sql) => {
				sql.exec("UPDATE planets SET data = json_set(data, '$.loyalty', 1) WHERE rowid = 1");
			},
			faction: (sql) => {
				sql.exec("UPDATE factions SET data = json_set(data, '$.resources.mines', 1) WHERE name = 'Empire'");
			},
			turn: (sql) => {
				sql.exec("UPDATE game SET turn = turn + 1");
			},
			deletion: (sql) => {
				sql.exec("DELETE FROM notifications");
			},
		};

		for (const [name, change] of Object.entries(changes)) {
			await inGame(gameId, change);
			const response = await get(gameId, token, etag);
			expect(response.status, name).toBe(200);
			const next = response.headers.get("ETag") as string;
			expect(next, name).not.toBe(etag);
			await response.arrayBuffer();
			etag = next;
		}
	});

	it("never tells someone outside the game that it is unchanged", async () => {
		const owner = await signUp();
		const outsider = await signUp();
		const gameId = await createGame(owner);
		const etag = (await get(gameId, owner)).headers.get("ETag") as string;

		expect((await get(gameId, outsider, etag)).status).toBe(404);
		expect((await get(gameId, outsider, "*")).status).toBe(404);
	});

	it("has a revision trigger for every table that feeds a view", async () => {
		const token = await signUp();
		const gameId = await createGame(token);
		await inGame(gameId, (sql) => {
			const tables = (sql.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%'").toArray() as { name: string }[])
				.map((row) => row.name)
				.sort();
			// A new table needs a decision: add it here, with triggers, or say why it doesn't affect views
			expect(tables).toEqual(["factions", "game", "notifications", "planets", "players"]);

			for (const table of ["planets", "factions", "notifications"]) {
				const { n } = sql
					.exec("SELECT COUNT(*) AS n FROM sqlite_master WHERE type = 'trigger' AND tbl_name = ?", table)
					.one() as { n: number };
				expect(n, table).toBe(3);
			}
		});
	});
});

describe("link consistency", () => {
	const userOf = (gameId: string) =>
		runInDurableObject(env.GAMES.getByName(gameId), (_, state) =>
			(state.storage.sql.exec("SELECT user_id FROM players").one() as { user_id: string }).user_id,
		).then((id) => env.USERS.get(env.USERS.idFromString(id)));

	it("ignores a late link for a game that was deleted", async () => {
		const token = await signUp();
		const gameId = await createGame(token);
		const users = await userOf(gameId);
		const link = { gameId, name: "New Game", faction: "Empire" as const, lastPlayed: new Date().toISOString(), completed: false };

		await call(`/games/${gameId}`, { method: "DELETE", token });
		await users.linkGame(link);

		expect(await listGames(token)).toEqual({ games: [] });
	});

	it("never lets an older copy of a link overwrite a newer one", async () => {
		const token = await signUp();
		const gameId = await createGame(token);
		const users = await userOf(gameId);
		const link = { gameId, name: "Newer", faction: "Empire" as const, lastPlayed: "2999-01-01T00:00:00.000Z", completed: false };

		await users.linkGame(link);
		await users.linkGame({ ...link, name: "Older", lastPlayed: "2000-01-01T00:00:00.000Z" });

		expect((await listGames(token)).games[0]).toMatchObject({ name: "Newer" });
	});

	it("repairs a missing link when its player opens the game", async () => {
		const token = await signUp();
		const gameId = await createGame(token);
		const game = env.GAMES.getByName(gameId);
		await (await userOf(gameId)).unlinkGame(gameId);
		await runInDurableObject(game, (_, state) => {
			state.storage.sql.exec("UPDATE players SET link_state = 'pending'");
		});

		expect((await call(`/games/${gameId}`, { token })).status).toBe(200);
		expect(ids(await listGames(token))).toEqual([gameId]);
	});

	it("keeps retrying instead of giving up when a sync fails", async () => {
		const token = await signUp();
		const gameId = await createGame(token);
		const game = env.GAMES.getByName(gameId);
		await runInDurableObject(game, (_, state) => {
			// A user id that can't be resolved makes every attempt fail
			state.storage.sql.exec("UPDATE players SET user_id = 'not-an-id', link_state = 'pending'");
			return state.storage.setAlarm(Date.now() + 60_000);
		});

		expect(await runDurableObjectAlarm(game)).toBe(true);
		await runInDurableObject(game, async (_, state) => {
			expect(await state.storage.getAlarm()).not.toBeNull();
		});
	});
});

describe("email mapping", () => {
	it("keeps the first account that claims an address", async () => {
		const email = `${crypto.randomUUID()}@example.com`;
		const signup = (prefix: string, address: string) =>
			call("/auth/signup", {
				method: "POST",
				body: JSON.stringify({
					username: `${prefix}-${crypto.randomUUID()}`,
					password: "correct horse battery",
					email: address,
				}),
			});

		expect((await signup("first", email)).status).toBe(201);
		expect((await signup("second", email.toUpperCase())).status).toBe(201);

		const mapped = await env.USERS.getByName(`email:${email}`).getUsernameForEmail();
		expect(mapped.ok && mapped.value.startsWith("first-")).toBe(true);
	});
});
