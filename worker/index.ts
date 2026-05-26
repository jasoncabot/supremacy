// worker/index.ts
import { AutoRouter, IRequest, json } from "itty-router";
import { authRouter, gameRouter } from "./routers";
import { ApiError, VersionResponse } from "./api";
import { errorResponse } from "./errors";

type Args = [Env, ExecutionContext];

const notFound = () => {
	throw new ApiError(404, "not_found", "Not found");
};

// `errorResponse` is wired as each router's `catch`, and `notFound` as its
// `missing`, so a thrown error anywhere — handler, middleware, an unmatched
// route, or an error propagated across a Durable Object RPC boundary — is
// formatted consistently and internal detail never leaks to the client.
const apiRouter = AutoRouter<IRequest, Args>({
	base: "/api",
	catch: errorResponse,
	missing: notFound,
})
	.get(
		"/version",
		() => ({ version: import.meta.env.VITE_VERSION }) as VersionResponse,
	)
	.get("/health", () => json({ status: "ok" }))
	.all("/auth/*", authRouter.fetch)
	.all("/games/*", gameRouter.fetch);

const router = AutoRouter<IRequest, Args>({ catch: errorResponse })
	.all("/api/*", apiRouter.fetch)
	.all("*", (req, env) => env.ASSETS.fetch(req.url))
	.notFound(notFound);

export default {
	fetch(request, env, ctx) {
		return router.fetch(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;

export {
	GamesDurableObject,
	MatchmakerDurableObject,
	TokensDurableObject,
	UsersDurableObject,
} from "./durable-objects";
