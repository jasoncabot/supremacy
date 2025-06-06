// worker/index.ts
import { AutoRouter, error, IRequest, json } from "itty-router";
import { authRouter, gameRouter } from "./routers";
import { VersionResponse } from "./api";

type Args = [Env, ExecutionContext];

const apiRouter = AutoRouter<IRequest, Args>({ base: "/api" })
	.get(
		"/version",
		() => ({ version: import.meta.env.VITE_VERSION }) as VersionResponse,
	)
	.get("/health", () => json({ status: "ok" }))
	.all("/auth/*", authRouter.fetch)
	.all("/games/*", gameRouter.fetch);

const router = AutoRouter<IRequest, Args>()
	.all("/api/*", apiRouter.fetch)
	.all("*", (req, env) => env.ASSETS.fetch(req.url))
	.notFound(() => error(404, "Not found"));

export default {
	fetch(request, env, ctx) {
		return router.fetch(request, env, ctx).catch((err) => {
			console.warn("error in router", err);
			return error(500, "Internal server error");
		});
	},
} satisfies ExportedHandler<Env>;

export {
	GamesDurableObject,
	MatchmakerDurableObject,
	TokensDurableObject,
	UsersDurableObject,
} from "./durable-objects";
