import { useAuthContext } from "./useAuthContext";

/**
 * Hook for handling authentication in components
 * Provides methods for checking auth status and accessing user data
 */
export function useAuthentication() {
	const { isAuthenticated, logout } = useAuthContext();

	return {
		isAuthenticated,
		logout,
	};
}
