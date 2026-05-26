import { IRequest } from "itty-router";
import { ApiError } from "../api";
import { unwrap } from "../errors";
import { tokenIdForTokenAuth as idFromToken } from "../routers/auth";

export interface AuthenticatedRequest extends IRequest {
	user: DurableObjectId;
}

export type AuthScope = "none" | "game:create" | "game:view" | "game:list" | "game:delete";

export const anonymousUser = { id: "anonymous" };

export function withAuthUser(scope: AuthScope = "none") {
	return async (request: IRequest, env: Env) => {
		const clientId = request.headers.get("x-client-id");
		if (!clientId) {
			throw new ApiError(401, "unauthorized", "No client ID provided");
		}

		const auth = request.headers.get("authorization");
		if (!auth || !auth.startsWith("Bearer ")) {
			if (scope === "none") {
				// Anonymous allowed for "none" scope
				(request as AuthenticatedRequest).user = env.USERS.newUniqueId();
				return;
			}
			throw new ApiError(401, "unauthorized", "No authorization header provided");
		}

		const token = auth.replace("Bearer ", "").trim();
		// Throws ApiError(401) on a malformed or out-of-namespace token.
		const id = idFromToken(env.TOKENS, token);
		const tokenStub = env.TOKENS.get(id);

		// verifyAccessToken returns a Result; `unwrap` throws ApiError (401/403) on
		// an invalid token or missing scope, in this isolate, for the central
		// error formatter to handle.
		const userId = unwrap(
			await tokenStub.verifyAccessToken(token, clientId, scope),
		);
		(request as AuthenticatedRequest).user = env.USERS.idFromString(userId);
	};
}
