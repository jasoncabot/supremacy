import { ReactNode } from "react";
import { useAuth } from "../hooks/useApi";
import { AuthContext } from "./useAuthContext";

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const { authenticated, login: apiLogin, logout, loading, error } = useAuth();

	const handleLogin = async (username: string, password: string) => {
		return apiLogin(username, password);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: authenticated,
				login: handleLogin,
				logout,
				loading,
				error,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
