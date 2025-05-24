export const makeDeterministic = () => {
	// Mock Date.now to return a fixed timestamp
	// May 1, 2025 00:00:00 UTC
	Date.now = () => 1746316800000;

	// Mock randomUUID to return deterministic UUIDs
	// This affects both the UUID in tokens and any DurableObjectId.toString() results
	let uuidCounter = 0;
	// Need to cast to make TypeScript happy with the UUID format
	crypto.randomUUID = (() => {
		const uuids = [
			"11111111-1111-1111-1111-111111111111",
			"22222222-2222-2222-2222-222222222222",
			"33333333-3333-3333-3333-333333333333",
			"44444444-4444-4444-4444-444444444444",
		];
		return uuids[uuidCounter++ % uuids.length];
	}) as typeof crypto.randomUUID;

	// Mock getRandomValues to fill array with predictable values
	crypto.getRandomValues = (<T extends ArrayBufferView>(array: T): T => {
		const bytes = new Uint8Array(array.buffer);
		for (let i = 0; i < bytes.length; i++) {
			bytes[i] = i % 256;
		}
		return array;
	}) as typeof crypto.getRandomValues;

	// Mock Math.random to return predictable values
	let randomCounter = 0;
	Math.random = () => {
		const values = [
			0.1111111111111111, 0.2222222222222222, 0.3333333333333333,
			0.4444444444444444,
		];
		return values[randomCounter++ % values.length];
	};
};
