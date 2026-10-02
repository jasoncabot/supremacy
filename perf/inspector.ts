import { writeFile } from "node:fs/promises";

export interface CallFrame {
	functionName: string;
	url: string;
	lineNumber: number;
}

export interface CpuProfile {
	nodes: { id: number; callFrame: CallFrame }[];
	samples: number[];
	timeDeltas: number[];
}

export interface HeapProfileNode {
	callFrame: CallFrame;
	selfSize: number;
	children: HeapProfileNode[];
}

export interface HeapProfile {
	head: HeapProfileNode;
}

interface Message {
	id?: number;
	method?: string;
	params?: { chunk?: string };
	result?: unknown;
	error?: { message: string };
}

/**
 * A minimal Chrome DevTools Protocol client for the V8 inspector that
 * `wrangler dev --inspector-port` exposes. This is the same endpoint the
 * DevTools opened with `d` in wrangler use, so profiles it captures can be
 * loaded straight into DevTools.
 */
export class Inspector {
	private nextId = 1;
	private waiting = new Map<number, (message: Message) => void>();
	private onChunk?: (chunk: string) => void;

	private constructor(private socket: WebSocket) {
		socket.addEventListener("message", (event) => this.receive(JSON.parse(String(event.data)) as Message));
	}

	static async connect(port: number): Promise<Inspector> {
		// workerd refuses a connection with no Origin header
		const socket = new WebSocket(`ws://127.0.0.1:${port}/ws`, {
			headers: { Origin: "http://localhost" },
		});
		await new Promise<void>((resolve, reject) => {
			socket.addEventListener("open", () => resolve(), { once: true });
			socket.addEventListener("error", () => reject(new Error("couldn't connect to the inspector")), { once: true });
		});
		return new Inspector(socket);
	}

	close() {
		this.socket.close();
	}

	private receive(message: Message) {
		if (message.method === "HeapProfiler.addHeapSnapshotChunk" && message.params?.chunk !== undefined) {
			this.onChunk?.(message.params.chunk);
		}
		// Wrangler's proxy sends its own commands with huge ids; ours are small
		if (message.id === undefined || !this.waiting.has(message.id)) return;
		this.waiting.get(message.id)?.(message);
		this.waiting.delete(message.id);
	}

	/**
	 * The proxy answers some commands (enable, start, collectGarbage) with an
	 * echo and no `result`, so the first message carrying our id is the answer.
	 */
	private send<T>(method: string, params: object = {}): Promise<T> {
		const id = this.nextId++;
		return new Promise<T>((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error(`${method} timed out`)), 60_000);
			this.waiting.set(id, (message) => {
				clearTimeout(timer);
				if (message.error) reject(new Error(`${method}: ${message.error.message}`));
				else resolve((message.result ?? {}) as T);
			});
			this.socket.send(JSON.stringify({ id, method, params }));
		});
	}

	async heapUsedBytes(): Promise<number> {
		const { usedSize } = await this.send<{ usedSize: number }>("Runtime.getHeapUsage");
		return usedSize;
	}

	/** Forces a collection, so heap figures taken either side compare like with like. */
	async collectGarbage(): Promise<void> {
		// The proxy never answers this one, so don't wait for a reply
		this.socket.send(JSON.stringify({ id: this.nextId++, method: "HeapProfiler.collectGarbage" }));
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	async cpuProfile(work: () => Promise<void>): Promise<CpuProfile> {
		await this.send("Profiler.enable");
		await this.send("Profiler.setSamplingInterval", { interval: 200 });
		await this.send("Profiler.start");
		await work();
		const { profile } = await this.send<{ profile: CpuProfile }>("Profiler.stop");
		return profile;
	}

	/** Allocations made during `work`, including ones already collected by the time it ends. */
	async allocationProfile(work: () => Promise<void>): Promise<HeapProfile> {
		await this.send("HeapProfiler.startSampling", {
			samplingInterval: 1024,
			includeObjectsCollectedByMajorGC: true,
			includeObjectsCollectedByMinorGC: true,
		});
		await work();
		const { profile } = await this.send<{ profile: HeapProfile }>("HeapProfiler.stopSampling");
		return profile;
	}

	/** Writes a `.heapsnapshot`, which DevTools can load and compare against another. */
	async heapSnapshot(path: string): Promise<void> {
		const chunks: string[] = [];
		let lastChunk = Date.now();
		this.onChunk = (chunk) => {
			chunks.push(chunk);
			lastChunk = Date.now();
		};
		void this.send("HeapProfiler.takeHeapSnapshot", { reportProgress: false }).catch(() => undefined);
		// The command's answer can arrive before the chunks, so wait for them to dry up
		while (chunks.length === 0 || Date.now() - lastChunk < 1000) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		this.onChunk = undefined;
		await writeFile(path, chunks.join(""));
	}
}
