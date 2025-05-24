import { DurableObject } from "cloudflare:workers";
import { UsersDurableObject } from ".";
import { ApiError } from "../api";
import { AuthScope } from "../middleware";

interface TokenPair {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiry: number; // Unix timestamp in milliseconds
	refreshTokenExpiry: number; // Unix timestamp in milliseconds
	clientId: string; // Client ID for which the tokens are generated
}

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

export class TokensDurableObject extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async signup(
		username: string,
		password: string,
		clientId: string,
	): Promise<{ tokens?: TokenPair; error?: ApiError }> {
		// this instance of the DO is for the users username and acts as a co-ordinator rather than storing the user data itself
		const uid = idFromUsername(this.env.USERS, username);
		const obj = (await this.env.USERS.get(
			uid,
		)) as unknown as UsersDurableObject;

		// Store the user details specifically in the USERS object
		const result = await obj.signup(username);
		if (result.error) {
			return { error: result.error };
		}

		// if signup worked, then create a durable object for that user
		const tid = tokenIdForUserId(this.env.TOKENS, uid.toString());
		const tobj = (await this.env.TOKENS.get(
			tid,
		)) as unknown as TokensDurableObject;

		// Create refresh and access tokens for this user and client
		return tobj.storePassword(uid.toString(), password, clientId);
	}

	/**
	 * Authenticate a user with username and password
	 * @returns TokenPair if successful, undefined if not
	 */
	async login(
		username: string,
		password: string,
		clientId: string,
	): Promise<{ tokens?: TokenPair; error?: ApiError }> {
		// this instance of the DO is for the users username and acts as a co-ordinator rather than storing the user data itself
		const id = idFromUsername(this.env.USERS, username);
		const obj = (await this.env.USERS.get(id)) as unknown as UsersDurableObject;
		const user = await obj.getUser();
		if (!user) {
			return { error: new ApiError(404, "not_found", "User not found") };
		}

		// we still haven't authenticated the user, just know the id that we need to use
		const tokensId = tokenIdForUserId(this.env.TOKENS, id.toString());
		const tokensObj = (await this.env.TOKENS.get(
			tokensId,
		)) as unknown as TokensDurableObject;

		// Create refresh and access tokens for this user and client
		return tokensObj.checkPassword(password, clientId);
	}

	private async storePassword(
		usersId: string,
		password: string,
		clientId: string,
	): Promise<{ tokens?: TokenPair; error?: ApiError }> {
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

	private async checkPassword(
		password: string,
		clientId: string,
	): Promise<{ tokens?: TokenPair; error?: ApiError }> {
		const storedSalt = await this.ctx.storage.get<Uint8Array>("salt");
		const storedPassword = await this.ctx.storage.get<ArrayBuffer>("password");

		if (!storedSalt || !storedPassword) {
			return { error: new ApiError(404, "not_found", "User not found") };
		}

		const hashedInputPassword = await crypto.subtle.digest(
			"SHA-256",
			new TextEncoder().encode(password + storedSalt),
		);

		if (!crypto.subtle.timingSafeEqual(hashedInputPassword, storedPassword)) {
			return { error: new ApiError(401, "unauthorized", "Invalid password") };
		}

		return this.generateTokens(clientId);
	}

	private async generateTokens(
		clientId: string,
	): Promise<{ tokens: TokenPair }> {
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
			tokens: {
				accessToken,
				refreshToken,
				accessTokenExpiry,
				refreshTokenExpiry,
				clientId,
			},
		};
	}

	async refresh(
		refreshToken: string,
		clientId: string,
	): Promise<{ tokens?: TokenPair; error?: ApiError }> {
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
			return {
				error: new ApiError(
					401,
					"unauthorized",
					"Invalid or expired refresh token",
				),
			};
		}

		// Generate new tokens
		return this.generateTokens(clientId);
	}

	async verifyAccessToken(
		tokenId: string,
		clientId: string,
		scope: AuthScope,
	): Promise<{ user?: string; error?: ApiError }> {
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
			return {
				error: new ApiError(
					401,
					"unauthorized",
					"Invalid or expired access token",
				),
			};
		}
		// At this point, we have a valid access token for the client
		// Now we need to retrieve the user associated with this token

		const userId = await this.ctx.storage.get<string>("userId");
		if (!userId) {
			return { error: new ApiError(404, "not_found", "User not found") };
		}

		const id = this.env.USERS.idFromString(userId);
		const user = this.env.USERS.get(id) as unknown as UsersDurableObject;
		const hasScope = user.hasScope(scope);
		if (!hasScope) {
			return {
				error: new ApiError(
					403,
					"forbidden",
					`Access denied for scope: ${scope}`,
				),
			};
		}

		return { user: userId };
	}
}
