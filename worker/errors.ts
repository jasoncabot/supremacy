import { json } from "itty-router";
import { ApiError, ErrorBody, Result } from "./api";

/**
 * Build a successful {@link Result}. Call `ok()` with no argument for a
 * `Result<void>`.
 */
export function ok<T = void>(value?: T): Result<T> {
	return { ok: true, value: value as T };
}

/**
 * Build a failed {@link Result}. This is how Durable Object methods report
 * errors — returned as a plain value rather than thrown, so `status`/`code`
 * survive the RPC boundary. The worker side turns it back into a thrown
 * {@link ApiError} via {@link unwrap}.
 */
export function err(status: number, code: string, message?: string): Result<never> {
	return { ok: false, error: { status, code, message: message || `${code} (${status})` } };
}

/**
 * Consume a {@link Result} returned from a Durable Object RPC method. On success
 * returns the value; on failure throws an {@link ApiError} *in the caller's
 * isolate*, where its properties are intact and `errorResponse` can format it.
 */
export function unwrap<T>(result: Result<T>): T {
	if (result.ok) return result.value;
	const { status, code, message } = result.error;
	throw new ApiError(status, code, message);
}

/**
 * The one place truth-to-client error mapping happens. Wired as the `catch`
 * handler on the routers, so every thrown error — from a request handler, from
 * middleware, or re-thrown by `unwrap` after a Durable Object call — funnels
 * through here and leaves as a consistent {@link ErrorBody}.
 *
 * By the time an error reaches here it is always in-isolate (DO methods return
 * `Result`s rather than throwing across RPC), so a plain `instanceof` check is
 * reliable. Intentional `ApiError`s carry a client-safe message and pass
 * through verbatim. Anything else is unexpected: we log the full detail
 * server-side (where it can be diagnosed) and return an opaque message so we
 * never leak internals — stack traces, storage shapes, upstream failures.
 */
export function errorResponse(err: unknown): Response {
	if (err instanceof ApiError) {
		// 5xx ApiErrors are still "ours", but worth logging — they signal a bug
		// or a dependency we expected to succeed. 4xx are normal client errors.
		if (err.status >= 500) {
			console.error(`[api] ${err.code} (${err.status}): ${err.message}`);
		}
		return json(
			{ error: { code: err.code, message: err.message } } satisfies ErrorBody,
			{ status: err.status },
		);
	}

	console.error("[api] unhandled error:", err);

	// Cloudflare infrastructure errors flag overload via `.overloaded`; surface
	// that as 503 so clients (and our retry logic) can back off rather than retry
	// immediately. See the Durable Objects error-handling docs.
	const overloaded =
		typeof err === "object" &&
		err !== null &&
		(err as { overloaded?: unknown }).overloaded === true;

	return json(
		{
			error: {
				code: overloaded ? "overloaded" : "internal_error",
				message: overloaded
					? "The service is temporarily overloaded. Please try again shortly."
					: "An internal error occurred. Please try again.",
			},
		} satisfies ErrorBody,
		{ status: overloaded ? 503 : 500 },
	);
}
