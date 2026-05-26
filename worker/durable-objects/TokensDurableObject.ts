import { DurableObject } from "cloudflare:workers";
import { UsersDurableObject } from ".";
import { Result, SignupRequest, TokenPair } from "../api";
import { ok, err } from "../errors";
import { AuthScope } from "../middleware";

const idFromUsername = (
	ns: DurableObjectNamespace<UsersDurableObject>,
	username: string,
) => {
	return ns.idFromName(`user:${username}`);
};
const tokenIdForUserId = (
	ns: DurableObjectNamespace<TokensDurableObject>,
	id: string,
) => {
	return ns.idFromName(`tokens:${id}`);
};

/**
 * Plays two roles, distinguished by how the instance is addressed:
 *
 * - **Coordinator**, addressed by `idFromName("user:<username>")` — the entry
 *   points `signup`/`login` route to the right per-user instances; the
 *   coordinator stores nothing itself.
 * - **Per-user token store**, addressed by `idFromName("tokens:<userId>")` —
 *   holds the password hash and issued tokens for one user. `storePassword`,
 *   `checkPassword`, `refresh`, and `verifyAccessToken` operate on this state.
 *
 * Because the two roles live on different instances, the coordinator reaches a
 * store instance over RPC (`this.env.TOKENS.get(...)`). Methods called that way
 * are part of the RPC surface and must be **public** — only `generateTokens` is
 * truly internal (always invoked via `this`) and stays `private`. Note that
 * `storePassword` therefore sets a user's credentials with no authentication;
 * it is reachable only by trusted server-side bindings, never by HTTP clients.
 */
export class TokensDurableObject extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async signup(
		req: SignupRequest,
		clientId: string,
	): Promise<Result<TokenPair>> {
		// this instance of the DO is for the users username and acts as a co-ordinator rather than storing the user data itself
		const uid = idFromUsername(this.env.USERS, req.username);
		const obj = this.env.USERS.get(uid);

		// Store the user details in the USERS object; propagate a failure (e.g.
		// 409 conflict) verbatim rather than continuing.
		const created = await obj.signup(req);
		if (!created.ok) return created;

		// if signup worked, then create a durable object for that user
		const tid = tokenIdForUserId(this.env.TOKENS, uid.toString());
		const tobj = this.env.TOKENS.get(tid);

		// Create refresh and access tokens for this user and client
		return ok(await tobj.storePassword(uid.toString(), req.password, clientId));
	}

	/**
	 * Authenticate a user with username and password.
	 * @returns a `Result` carrying the issued token pair, or a 401 on failure.
	 */
	async login(
		username: string,
		password: string,
		clientId: string,
	): Promise<Result<TokenPair>> {
		// this instance of the DO is for the users username and acts as a co-ordinator rather than storing the user data itself
		const id = idFromUsername(this.env.USERS, username);
		const obj = this.env.USERS.get(id);
		const user = await obj.getUser();
		if (!user) {
			// Authentication failures are deliberately indistinguishable: a missing
			// user and a wrong password both surface as 401, so we don't leak which
			// usernames exist.
			return err(401, "unauthorized", "Invalid username or password");
		}

		// we still haven't authenticated the user, just know the id that we need to use
		const tokensId = tokenIdForUserId(this.env.TOKENS, id.toString());
		const tokensObj = this.env.TOKENS.get(tokensId);

		// Create refresh and access tokens for this user and client; checkPassword
		// already returns a Result, so propagate it directly.
		return tokensObj.checkPassword(password, clientId);
	}

	// Public because it is invoked over RPC by the coordinator instance (see the
	// class doc); it is not an HTTP endpoint.
	async storePassword(
		usersId: string,
		password: string,
		clientId: string,
	): Promise<TokenPair> {
		// This now invalidates any previous tokens for this user
		await this.ctx.storage.deleteAll();

		// hash the password so it can be stored
		const salt = crypto.getRandomValues(new Uint8Array(16));
		const hashedPassword = await crypto.subtle.digest(
			"SHA-256",
			new TextEncoder().encode(password + salt),
		);

		// save the username and password to this DO instance
		this.ctx.storage.put("userId", usersId);
		this.ctx.storage.put("salt", salt);
		this.ctx.storage.put("password", hashedPassword);

		return this.generateTokens(clientId);
	}

	// Public because it is invoked over RPC by the coordinator instance (see the
	// class doc); it is not an HTTP endpoint.
	async checkPassword(
		password: string,
		clientId: string,
	): Promise<Result<TokenPair>> {
		const storedSalt = await this.ctx.storage.get<Uint8Array>("salt");
		const storedPassword = await this.ctx.storage.get<ArrayBuffer>("password");

		if (!storedSalt || !storedPassword) {
			// Same opaque 401 as a wrong password — see `login`.
			return err(401, "unauthorized", "Invalid username or password");
		}

		const hashedInputPassword = await crypto.subtle.digest(
			"SHA-256",
			new TextEncoder().encode(password + storedSalt),
		);

		if (!crypto.subtle.timingSafeEqual(hashedInputPassword, storedPassword)) {
			return err(401, "unauthorized", "Invalid username or password");
		}

		return ok(await this.generateTokens(clientId));
	}

	private async generateTokens(clientId: string): Promise<TokenPair> {
		const accessToken = `swa:${this.ctx.id}:${crypto.randomUUID().replace(/-/g, "")}`;
		const refreshToken = `swr:${this.ctx.id}:${crypto.randomUUID().replace(/-/g, "")}`;

		const accessTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
		const refreshTokenExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

		// Store the tokens
		await this.ctx.storage.put(`access:${clientId}`, {
			clientId,
			accessToken,
			expiry: accessTokenExpiry,
		});
		await this.ctx.storage.put(`refresh:${clientId}`, {
			clientId,
			refreshToken,
			expiry: refreshTokenExpiry,
		});

		return {
			accessToken,
			refreshToken,
			accessTokenExpiry,
			refreshTokenExpiry,
			clientId,
		};
	}

	async refresh(
		refreshToken: string,
		clientId: string,
	): Promise<Result<TokenPair>> {
		// Retrieve the refresh token data
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

		// Generate new tokens
		return ok(await this.generateTokens(clientId));
	}

	/**
	 * Verify an access token has the given scope.
	 * @returns the authenticated user id; throws {@link ApiError} on failure.
	 */
	async verifyAccessToken(
		tokenId: string,
		clientId: string,
		scope: AuthScope,
	): Promise<Result<string>> {
		// check the access:<token>
		const tokenData = await this.ctx.storage.get<{
			clientId: string;
			accessToken: string;
			expiry: number;
		}>(`access:${clientId}`);
		if (
			!tokenData ||
			tokenData.accessToken !== tokenId ||
			Date.now() > tokenData.expiry
		) {
			return err(401, "unauthorized", "Invalid or expired access token");
		}
		// At this point, we have a valid access token for the client
		// Now we need to retrieve the user associated with this token

		const userId = await this.ctx.storage.get<string>("userId");
		if (!userId) {
			return err(401, "unauthorized", "Invalid or expired access token");
		}

		const id = this.env.USERS.idFromString(userId);
		const user = this.env.USERS.get(id);
		const hasScope = await user.hasScope(scope);
		if (!hasScope) {
			return err(403, "forbidden", `Access denied for scope: ${scope}`);
		}

		return ok(userId);
	}
}
