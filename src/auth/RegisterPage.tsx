import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React, { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { SignupRequest } from "../../worker/api";
import { useApi } from "../hooks/useApi";
import { useAuthContext } from "./useAuthContext";

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuthContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const { fetchData } = useApi();
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	// If user is already authenticated, redirect them to home
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		// Basic validation
		if (!formData.username || !formData.email || !formData.password) {
			setError(new Error("All fields are required"));
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError(new Error("Passwords do not match"));
			return;
		}

		setLoading(true);

		try {
			// Call the signup API endpoint
			await fetchData("/api/auth/signup", {
				method: "POST",
				body: {
					username: formData.username,
					password: formData.password,
					email: formData.email,
				} as SignupRequest,
			});

			// On success, redirect to login
			navigate("/login", {
				replace: true,
				state: { message: "Registration successful! Please log in." },
			});
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	};

	// Don't render if already authenticated
	if (isAuthenticated) {
		return null;
	}

	return (
		<div className="relative w-full max-w-md rounded-2xl border border-indigo-800/50 bg-slate-950/80 p-10 shadow-2xl backdrop-blur-md transition-all duration-500">
			<h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
				<span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
					SUPREMACY
				</span>
				<div className="mt-2 text-xl font-normal text-indigo-300">
					Create Account
				</div>
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
							name="username"
							value={formData.username}
							onChange={handleChange}
							disabled={loading}
							required
							className="w-full rounded-lg border border-indigo-900/70 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-400 shadow-inner backdrop-blur-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-70"
							placeholder="Choose a username"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-indigo-300"
					>
						Email
					</label>
					<div className="relative">
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							disabled={loading}
							required
							className="w-full rounded-lg border border-indigo-900/70 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-400 shadow-inner backdrop-blur-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-70"
							placeholder="Enter your email"
						/>
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
							name="password"
							value={formData.password}
							onChange={handleChange}
							disabled={loading}
							required
							className="w-full rounded-lg border border-indigo-900/70 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-400 shadow-inner backdrop-blur-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-70"
							placeholder="Create a password"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-indigo-300"
					>
						Confirm Password
					</label>
					<div className="relative">
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							disabled={loading}
							required
							className="w-full rounded-lg border border-indigo-900/70 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-400 shadow-inner backdrop-blur-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-70"
							placeholder="Confirm your password"
						/>
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
							Creating Account...
						</span>
					) : (
						"Register"
					)}
				</button>
			</form>

			<div className="mt-4 text-center">
				<hr className="my-4 border-indigo-800/50" />
				<Link to={"/login"}>
					<button className="cursor-pointer text-indigo-400 underline transition-colors hover:text-indigo-300">
						Back to Login
					</button>
				</Link>
			</div>
		</div>
	);
};

export default RegisterPage;
