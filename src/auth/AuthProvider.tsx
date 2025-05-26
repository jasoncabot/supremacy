import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../hooks/useApi";
import { AuthContext } from "./useAuthContext";
import { Loading } from "../Loading";

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const { authenticated, login: apiLogin, logout, loading, error } = useAuth();
	const [isReady, setIsReady] = useState(false);

	// Set isReady to true after initial authentication check
	useEffect(() => {
		setIsReady(true);
	}, [authenticated]);

	if (!isReady) {
		return <Loading />;
	}

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
