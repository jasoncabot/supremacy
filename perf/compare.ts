import type { Hotspot } from "./profiles";

export interface Metrics {
	cpuMsPerOp: number;
	gcMsPerOp: number;
	allocKbPerOp: number;
	serverMsP50: number;
}

export interface ScenarioResult {
	iterations: number;
	metrics: Metrics;
	topCpu: Hotspot[];
	topAlloc: Hotspot[];
}

export interface Capture {
	takenAt: string;
	node: string;
	retainedHeapKb: number;
	scenarios: Record<string, ScenarioResult>;
}

interface Rule {
	/** How much worse than the baseline counts as a regression. */
	tolerance: number;
	/** Changes smaller than this are noise however large the ratio. */
	floor: number;
}

// Allocation counts barely move between runs, so it gets the tightest rule.
// CPU and wall time depend on the machine and what else it is doing.
// Garbage collection time is reported but not judged.
const RULES: Partial<Record<keyof Metrics, Rule>> = {
	allocKbPerOp: { tolerance: 0.15, floor: 8 },
	cpuMsPerOp: { tolerance: 0.35, floor: 1 },
	serverMsP50: { tolerance: 0.5, floor: 3 },
};

export interface Row {
	scenario: string;
	metric: keyof Metrics;
	baseline: number;
	current: number;
	change: number;
	regression: boolean;
}

export function compare(baseline: Capture, current: Capture): Row[] {
	const rows: Row[] = [];
	for (const [scenario, now] of Object.entries(current.scenarios)) {
		const before = baseline.scenarios[scenario];
		if (!before) continue;
		for (const metric of Object.keys(now.metrics) as (keyof Metrics)[]) {
			const base = before.metrics[metric];
			const value = now.metrics[metric];
			const rule = RULES[metric];
			rows.push({
				scenario,
				metric,
				baseline: base,
				current: value,
				change: base === 0 ? 0 : (value - base) / base,
				regression: rule !== undefined && value - base > rule.floor && value > base * (1 + rule.tolerance),
			});
		}
	}
	return rows;
}

export function table(rows: Row[]): string {
	const pct = (change: number) => `${change >= 0 ? "+" : ""}${(change * 100).toFixed(1)}%`;
	const lines = rows.map(
		(row) =>
			`${row.regression ? "REGRESSED" : "ok       "}  ${row.scenario.padEnd(34)} ${row.metric.padEnd(13)} ` +
			`${row.baseline.toFixed(2).padStart(10)} -> ${row.current.toFixed(2).padStart(10)}  ${pct(row.change).padStart(8)}`,
	);
	return lines.join("\n");
}

export function median(values: number[]): number {
	const sorted = [...values].sort((a, b) => a - b);
	return sorted[Math.floor(sorted.length / 2)] ?? 0;
}
