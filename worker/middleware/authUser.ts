import { error, IRequest } from "itty-router";
import { ApiError } from "../api";
import { TokensDurableObject } from "../durable-objects";
import { tokenIdForTokenAuth as idFromToken } from "../routers/auth";

export interface AuthenticatedRequest extends IRequest {
	user: DurableObjectId;
}

export type AuthScope = "none" | "game:create" | "game:view" | "game:list";

export const anonymousUser = { id: "anonymous" };

export function withAuthUser(scope: AuthScope = "none") {
	return async (request: IRequest, env: Env) => {
		const clientId = request.headers.get("x-client-id");
		if (!clientId) {
			throw new ApiError(401, "Unauthorized: No client ID provided");
		}

		const auth = request.headers.get("authorization");
		if (!auth || !auth.startsWith("Bearer ")) {
			if (scope === "none") {
				// Anonymous allowed for "none" scope
				(request as AuthenticatedRequest).user = env.USERS.newUniqueId();
				return;
			}
			throw new ApiError(401, "Unauthorized: No authorization header provided");
		}

		const token = auth.replace("Bearer ", "").trim();
		const id = idFromToken(env.TOKENS, token);
		const tokenStub = env.TOKENS.get(id) as unknown as TokensDurableObject;

		const result = await tokenStub.verifyAccessToken(token, clientId, scope);
		if (result.error || !result.user) {
			return error(result.error?.status ?? 401, {
				error: result.error?.message || "Unauthorized",
			});
		}

		(request as AuthenticatedRequest).user = env.USERS.idFromString(
			result.user,
		);
	};
}
