// worker/auth.ts
import { IRequest, json, Router } from "itty-router";
import {
	ApiError,
	ForgotPasswordRequest,
	LoginRequest,
	RefreshTokenRequest,
	ResetPasswordRequest,
	SignupRequest,
} from "../api";
import { TokensDurableObject, tokenIdForUserStore } from "../durable-objects/TokensDurableObject";
import { unwrap } from "../errors";

async function sendResetEmail(env: Env, to: string, resetUrl: string): Promise<void> {
	if (!env.MAILGUN_KEY || !env.MAILGUN_DOMAIN) {
		// No email service in dev — log so the reset URL is visible in wrangler output.
		console.log(`[dev] password reset link for ${to}: ${resetUrl}`);
		return;
	}
	const auth = btoa(`api:${env.MAILGUN_KEY}`);
	const body = new URLSearchParams({
		from: `Supremacy <noreply@${env.MAILGUN_DOMAIN}>`,
		to,
		subject: "Reset your Supremacy password",
		text: `Click the link below to reset your password. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you did not request a password reset, ignore this email.`,
	});
	const response = await fetch(`https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${auth}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: body.toString(),
	});
	if (!response.ok) {
		console.error("Mailgun error:", response.status, await response.text());
		throw new ApiError(500, "email_failed", "Failed to send reset email");
	}
}

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

async function sendResetLink(env: Env, email: string, origin: string): Promise<void> {
	const found = await env.USERS.getByName(`email:${email}`).getUsernameForEmail();
	if (!found.ok) return;
	const username = found.value;

	const usersHexId = env.USERS.idFromName(`user:${username}`).toString();
	const tokensId = tokenIdForUserStore(env.TOKENS, usersHexId);
	const resetToken = unwrap(await env.TOKENS.get(tokensId).createResetToken());
	await sendResetEmail(env, email, `${origin}/reset-password?token=${encodeURIComponent(resetToken)}`);
}

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
	// sends a password reset email if the account exists
	.post("/forgot", async (request, env, ctx) => {
		const body = (await request.json()) as ForgotPasswordRequest;
		if (!body.email) {
			throw new ApiError(400, "bad_request", "Email is required");
		}
		const email = normaliseEmail(body.email);
		const origin = new URL(request.url).origin;

		// Lookup and send happen after responding, so timing and errors reveal nothing
		ctx.waitUntil(
			sendResetLink(env, email, origin).catch((e) =>
				console.error(JSON.stringify({ message: "reset email failed", error: String(e) })),
			),
		);

		return json({ success: true }, { status: 200 });
	})
	// resets password using a valid reset token
	.post("/reset", async (request, env) => {
		const body = (await request.json()) as ResetPasswordRequest;
		if (!body.token || !body.password) {
			throw new ApiError(400, "bad_request", "Token and password are required");
		}

		const parts = body.token.split(":");
		if (parts.length !== 3 || parts[0] !== "swpr") {
			throw new ApiError(401, "unauthorized", "Invalid reset token");
		}
		let tokenObjId: DurableObjectId;
		try {
			tokenObjId = env.TOKENS.idFromString(parts[1]);
		} catch {
			throw new ApiError(401, "unauthorized", "Invalid reset token");
		}

		unwrap(await env.TOKENS.get(tokenObjId).resetPassword(body.token, body.password));
		return json({ success: true }, { status: 200 });
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
