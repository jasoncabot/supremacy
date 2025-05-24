import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthContext } from "./useAuthContext";

interface ProtectedRouteProps {
	children?: ReactNode;
	redirectTo?: string;
}

/**
 * ProtectedRoute component - Protects routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export function ProtectedRoute({
	children,
	redirectTo = "/login",
}: ProtectedRouteProps) {
	const { isAuthenticated } = useAuthContext();
	const location = useLocation();

	if (!isAuthenticated) {
		// Save the current location in state to redirect back after login
		return (
			<Navigate to={redirectTo} state={{ from: location.pathname }} replace />
		);
	}

	return children ? <>{children}</> : <Outlet />;
}
