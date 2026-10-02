import { defineConfig } from "vitest/config";

// Plain Node: these tests drive a real `wrangler dev` over HTTP and its
// inspector, rather than running inside workerd like the unit tests.
export default defineConfig({
	test: {
		include: ["perf/**/*.perf.ts"],
		environment: "node",
		// Show the comparison table as it is printed, rather than only on failure
		disableConsoleIntercept: true,
		fileParallelism: false,
		testTimeout: 300_000,
		hookTimeout: 180_000,
	},
});
