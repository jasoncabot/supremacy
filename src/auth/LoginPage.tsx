// Login page component
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React, { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuthContext } from "./useAuthContext";

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { login, loading, error, isAuthenticated } = useAuthContext();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!username || !password) {
			return;
		}

		const loginResult = await login(username, password);
		if (loginResult && handleLoginSuccess) {
			handleLoginSuccess();
		}
	};

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
		<div className="relative w-full max-w-md rounded-2xl border border-indigo-800/50 bg-slate-950/80 p-10 shadow-2xl backdrop-blur-md transition-all duration-500">
			<h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
				<span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
					SUPREMACY
				</span>
				<div className="mt-2 text-xl font-normal text-indigo-300">Login</div>
			</h2>

			{error && (
				<div className="mb-6 rounded-lg border border-red-700 bg-red-900/50 p-4 text-red-300 backdrop-blur-sm">
					<p className="text-sm font-medium">{error.message}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<label
						htmlFor="username"
						className="block text-sm font-medium text-indigo-300"
					>
						Username
					</label>
					<div className="relative">
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={loading}
							required
							className="w-full rounded-lg border border-indigo-900/70 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-400 shadow-inner backdrop-blur-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-70"
							placeholder="Enter your username"
						/>
						<div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity peer-focus:opacity-100"></div>
					</div>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-indigo-300"
					>
						Password
					</label>
					<div className="relative">
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
							required
							className="w-full rounded-lg border border-indigo-900/70 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-400 shadow-inner backdrop-blur-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-70"
							placeholder="Enter your password"
						/>
						<div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity peer-focus:opacity-100"></div>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="focus:ring-opacity-50 h-12 w-full cursor-pointer rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all duration-300 ease-out hover:from-indigo-500 hover:to-purple-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
				>
					{loading ? (
						<span className="flex items-center justify-center">
							<ArrowPathIcon className="mr-2 h-4 w-4 animate-spin text-white" />
							Logging in...
						</span>
					) : (
						"Login"
					)}
				</button>
			</form>

			<div className="mt-4 text-center">
				<hr className="my-4 border-indigo-800/50" />
				<Link to={"/register"}>
					<button className="cursor-pointer text-indigo-400 underline transition-colors hover:text-indigo-300">
						Register now
					</button>
				</Link>
				<span className="mx-2 text-indigo-400">|</span>
				<Link to={"/forgot-password"}>
					<button className="cursor-pointer text-indigo-400 underline transition-colors hover:text-indigo-300">
						Forgot password?
					</button>
				</Link>
			</div>
		</div>
	);
};

export default LoginPage;
