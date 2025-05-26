import { SELF } from "cloudflare:test";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type {
	CreateGameRequest,
	LoginRequest,
	RefreshTokenRequest,
	SignupRequest,
} from "../worker/api";
import { makeDeterministic } from "./determinism";

// Standard headers that should be included in all API requests
// This follows the same pattern as in useApi.ts to ensure consistency
const standardHeaders = {
	"Content-Type": "application/json",
	"X-Client-ID": "test-client-id",
};

describe("api", () => {
	it("returns appropriate content for version", async () => {
		const request = new Request("http://example.com/api/version");
		const response = await SELF.fetch(request);
		expect(await response.json()).toMatchSnapshot();
	});

	it("returns appropriate content for health", async () => {
		const request = new Request("http://example.com/api/health");
		const response = await SELF.fetch(request);
		expect(await response.json()).toMatchSnapshot();
	});

	it("returns appropriate content for something-that-is-random", async () => {
		const request = new Request(
			"http://example.com/api/something-that-is-random",
		);
		const response = await SELF.fetch(request);
		expect(await response.json()).toMatchSnapshot();
	});
});

describe("auth", () => {
	// Store original functions to restore them later
	let originalRandomUUID: typeof crypto.randomUUID;
	let originalGetRandomValues: typeof crypto.getRandomValues;
	let originalDateNow: typeof Date.now;
	let originalMathRandom: typeof Math.random;

	beforeAll(() => {
		// Store original functions
		originalRandomUUID = crypto.randomUUID;
		originalGetRandomValues = crypto.getRandomValues;
		originalDateNow = Date.now;
		originalMathRandom = Math.random;

		makeDeterministic();
	});

	afterAll(() => {
		// Restore original functions
		crypto.randomUUID = originalRandomUUID;
		crypto.getRandomValues = originalGetRandomValues;
		Date.now = originalDateNow;
		Math.random = originalMathRandom;
	});

	it("can run through the whole sign up, login and refresh flow", async () => {
		const signupRequest = new Request("http://example.com/api/auth/signup", {
			method: "POST",
			body: JSON.stringify({
				username: "testuser",
				password: "testpassword",
			} as SignupRequest),
			headers: standardHeaders,
		});
		const signupResponse = await SELF.fetch(signupRequest);
		expect(await signupResponse.json()).toMatchSnapshot();

		const loginRequest = new Request("http://example.com/api/auth/login", {
			method: "POST",
			body: JSON.stringify({
				username: "testuser",
				password: "testpassword",
			} as LoginRequest),
			headers: standardHeaders,
		});
		const loginResponse = await SELF.fetch(loginRequest);
		expect(await loginResponse.json()).toMatchSnapshot();

		const refreshRequest = new Request("http://example.com/api/auth/refresh", {
			method: "POST",
			body: JSON.stringify({
				refreshToken:
					"swr:351491345f378acc5c06a9f29856f9f89f96981898ea190e7f6bce20ca9ece79:44444444444444444444444444444444",
			} as RefreshTokenRequest),
			headers: standardHeaders,
		});
		const refreshResponse = await SELF.fetch(refreshRequest);
		expect(await refreshResponse.json()).toMatchSnapshot();

		// create a game with this access token
		const gameRequest = new Request("http://example.com/api/games", {
			method: "POST",
			body: JSON.stringify({
				faction: "Empire",
				difficulty: "Easy",
				galaxySize: "Small",
				winCondition: "Standard",
				mode: "Single Player",
			} as CreateGameRequest),
			headers: {
				...standardHeaders,
				Authorization:
					"Bearer swa:351491345f378acc5c06a9f29856f9f89f96981898ea190e7f6bce20ca9ece79:11111111111111111111111111111111",
			},
		});
		const gameResponse = await SELF.fetch(gameRequest);
		expect(await gameResponse.json()).toMatchSnapshot();
	});
});
