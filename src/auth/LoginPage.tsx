// Login page component
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { LoginForm } from "../auth";
import { useAuthContext } from "./useAuthContext";

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthenticated } = useAuthContext();

	// Get the intended destination from location state, or default to home
	const from = location.state?.from || "/";

	// If user is already authenticated, redirect them to the destination
	useEffect(() => {
		if (isAuthenticated) {
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, from]);

	const handleLoginSuccess = () => {
		// Navigate to the page they tried to visit before being redirected to login
		navigate(from, { replace: true });
	};

	// Don't render login form if already authenticated
	if (isAuthenticated) {
		return null;
	}

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
			{/* Nebula effect */}

			{/* Login form container */}
			<div className="relative z-10 w-full max-w-md rounded-2xl border border-indigo-800/50 bg-slate-950/80 p-10 shadow-2xl backdrop-blur-md transition-all duration-500">
				<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 opacity-30"></div>

				<h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
					<span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
						SUPREMACY
					</span>
					<div className="mt-2 text-xl font-normal text-indigo-300">
						Access Portal
					</div>
				</h2>

				<LoginForm onLoginSuccess={handleLoginSuccess} />

				<div className="mt-8 text-center">
					<Link to={"/register"}>
						<button className="text-indigo-400 underline transition-colors hover:text-indigo-300">
							Create an Account
						</button>
					</Link>
					<span className="mx-2 text-indigo-400">|</span>
					<Link to={"/forgot-password"}>
						<button className="text-indigo-400 underline transition-colors hover:text-indigo-300">
							Forgot Password?
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
