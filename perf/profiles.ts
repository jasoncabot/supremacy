import type { CallFrame, CpuProfile, HeapProfile, HeapProfileNode } from "./inspector";

export interface Hotspot {
	where: string;
	value: number;
}

export interface CpuSummary {
	/** Everything except idle time: our code, native calls (SQLite, crypto) and GC. */
	busyMs: number;
	gcMs: number;
	top: Hotspot[];
}

export interface AllocationSummary {
	bytes: number;
	top: Hotspot[];
}

const label = ({ functionName, url, lineNumber }: CallFrame) =>
	`${functionName || "(anonymous)"} ${url.split("/").pop() ?? ""}:${lineNumber + 1}`;

const top = (totals: Map<string, number>, scale: number, count = 8): Hotspot[] =>
	[...totals]
		.map(([where, value]) => ({ where, value: Math.round((value / scale) * 100) / 100 }))
		.sort((a, b) => b.value - a.value)
		.slice(0, count);

export function summariseCpu(profile: CpuProfile): CpuSummary {
	const frames = new Map(profile.nodes.map((node) => [node.id, node.callFrame]));
	const selfMicros = new Map<string, number>();
	let busy = 0;
	let gc = 0;
	profile.samples.forEach((nodeId, i) => {
		const frame = frames.get(nodeId);
		const delta = profile.timeDeltas[i] ?? 0;
		if (!frame || frame.functionName === "(idle)") return;
		busy += delta;
		if (frame.functionName === "(garbage collector)") gc += delta;
		const where = label(frame);
		selfMicros.set(where, (selfMicros.get(where) ?? 0) + delta);
	});
	return { busyMs: busy / 1000, gcMs: gc / 1000, top: top(selfMicros, 1000) };
}

export function summariseAllocations(profile: HeapProfile): AllocationSummary {
	const bySite = new Map<string, number>();
	let bytes = 0;
	const walk = (node: HeapProfileNode) => {
		bytes += node.selfSize;
		if (node.selfSize > 0) {
			const where = label(node.callFrame);
			bySite.set(where, (bySite.get(where) ?? 0) + node.selfSize);
		}
		node.children.forEach(walk);
	};
	walk(profile.head);
	return { bytes, top: top(bySite, 1024) };
}
