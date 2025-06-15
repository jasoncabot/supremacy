/**
 * UUID utility functions that work in both secure and non-secure contexts.
 * Falls back to Math.random() based UUID generation in development mode
 * when crypto.randomUUID() is not available (e.g., HTTP instead of HTTPS).
 */

/**
 * Generates a UUID v4 string.
 * Prefers crypto.randomUUID() when available, falls back to Math.random() based generation.
 * 
 * @returns A UUID v4 string
 */
export const generateUUID = (): string => {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		try {
			return crypto.randomUUID();
		} catch {
			// Fallback if crypto.randomUUID fails (e.g., not in secure context)
		}
	}
	
	// Simple UUID v4 alternative that works without secure context
	// This uses Math.random() which is less cryptographically secure but sufficient for development
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

/**
 * Generates a short random ID (8 characters) for cases where a full UUID is not needed.
 * 
 * @returns An 8-character random string
 */
export const generateShortId = (): string => {
	return Math.random().toString(36).substring(2, 10);
};
