import { createContext, useContext } from "react";

export interface AuthContextType {
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;
	loading?: boolean;
	error?: Error | null;
}

export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	login: async () => false,
	logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
