// worker/auth.ts
import { error, IRequest, json, Router } from "itty-router";
import { LoginRequest, RefreshTokenRequest, SignupRequest } from "../api";
import { TokensDurableObject } from "../durable-objects";

const tokenIdForPasswordAuth = (username: string) => `password:${username}`;

export const tokenIdForTokenAuth = (
	tokens: DurableObjectNamespace<TokensDurableObject>,
	token: string,
) => {
	const parts = token.split(":");
	if (parts.length != 3 || (parts[0] !== "swa" && parts[0] !== "swr")) {
		throw new Error("Invalid token format");
	}
	return tokens.idFromString(parts[1]);
};

// Create a new router
const authRouter = Router<IRequest, [Env, ExecutionContext]>({
	base: "/api/auth",
})
	.post("/signup", async (request, env) => {
		const body = (await request.json()) as SignupRequest;
		const clientId = request.headers.get("x-client-id");

		if (body.username !== "testuser") {
			return error(403, {
				error: "Signup is currently disabled for all users",
			});
		}

		if (!body.username || !body.password || !clientId) {
			return error(400, {
				error: "Username, password, and client ID are required",
			});
		}

		const authName = tokenIdForPasswordAuth(body.username);
		// Ask the token object to authenticate the user
		const passwordAuthId = env.TOKENS.idFromName(authName);
		const passwordAuthObj = env.TOKENS.get(
			passwordAuthId,
		) as unknown as TokensDurableObject;

		const result = await passwordAuthObj.signup(body, clientId);

		if (result.error || !result.tokens) {
			return error(result.error?.status || 400, {
				error: result.error?.message || "Signup failed",
			});
		}

		return json(result.tokens, { status: 201 });
	})
	// authenticates user and returns tokens
	.post("/login", async (request, env) => {
		const body = (await request.json()) as LoginRequest;
		const clientId = request.headers.get("x-client-id");

		if (!body.username || !body.password || !clientId) {
			return error(400, {
				error: "Username, password, and client ID are required",
			});
		}

		// Ask the token object to authenticate the user
		const passwordAuthId = env.TOKENS.idFromName(
			tokenIdForPasswordAuth(body.username),
		);
		const passwordAuthObj = env.TOKENS.get(
			passwordAuthId,
		) as unknown as TokensDurableObject;

		const result = await passwordAuthObj.login(
			body.username,
			body.password,
			clientId,
		);

		if (result.error || !result.tokens) {
			return error(result.error?.status || 401, {
				error: result.error?.message || "Login failed",
			});
		}

		return json(result.tokens, { status: 201 });
	})
	// refreshes access token using refresh token
	.post("/refresh", async (request, env) => {
		const body = (await request.json()) as RefreshTokenRequest;
		const clientId = request.headers.get("x-client-id");
		if (!body.refreshToken || !clientId) {
			return error(400, { error: "Refresh token and client ID are required" });
		}

		const passwordAuthObjId = tokenIdForTokenAuth(
			env.TOKENS,
			body.refreshToken,
		);
		const refreshTokenAuthObj = (await env.TOKENS.get(
			passwordAuthObjId,
		)) as unknown as TokensDurableObject;
		const result = await refreshTokenAuthObj.refresh(
			body.refreshToken,
			clientId,
		);
		if (result.error || !result.tokens) {
			return error(result.error?.status || 401, {
				error: result.error?.message || "Refresh token failed",
			});
		}
		return json(result.tokens, { status: 200 });
	});

export { authRouter };
