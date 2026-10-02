// Talks to the local worker the way the browser does, plus wrangler's local
// explorer API for the two things the public API can't do: seeding rows into a
// Durable Object, and reading the request timings wrangler records itself.

const PASSWORD = "correct horse battery";

export class Api {
	constructor(private url: string) {}

	private async json<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
		const response = await fetch(`${this.url}${path}`, {
			...init,
			headers: {
				"Content-Type": "application/json",
				"X-Client-ID": "perf",
				...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
			},
		});
		if (!response.ok) throw new Error(`${init.method ?? "GET"} ${path} -> ${response.status}: ${await response.text()}`);
		return (await response.json()) as T;
	}

	async signUp(): Promise<{ username: string; token: string }> {
		const username = `perf-${crypto.randomUUID()}`;
		const tokens = await this.json<{ accessToken: string }>("/api/auth/signup", {
			method: "POST",
			body: JSON.stringify({ username, password: PASSWORD }),
		});
		return { username, token: tokens.accessToken };
	}

	async createGame(token: string, galaxySize: "Small" | "Medium" | "Large" = "Large"): Promise<string> {
		const { gameId } = await this.json<{ gameId: string }>("/api/games", {
			method: "POST",
			token,
			body: JSON.stringify({
				faction: "Empire",
				difficulty: "Easy",
				galaxySize,
				winCondition: "Standard",
				mode: "Single Player",
			}),
		});
		return gameId;
	}

	viewGame(token: string, gameId: string): Promise<unknown> {
		return this.json(`/api/games/${gameId}`, { token });
	}

	/** The way a browser revalidates: `etag` is what it holds, and an unchanged game answers 304. */
	async viewGameConditionally(token: string, gameId: string, etag?: string): Promise<{ status: number; etag: string | null }> {
		const response = await fetch(`${this.url}/api/games/${gameId}`, {
			headers: {
				"X-Client-ID": "perf",
				Authorization: `Bearer ${token}`,
				...(etag ? { "If-None-Match": etag } : {}),
			},
		});
		await response.arrayBuffer();
		return { status: response.status, etag: response.headers.get("ETag") };
	}

	listGames(token: string, limit = 50, cursor?: string): Promise<{ games: unknown[]; nextCursor?: string }> {
		const query = `limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
		return this.json(`/api/games?${query}`, { token });
	}

	logIn(username: string): Promise<unknown> {
		return this.json("/api/auth/login", {
			method: "POST",
			body: JSON.stringify({ username, password: PASSWORD }),
		});
	}

	private get explorer() {
		return `${this.url}/cdn-cgi/local/explorer/api`;
	}

	private async namespaceId(className: string): Promise<string> {
		const { result } = (await (await fetch(`${this.explorer}/workers/durable_objects/namespaces`)).json()) as {
			result: { id: string; class: string }[];
		};
		const found = result.find((namespace) => namespace.class === className);
		if (!found) throw new Error(`No ${className} namespace`);
		return found.id;
	}

	/** Runs SQL inside the Durable Object that `idFromName(name)` addresses. */
	async sql(className: string, name: string, sql: string): Promise<void> {
		const response = await fetch(`${this.explorer}/workers/durable_objects/namespaces/${await this.namespaceId(className)}/query`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ durable_object_name: name, queries: [{ sql }] }),
		});
		const body = (await response.json()) as { success: boolean; errors: unknown[] };
		if (!body.success) throw new Error(`seeding failed: ${JSON.stringify(body.errors)}`);
	}

	async clearTimings(): Promise<void> {
		await fetch(`${this.explorer}/local/observability/clear`, { method: "POST" });
	}

	/** How long wrangler measured each request to take, in the worker. */
	async requestTimingsMs(): Promise<number[]> {
		const response = await fetch(`${this.explorer}/local/observability/query`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sql: "SELECT duration_ms FROM spans WHERE parent_id IS NULL" }),
		});
		const body = (await response.json()) as { result: { rows: number[][] } };
		return body.result.rows.map(([ms]) => ms);
	}
}

/** `n` rows of SQL, as a recursive CTE, for seeding without sending n statements. */
export const series = (n: number) =>
	`WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < ${n})`;
