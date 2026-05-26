// worker/auth.ts
import { IRequest, json, Router } from "itty-router";
import {
	ApiError,
	LoginRequest,
	RefreshTokenRequest,
	SignupRequest,
} from "../api";
import { TokensDurableObject } from "../durable-objects";
import { unwrap } from "../errors";

const tokenIdForPasswordAuth = (username: string) => `password:${username}`;

export const tokenIdForTokenAuth = (
	tokens: DurableObjectNamespace<TokensDurableObject>,
	token: string,
) => {
	const parts = token.split(":");
	if (parts.length != 3 || (parts[0] !== "swa" && parts[0] !== "swr")) {
		throw new ApiError(401, "unauthorized", "Invalid token");
	}
	try {
		// A well-formed prefix can still carry an id that isn't valid for this
		// namespace; idFromString throws a TypeError in that case. Treat any such
		// failure as an invalid token rather than letting it surface as a 500.
		return tokens.idFromString(parts[1]);
	} catch {
		throw new ApiError(401, "unauthorized", "Invalid token");
	}
};

// Create a new router
const authRouter = Router<IRequest, [Env, ExecutionContext]>({
	base: "/api/auth",
})
	.post("/signup", async (request, env) => {
		const body = (await request.json()) as SignupRequest;
		const clientId = request.headers.get("x-client-id");

		if (env.SIGNUPS_ENABLED !== "true") {
			throw new ApiError(403, "signups_disabled", "Signup is currently disabled");
		}

		if (!body.username || !body.password || !clientId) {
			throw new ApiError(
				400,
				"bad_request",
				"Username, password, and client ID are required",
			);
		}

		const authName = tokenIdForPasswordAuth(body.username);
		// Ask the token object to authenticate the user
		const passwordAuthId = env.TOKENS.idFromName(authName);
		const passwordAuthObj = env.TOKENS.get(passwordAuthId);

		const tokens = unwrap(await passwordAuthObj.signup(body, clientId));
		return json(tokens, { status: 201 });
	})
	// authenticates user and returns tokens
	.post("/login", async (request, env) => {
		const body = (await request.json()) as LoginRequest;
		const clientId = request.headers.get("x-client-id");

		if (!body.username || !body.password || !clientId) {
			throw new ApiError(
				400,
				"bad_request",
				"Username, password, and client ID are required",
			);
		}

		// Ask the token object to authenticate the user
		const passwordAuthId = env.TOKENS.idFromName(
			tokenIdForPasswordAuth(body.username),
		);
		const passwordAuthObj = env.TOKENS.get(passwordAuthId);

		const tokens = unwrap(
			await passwordAuthObj.login(body.username, body.password, clientId),
		);
		return json(tokens, { status: 201 });
	})
	// refreshes access token using refresh token
	.post("/refresh", async (request, env) => {
		const body = (await request.json()) as RefreshTokenRequest;
		const clientId = request.headers.get("x-client-id");
		if (!body.refreshToken || !clientId) {
			throw new ApiError(
				400,
				"bad_request",
				"Refresh token and client ID are required",
			);
		}

		const passwordAuthObjId = tokenIdForTokenAuth(
			env.TOKENS,
			body.refreshToken,
		);
		const refreshTokenAuthObj = env.TOKENS.get(passwordAuthObjId);
		const tokens = unwrap(
			await refreshTokenAuthObj.refresh(body.refreshToken, clientId),
		);
		return json(tokens, { status: 200 });
	});

export { authRouter };
