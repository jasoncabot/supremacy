import { type ChildProcess, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface LocalWorker {
	url: string;
	inspectorPort: number;
	stop(): Promise<void>;
}

const freePort = () =>
	new Promise<number>((resolve, reject) => {
		const server = createServer();
		server.once("error", reject);
		server.listen(0, "127.0.0.1", () => {
			const { port } = server.address() as { port: number };
			server.close(() => resolve(port));
		});
	});

/**
 * Runs the built worker under `wrangler dev`, with the inspector open and its
 * state in a throwaway directory so the numbers never depend on old data.
 */
export async function startWorker(): Promise<LocalWorker> {
	if (!existsSync("dist/supremacy/wrangler.json")) {
		throw new Error("No build found. Run `npm run perf`, which builds first.");
	}

	const [port, inspectorPort] = [await freePort(), await freePort()];
	const state = await mkdtemp(join(tmpdir(), "supremacy-perf-"));
	const child: ChildProcess = spawn(
		process.execPath,
		[
			"node_modules/wrangler/bin/wrangler.js",
			"dev",
			"--local",
			"--port", String(port),
			"--inspector-port", String(inspectorPort),
			"--persist-to", state,
			"--show-interactive-dev-session=false",
		],
		{ stdio: ["ignore", "pipe", "pipe"], detached: true },
	);

	let output = "";
	const ready = new Promise<void>((resolve, reject) => {
		const onData = (data: Buffer) => {
			output += data.toString();
			if (output.includes("Ready on")) resolve();
		};
		child.stdout?.on("data", onData);
		child.stderr?.on("data", onData);
		child.once("exit", (code) => reject(new Error(`wrangler dev exited (${code}):\n${output}`)));
		setTimeout(() => reject(new Error(`wrangler dev didn't start:\n${output}`)), 60_000).unref();
	});

	const stop = async () => {
		// Wrangler starts workerd as its own child, so stop the whole group
		if (child.pid !== undefined) {
			try {
				process.kill(-child.pid, "SIGTERM");
			} catch {
				// already gone
			}
		}
		await rm(state, { recursive: true, force: true });
	};

	try {
		await ready;
	} catch (error) {
		await stop();
		throw error;
	}
	return { url: `http://127.0.0.1:${port}`, inspectorPort, stop };
}
