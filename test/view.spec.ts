import { env } from "cloudflare:workers";
import { runInDurableObject } from "cloudflare:test";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CreateGameRequest, FactionMetadata, GameView } from "../worker/api";
import { makeDeterministic } from "./determinism";

const request: CreateGameRequest = {
	faction: "Empire",
	difficulty: "Easy",
	galaxySize: "Large",
	winCondition: "Standard",
	mode: "Single Player",
};


// mulberry32: small, fast and repeatable
const seeded = (seed: number) => () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const stable = (value: unknown): unknown =>
	Array.isArray(value)
		? value.map(stable)
		: value && typeof value === "object"
			? Object.fromEntries(
					Object.entries(value as Record<string, unknown>)
						.sort(([a], [b]) => a.localeCompare(b))
						.map(([k, v]) => [k, stable(v)]),
				)
			: value;

async function fingerprint(view: GameView) {
	// Games are created under different names, which shouldn't matter here
	view = { ...view, id: "game" };
	const bytes = new TextEncoder().encode(JSON.stringify(stable(view)));
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	const planets = Object.values(view.planets);
	return {
		hash: [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join(""),
		turn: view.turn,
		side: view.side,
		faction: view.faction,
		planets: planets.length,
		discovered: planets.filter((p) => p.discovered).length,
		withState: planets.filter((p) => p.state?.loyalty !== undefined).length,
		sectors: Object.keys(view.sectors).length,
		notifications: view.notifications,
	};
}

describe("game view", () => {
	let originals: [typeof crypto.randomUUID, typeof crypto.getRandomValues, typeof Date.now, typeof Math.random];

	beforeAll(() => {
		originals = [crypto.randomUUID, crypto.getRandomValues, Date.now, Math.random];
		makeDeterministic();
	});

	afterAll(() => {
		[crypto.randomUUID, crypto.getRandomValues, Date.now, Math.random] = originals;
	});

	// One game with both factions playing, so both views come from the same truth
	let fixtures = 0;
	async function twoFactionGame() {
		// Same seed every time, so every fixture is the same game. The default
		// mock cycles four values, which gives a galaxy with almost no variety.
		makeDeterministic();
		Math.random = seeded(42);
		const gameId = `game-view-${fixtures++}`;
		const empireUser = env.USERS.newUniqueId().toString();
		const rebelUser = env.USERS.newUniqueId().toString();
		const stub = env.GAMES.getByName(gameId);
		const created = await stub.create(gameId, { ...request, creatorId: empireUser });
		expect(created.ok).toBe(true);
		await runInDurableObject(stub, (_, state) => {
			state.storage.sql.exec(
				"INSERT INTO players (user_id, faction, link_state) VALUES (?, 'Rebellion', 'synced')",
				rebelUser,
			);
		});
		return { stub, empireUser, rebelUser };
	}

	const viewFor = async (stub: ReturnType<typeof env.GAMES.getByName>, user: string) => {
		const result = await stub.view(user);
		if (!result.ok) throw new Error(result.error.message);
		return result.value;
	};

	it("shows the Empire exactly what it did before", async () => {
		const { stub, empireUser } = await twoFactionGame();
		expect(await fingerprint(await viewFor(stub, empireUser))).toMatchSnapshot();
	});

	it("shows the Rebellion exactly what it did before", async () => {
		const { stub, rebelUser } = await twoFactionGame();
		expect(await fingerprint(await viewFor(stub, rebelUser))).toMatchSnapshot();
	});

	it("keeps the two factions' secrets apart", async () => {
		const { stub, empireUser, rebelUser } = await twoFactionGame();
		const empire = await viewFor(stub, empireUser);
		const rebellion = await viewFor(stub, rebelUser);

		const secretsOf = (view: GameView, side: FactionMetadata) =>
			Object.values(view.planets).filter((p) => p.state?.loyalty !== undefined && p.state.owner !== side);
		expect(secretsOf(empire, "Empire")).toEqual([]);
		expect(secretsOf(rebellion, "Rebellion")).toEqual([]);
	});

	const addNotification = (
		stub: ReturnType<typeof env.GAMES.getByName>,
		faction: FactionMetadata,
		id: string,
		message: string,
	) =>
		runInDurableObject(stub, (_, state) => {
			state.storage.sql.exec(
				"INSERT INTO notifications (id, faction, turn, message) VALUES (?, ?, 1, ?)",
				id,
				faction,
				message,
			);
		});

	it("only gives each faction its own notifications", async () => {
		const { stub, empireUser, rebelUser } = await twoFactionGame();
		await addNotification(stub, "Empire", "n1", "for the Empire");
		await addNotification(stub, "Rebellion", "n2", "for the Rebellion");

		const empire = await viewFor(stub, empireUser);
		const rebellion = await viewFor(stub, rebelUser);
		expect(empire.notifications).toEqual([{ id: "n1", message: "for the Empire", read: false }]);
		expect(rebellion.notifications).toEqual([{ id: "n2", message: "for the Rebellion", read: false }]);
	});

	it("only reads the latest notifications however many have built up", async () => {
		const { stub, empireUser } = await twoFactionGame();
		for (let i = 1; i <= 500; i++) await addNotification(stub, "Empire", `n${i}`, `turn ${i}`);

		const { notifications } = await viewFor(stub, empireUser);
		expect(notifications).toHaveLength(100);
		expect(notifications[0].id).toBe("n401");
		expect(notifications[99].id).toBe("n500");
	});
});
