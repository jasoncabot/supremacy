import { useCallback, useEffect, useState, useRef } from "react";
import {
	ApiError,
	LoginRequest,
	RefreshTokenRequest,
	TokenPair,
} from "../../worker/api";

interface ApiOptions<TBody = unknown> {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	body?: TBody;
	headers?: Record<string, string>;
}

interface ApiHook<TResponse> {
	data: TResponse | null;
	loading: boolean;
	error: ApiError | Error | null;
	fetchData: <TRequestBody = unknown>(
		url: string,
		options?: ApiOptions<TRequestBody>,
	) => Promise<TResponse>;
}

import { generateShortId } from "../utils/uuid";

// Standard headers that should be included in all API requests
function getClientId(): string {
	const key = "supremacy:client:id";
	let clientId = localStorage.getItem(key);
	if (!clientId) {
		const randomPart = generateShortId();
		clientId = `web${randomPart}`;
		localStorage.setItem(key, clientId);
	}
	return clientId;
}

const standardHeaders = {
	"Content-Type": "application/json",
	"X-Client-ID": getClientId(),
};

// Keep a global pending refresh promise to handle concurrent requests
let pendingRefreshPromise: Promise<boolean> | null = null;

/**
 * Get tokens from local storage
 */
function getTokens(): TokenPair | null {
	const tokens = localStorage.getItem("supremacy:auth:tokens");
	if (tokens) {
		return JSON.parse(tokens) as TokenPair;
	}
	return null;
}

/**
 * Save tokens to local storage
 */
function saveTokens(tokens: TokenPair) {
	localStorage.setItem("supremacy:auth:tokens", JSON.stringify(tokens));
}

/**
 * Clear tokens from local storage
 */
function clearTokens() {
	localStorage.removeItem("supremacy:auth:tokens");
}

/**
 * Check if access token is expired or about to expire (within 5 minutes)
 */
function isAccessTokenExpired(): boolean {
	const tokens = getTokens();
	if (!tokens) return true;

	// Consider token expired if it's within 5 minutes of expiry
	return Date.now() + 5 * 60 * 1000 >= tokens.accessTokenExpiry;
}

/**
 * Check if refresh token is expired
 */
function isRefreshTokenExpired(): boolean {
	const tokens = getTokens();
	if (!tokens) return true;

	return Date.now() >= tokens.refreshTokenExpiry;
}

/**
 * Refresh the access token using the refresh token
 * @returns Promise that resolves to true if refresh was successful
 */
async function refreshAccessToken(): Promise<boolean> {
	// If there's already a refresh in progress, wait for it
	if (pendingRefreshPromise) {
		return pendingRefreshPromise;
	}

	const tokens = getTokens();
	if (!tokens || isRefreshTokenExpired()) {
		clearTokens();
		return false;
	}

	// Create a new refresh promise
	pendingRefreshPromise = (async () => {
		try {
			const response = await fetch("/api/auth/refresh", {
				method: "POST",
				headers: standardHeaders,
				body: JSON.stringify({
					refreshToken: tokens.refreshToken,
				} as RefreshTokenRequest),
			});

			if (!response.ok) {
				clearTokens();
				return false;
			}

			const newTokens = await response.json();
			saveTokens(newTokens);
			return true;
		} catch (error) {
			console.error("Failed to refresh token:", error);
			clearTokens();
			return false;
		} finally {
			pendingRefreshPromise = null;
		}
	})();

	return pendingRefreshPromise;
}

/**
 * Hook to authenticate a user with username and password
 */
export function useAuth() {
	const [authenticated, setAuthenticated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	// Check if user is already authenticated on mount
	useEffect(() => {
		const tokens = getTokens();
		if (tokens && !isRefreshTokenExpired()) {
			// We have tokens and refresh token is valid
			setAuthenticated(true);

			// If access token is expired, refresh it silently
			if (isAccessTokenExpired()) {
				refreshAccessToken().catch(console.error);
			}
		}
	}, []);

	const login = useCallback(
		async (username: string, password: string): Promise<boolean> => {
			setLoading(true);
			setError(null);

			try {
				const loginPromise = fetch("/api/auth/login", {
					method: "POST",
					headers: standardHeaders,
					body: JSON.stringify({ username, password } as LoginRequest),
				});

				// Ensure that we wait for a minimum of 1 second to prevent flickering
				const delayPromise = new Promise((resolve) =>
					setTimeout(resolve, 1000),
				);

				const [response] = await Promise.all([loginPromise, delayPromise]);

				if (!response.ok) {
					throw new ApiError(401, "unauthorized", "Invalid credentials");
				}

				const tokens = await response.json();
				saveTokens(tokens);
				setAuthenticated(true);

				return true;
			} catch (err) {
				const loginError = err instanceof Error ? err : new Error(String(err));
				setError(loginError);
				return false;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const logout = useCallback(() => {
		clearTokens();
		setAuthenticated(false);
	}, []);

	return { authenticated, loading, error, login, logout };
}

/**
 * Custom hook for making authenticated API requests
 * Centralizes authentication token handling and request logic
 * @template TResponse - The expected response type
 * @returns An ApiHook with strongly typed data and methods
 */
export function useApi<TResponse = unknown>(): ApiHook<TResponse> {
	const [data, setData] = useState<TResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | Error | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const fetchData = useCallback(
		async <TRequestBody = unknown>(
			url: string,
			options: ApiOptions<TRequestBody> = {},
		): Promise<TResponse> => {
			// Abort any in-flight request
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// Create a new abort controller for this request
			abortControllerRef.current = new AbortController();
			const { signal } = abortControllerRef.current;

			try {
				setLoading(true);
				setError(null);

				// Check if tokens need refresh before making the request
				if (isAccessTokenExpired() && !isRefreshTokenExpired()) {
					const refreshed = await refreshAccessToken();
					if (!refreshed) {
						throw new ApiError(
							401,
							"Unauthorized",
							"Session expired. Please log in again.",
						);
					}
				}

				// Get auth tokens
				const tokens = getTokens();

				// Prepare headers with authentication
				const headers = new Headers({
					...standardHeaders,
					...options.headers,
				});

				// Add authorization header if we have a token
				if (tokens) {
					headers.set("Authorization", `Bearer ${tokens.accessToken}`);
				}

				// Prepare the request
				const requestOptions: RequestInit = {
					method: options.method || "GET",
					headers,
					signal,
					...(options.body ? { body: JSON.stringify(options.body) } : {}),
				};

				// Make the API call
				let response = await fetch(url, requestOptions);

				// Handle 401 (Unauthorized) by refreshing the token and retrying once
				if (response.status === 401 && tokens && !isRefreshTokenExpired()) {
					const refreshed = await refreshAccessToken();
					if (refreshed) {
						// Get the new tokens
						const newTokens = getTokens();
						if (newTokens) {
							// Update the Authorization header with the new access token
							headers.set("Authorization", `Bearer ${newTokens.accessToken}`);

							// Retry the request with the new token
							requestOptions.headers = headers;
							response = await fetch(url, requestOptions);
						}
					}
				}

				// Handle non-2xx responses
				if (!response.ok) {
					// Handle 401 errors by clearing tokens if they still fail after refresh
					// We don't clear tokens for 403 errors since those indicate permission issues,
					// not authentication issues
					if (response.status === 401 && tokens) {
						clearTokens();
					}

					throw new ApiError(response.status, response.statusText);
				}

				// Parse and store the result
				const result = (await response.json()) as TResponse;
				setData(result);
				return result;
			} catch (err) {
				// Don't handle AbortError as an API error
				if (err instanceof DOMException && err.name === "AbortError") {
					console.log("Request was aborted");
					throw err;
				}

				const apiError =
					err instanceof ApiError
						? err
						: err instanceof Error
							? new Error(err.message)
							: new Error(String(err));

				setError(apiError);
				throw apiError;
			} finally {
				setLoading(false);
				abortControllerRef.current = null;
			}
		},
		[],
	);

	// Clean up the AbortController on unmount
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
				abortControllerRef.current = null;
			}
		};
	}, []);

	return { data, loading, error, fetchData };
}
