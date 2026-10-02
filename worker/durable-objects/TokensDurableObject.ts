import { DurableObject } from "cloudflare:workers";
import { UsersDurableObject } from ".";
import { Result, SignupRequest, TokenPair } from "../api";
import { ok, err } from "../errors";
import { AuthScope, GRANTED_SCOPES } from "../middleware";

const idFromUsername = (
	ns: DurableObjectNamespace<UsersDurableObject>,
	username: string,
) => {
	return ns.idFromName(`user:${username}`);
};

/**
 * Given the hex-string ID of a user's Users DO instance, return the ID of the
 * corresponding per-user Tokens DO instance. Exported so the auth router can
 * derive the same address without diverging.
 */
export const tokenIdForUserStore = (
	ns: DurableObjectNamespace<TokensDurableObject>,
	usersHexId: string,
) => {
	return ns.idFromName(`tokens:${usersHexId}`);
};

function safeEqual(a: string, b: string): boolean {
	const enc = new TextEncoder();
	const x = enc.encode(a);
	const y = enc.encode(b);
	return x.byteLength === y.byteLength && crypto.subtle.timingSafeEqual(x, y);
}

async function hashPassword(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	return crypto.subtle.deriveBits(
		{ name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
		keyMaterial,
		256,
	);
}

/**
 * Plays two roles, distinguished by how the instance is addressed:
 *
 * - **Coordinator**, addressed by `idFromName("password:<username>")` — routes
 *   signup/login to the right per-user instance; stores nothing itself.
 * - **Per-user store**, addressed by `idFromName("tokens:<users-do-hex-id>")` —
 *   holds the password hash, salt, and issued tokens for one user.
 *   Use `tokenIdForUserStore` to derive the address consistently.
 */
export class TokensDurableObject extends DurableObject<Env> {
	async signup(
		req: SignupRequest,
		clientId: string,
	): Promise<Result<TokenPair>> {
		const uid = idFromUsername(this.env.USERS, req.username);
		const obj = this.env.USERS.get(uid);

		const created = await obj.signup(req);
		if (!created.ok) return created;

		const tid = tokenIdForUserStore(this.env.TOKENS, uid.toString());
		const tobj = this.env.TOKENS.get(tid);

		return tobj.storePassword(uid.toString(), req.password, clientId);
	}

	async login(
		username: string,
		password: string,
		clientId: string,
	): Promise<Result<TokenPair>> {
		const id = idFromUsername(this.env.USERS, username);
		const obj = this.env.USERS.get(id);
		const user = await obj.getUser();
		if (!user.ok) {
			// Deliberately indistinguishable: missing user and wrong password both
			// return 401 so usernames don't leak.
			return err(401, "unauthorized", "Invalid username or password");
		}

		const tokensId = tokenIdForUserStore(this.env.TOKENS, id.toString());
		return this.env.TOKENS.get(tokensId).checkPassword(password, clientId);
	}

	async storePassword(
		usersId: string,
		password: string,
		clientId: string,
	): Promise<Result<TokenPair>> {
		await this.ctx.storage.deleteAll();

		const salt = crypto.getRandomValues(new Uint8Array(16));
		const hash = await hashPassword(password, salt);

		await this.ctx.storage.put({ userId: usersId, salt, password: hash });

		return ok(await this.generateTokens(clientId));
	}

	async checkPassword(
		password: string,
		clientId: string,
	): Promise<Result<TokenPair>> {
		const storedSalt = await this.ctx.storage.get<Uint8Array>("salt");
		const storedHash = await this.ctx.storage.get<ArrayBuffer>("password");

		if (!storedSalt || !storedHash) {
			return err(401, "unauthorized", "Invalid username or password");
		}

		const hash = await hashPassword(password, storedSalt);

		if (!crypto.subtle.timingSafeEqual(hash, storedHash)) {
			return err(401, "unauthorized", "Invalid username or password");
		}

		return ok(await this.generateTokens(clientId));
	}

	private async generateTokens(clientId: string): Promise<TokenPair> {
		const accessToken = `swa:${this.ctx.id}:${crypto.randomUUID().replace(/-/g, "")}`;
		const refreshToken = `swr:${this.ctx.id}:${crypto.randomUUID().replace(/-/g, "")}`;

		const accessTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
		const refreshTokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;

		await this.ctx.storage.put({
			[`access:${clientId}`]: { clientId, accessToken, expiry: accessTokenExpiry },
			[`refresh:${clientId}`]: { clientId, refreshToken, expiry: refreshTokenExpiry },
		});

		return {
			accessToken,
			refreshToken,
			accessTokenExpiry,
			refreshTokenExpiry,
			clientId,
		};
	}

	async createResetToken(): Promise<Result<string>> {
		const resetToken = `swpr:${this.ctx.id}:${crypto.randomUUID().replace(/-/g, "")}`;
		await this.ctx.storage.put("reset_token", {
			token: resetToken,
			expiry: Date.now() + 60 * 60 * 1000,
		});
		return ok(resetToken);
	}

	async resetPassword(token: string, newPassword: string): Promise<Result<void>> {
		const invalid = err(401, "unauthorized", "Invalid or expired reset token");
		const stored = await this.ctx.storage.get<{ token: string; expiry: number }>("reset_token");
		if (!stored || !safeEqual(stored.token, token) || Date.now() > stored.expiry) {
			return invalid;
		}
		await this.ctx.storage.delete("reset_token");

		if (!(await this.ctx.storage.get<string>("userId"))) {
			return invalid;
		}

		const salt = crypto.getRandomValues(new Uint8Array(16));
		const hash = await hashPassword(newPassword, salt);

		// Sign out every existing session, atomically with the new password
		const sessions = await this.ctx.storage.list({ prefix: "access:" });
		const refreshes = await this.ctx.storage.list({ prefix: "refresh:" });
		await this.ctx.storage.transaction(async (txn) => {
			await txn.put({ salt, password: hash });
			await txn.delete([...sessions.keys(), ...refreshes.keys()]);
		});
		return ok();
	}

	async refresh(
		refreshToken: string,
		clientId: string,
	): Promise<Result<TokenPair>> {
		const tokenData = await this.ctx.storage.get<{
			clientId: string;
			refreshToken: string;
			expiry: number;
		}>(`refresh:${clientId}`);

		if (
			!tokenData ||
			tokenData.refreshToken !== refreshToken ||
			Date.now() > tokenData.expiry
		) {
			return err(401, "unauthorized", "Invalid or expired refresh token");
		}

		return ok(await this.generateTokens(clientId));
	}

	async verifyAccessToken(
		tokenId: string,
		clientId: string,
		scope: AuthScope,
	): Promise<Result<string>> {
		// One read for both keys: this runs on every authenticated request
		const stored = await this.ctx.storage.get<unknown>([`access:${clientId}`, "userId"]);
		const tokenData = stored.get(`access:${clientId}`) as
			| { accessToken: string; expiry: number }
			| undefined;
		const userId = stored.get("userId") as string | undefined;
		if (
			!tokenData ||
			!userId ||
			!safeEqual(tokenData.accessToken, tokenId) ||
			Date.now() > tokenData.expiry
		) {
			return err(401, "unauthorized", "Invalid or expired access token");
		}

		if (!GRANTED_SCOPES.includes(scope)) {
			return err(403, "forbidden", `Access denied for scope: ${scope}`);
		}

		return ok(userId);
	}
}
