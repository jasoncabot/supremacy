import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Api, series } from "./api";
import { type Capture, compare, median, type ScenarioResult, table } from "./compare";
import { Inspector } from "./inspector";
import { summariseAllocations, summariseCpu } from "./profiles";
import { type LocalWorker, startWorker } from "./worker";

const RESULTS = "perf/results";
const BASELINE = "perf/baseline";
const ROUNDS = 3;

// Generous ceilings that hold on any machine; the baseline comparison is the
// sharper check. Raise one only with a reason.
const BUDGET = {
	createCpuMs: 100,
	createAllocKb: 15_000,
	viewCpuMs: 50,
	viewAllocKb: 12_000,
	unchangedCpuMs: 5,
	listCpuMs: 10,
	loginCpuMs: 500,
	retainedHeapKb: 8_000,
};

let worker: LocalWorker;
let inspector: Inspector;
let api: Api;
const capture: Capture = {
	takenAt: new Date().toISOString(),
	node: process.version,
	retainedHeapKb: 0,
	scenarios: {},
};
let heapBeforeKb = 0;

const slug = (name: string) => name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

/**
 * Runs `operation` `iterations` times in a row under the CPU profiler, then
 * again under the allocation profiler (they'd disturb each other if combined),
 * `ROUNDS` times, and keeps the median of each figure. The last round's raw
 * profiles are saved for opening in DevTools.
 */
async function measure(name: string, iterations: number, operation: (i: number) => Promise<void>): Promise<ScenarioResult> {
	const loop = async () => {
		for (let i = 0; i < iterations; i++) await operation(i);
	};
	await loop(); // warm up, so the JIT and caches are settled

	const cpu = [];
	const timings: number[][] = [];
	let cpuProfile;
	for (let round = 0; round < ROUNDS; round++) {
		await api.clearTimings();
		cpuProfile = await inspector.cpuProfile(loop);
		cpu.push(summariseCpu(cpuProfile));
		timings.push(await api.requestTimingsMs());
	}

	const allocations = [];
	let allocationProfile;
	for (let round = 0; round < ROUNDS; round++) {
		allocationProfile = await inspector.allocationProfile(loop);
		allocations.push(summariseAllocations(allocationProfile));
	}

	await mkdir(RESULTS, { recursive: true });
	await writeFile(`${RESULTS}/${slug(name)}.cpuprofile`, JSON.stringify(cpuProfile));
	await writeFile(`${RESULTS}/${slug(name)}.heapprofile`, JSON.stringify(allocationProfile));

	const result: ScenarioResult = {
		iterations,
		metrics: {
			cpuMsPerOp: median(cpu.map((c) => c.busyMs)) / iterations,
			gcMsPerOp: median(cpu.map((c) => c.gcMs)) / iterations,
			allocKbPerOp: median(allocations.map((a) => a.bytes)) / 1024 / iterations,
			serverMsP50: median(timings.map((t) => median(t))),
		},
		topCpu: cpu[cpu.length - 1].top,
		topAlloc: allocations[allocations.length - 1].top,
	};
	capture.scenarios[name] = result;
	console.log(`${name}: ${JSON.stringify(result.metrics)}`);
	return result;
}

describe("performance", () => {
	beforeAll(async () => {
		await rm(RESULTS, { recursive: true, force: true });
		await mkdir(RESULTS, { recursive: true });
		worker = await startWorker();
		api = new Api(worker.url);
		inspector = await Inspector.connect(worker.inspectorPort);
		await inspector.collectGarbage();
		heapBeforeKb = (await inspector.heapUsedBytes()) / 1024;
		await inspector.heapSnapshot(`${RESULTS}/before.heapsnapshot`);
	});

	afterAll(async () => {
		await inspector?.collectGarbage();
		if (inspector) {
			capture.retainedHeapKb = (await inspector.heapUsedBytes()) / 1024 - heapBeforeKb;
			await inspector.heapSnapshot(`${RESULTS}/after.heapsnapshot`);
			inspector.close();
		}
		await writeFile(`${RESULTS}/capture.json`, JSON.stringify(capture, null, "\t"));
		await worker?.stop();
	});

	it("creates a Large game", async () => {
		const { token } = await api.signUp();
		const result = await measure("create game (Large)", 5, async () => {
			await api.createGame(token);
		});
		expect(result.metrics.cpuMsPerOp).toBeLessThan(BUDGET.createCpuMs);
		expect(result.metrics.allocKbPerOp).toBeLessThan(BUDGET.createAllocKb);
	});

	let plainView: ScenarioResult;

	it("views a Large game", async () => {
		const { token } = await api.signUp();
		const gameId = await api.createGame(token);
		plainView = await measure("view game (Large)", 20, async () => {
			await api.viewGame(token, gameId);
		});
		expect(plainView.metrics.cpuMsPerOp).toBeLessThan(BUDGET.viewCpuMs);
		expect(plainView.metrics.allocKbPerOp).toBeLessThan(BUDGET.viewAllocKb);
	});

	it("answers an unchanged view without building it", async () => {
		const { token } = await api.signUp();
		const gameId = await api.createGame(token);
		const { etag } = await api.viewGameConditionally(token, gameId);
		expect(etag).toBeTruthy();

		const result = await measure("view game (unchanged)", 40, async () => {
			const { status } = await api.viewGameConditionally(token, gameId, etag ?? undefined);
			expect(status).toBe(304);
		});
		// Authenticating and checking the version is all that should be left
		expect(result.metrics.allocKbPerOp).toBeLessThan(plainView.metrics.allocKbPerOp * 0.1);
		expect(result.metrics.cpuMsPerOp).toBeLessThan(BUDGET.unchangedCpuMs);
	});

	it("views a game with 5,000 notifications as cheaply as one with none", async () => {
		const { token } = await api.signUp();
		const gameId = await api.createGame(token);
		await api.sql(
			"GamesDurableObject",
			gameId,
			`${series(5000)} INSERT INTO notifications (id, faction, turn, message)
			 SELECT 'n' || i, 'Empire', i / 10, 'Fleet movement reported at turn ' || i FROM n`,
		);

		const view = (await api.viewGame(token, gameId)) as { notifications: { id: string }[] };
		expect(view.notifications).toHaveLength(100);
		expect(view.notifications.at(-1)?.id).toBe("n5000");

		const result = await measure("view game (5,000 notifications)", 20, async () => {
			await api.viewGame(token, gameId);
		});
		// A view only ever reads the latest 100, so history must cost almost nothing
		expect(result.metrics.allocKbPerOp).toBeLessThan(plainView.metrics.allocKbPerOp * 1.25);
	});

	it("lists a page of a long saved-game list", async () => {
		const { username, token } = await api.signUp();
		await api.sql(
			"UsersDurableObject",
			`user:${username}`,
			`${series(500)} INSERT INTO games (game_id, name, faction, last_played, completed)
			 SELECT 'game-' || i, 'Game ' || i, 'Empire', '2026-01-01T00:00:' || printf('%02d', i % 60) || '.' || printf('%03d', i), 0 FROM n`,
		);

		const result = await measure("list games (500 saved)", 40, async () => {
			await api.listGames(token);
		});
		expect(result.metrics.cpuMsPerOp).toBeLessThan(BUDGET.listCpuMs);
	});

	it("lists a deep page of a long saved-game list", async () => {
		const { username, token } = await api.signUp();
		await api.sql(
			"UsersDurableObject",
			`user:${username}`,
			`${series(500)} INSERT INTO games (game_id, name, faction, last_played, completed)
			 SELECT 'game-' || i, 'Game ' || i, 'Empire', '2026-01-01T00:00:' || printf('%02d', i % 60) || '.' || printf('%03d', i), 0 FROM n`,
		);
		let cursor: string | undefined;
		for (let page = 0; page < 8; page++) cursor = (await api.listGames(token, 50, cursor)).nextCursor;

		await measure("list games (page 9 of 500)", 40, async () => {
			await api.listGames(token, 50, cursor);
		});
	});

	it("logs in", async () => {
		const { username } = await api.signUp();
		// Password hashing is deliberately expensive (and capped by the runtime), so
		// this guards against it getting cheaper by accident as much as dearer
		const result = await measure("log in", 10, async () => {
			await api.logIn(username);
		});
		expect(result.metrics.cpuMsPerOp).toBeLessThan(BUDGET.loginCpuMs);
	});

	it("doesn't hold on to memory", () => {
		// All of this ran through one isolate, so a leak per request would show here
		expect(capture.retainedHeapKb).toBeLessThan(BUDGET.retainedHeapKb);
	});

	it("hasn't regressed against the baseline", async () => {
		if (process.env.PERF_UPDATE_BASELINE) {
			await rm(BASELINE, { recursive: true, force: true });
			await mkdir(BASELINE, { recursive: true });
			await writeFile(`${BASELINE}/capture.json`, JSON.stringify(capture, null, "\t"));
			for (const name of Object.keys(capture.scenarios)) {
				for (const extension of ["cpuprofile", "heapprofile"]) {
					await copyFile(`${RESULTS}/${slug(name)}.${extension}`, `${BASELINE}/${slug(name)}.${extension}`);
				}
			}
			console.log(`Baseline saved to ${BASELINE}`);
			return;
		}

		let baseline: Capture;
		try {
			baseline = JSON.parse(await readFile(`${BASELINE}/capture.json`, "utf8")) as Capture;
		} catch {
			console.log("No baseline yet, so nothing to compare with. Run `npm run perf:baseline` on a known-good commit.");
			return;
		}

		const rows = compare(baseline, capture);
		const report = `Compared with the baseline from ${baseline.takenAt}\n${table(rows)}\n`;
		await writeFile(`${RESULTS}/comparison.txt`, report);
		console.log(`\n${report}`);
		expect(rows.filter((row) => row.regression), report).toEqual([]);
	});
});
