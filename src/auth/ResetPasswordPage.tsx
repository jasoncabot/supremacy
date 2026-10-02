import React, { useState, FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useApi } from "../hooks/useApi";

const ResetPasswordPage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { fetchData } = useApi();
	const token = searchParams.get("token") ?? "";

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	if (!token) {
		return (
			<div className="relative w-full max-w-md rounded-2xl border border-indigo-800/50 bg-slate-950/80 p-10 shadow-2xl backdrop-blur-md">
				<p className="text-center text-red-300">Invalid or missing reset link.</p>
				<div className="mt-4 text-center">
					<Link to="/forgot-password" className="text-indigo-400 underline hover:text-indigo-300">
						Request a new one
					</Link>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		if (password !== confirmPassword) {
			setError(new Error("Passwords do not match"));
			return;
		}
		if (password.length < 8) {
			setError(new Error("Password must be at least 8 characters"));
			return;
		}

		setLoading(true);
		try {
			await fetchData("/api/auth/reset", {
				method: "POST",
				body: { token, password },
			});
			navigate("/login", {
				replace: true,
				state: { message: "Password reset successfully. Please log in." },
			});
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative w-full max-w-md rounded-2xl border border-indigo-800/50 bg-slate-950/80 p-10 shadow-2xl backdrop-blur-md transition-all duration-500">
			<h2 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
				<span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
					SUPREMACY
				</span>
				<div className="mt-2 text-xl font-normal text-indigo-300">
					New Password
				</div>
			</h2>

			{error && (
				<div className="mb-6 rounded-lg border border-red-700 bg-red-900/50 p-4 text-red-300 backdrop-blur-sm">
					<p className="text-sm font-medium">{error.message}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<label htmlFor="password" className="block text-sm font-medium text-indigo-300">
						New Password
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={loading}
						required
						minLength={8}
						className="w-full rounded-lg border border-indigo-900/70 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-400 shadow-inner backdrop-blur-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-70"
						placeholder="Enter new password"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-300">
						Confirm Password
					</label>
					<input
						type="password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						disabled={loading}
						required
						className="w-full rounded-lg border border-indigo-900/70 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-400 shadow-inner backdrop-blur-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-70"
						placeholder="Confirm new password"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="focus:ring-opacity-50 h-12 w-full cursor-pointer rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all duration-300 ease-out hover:from-indigo-500 hover:to-purple-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
				>
					{loading ? (
						<span className="flex items-center justify-center">
							<ArrowPathIcon className="mr-2 h-4 w-4 animate-spin text-white" />
							Resetting...
						</span>
					) : (
						"Reset Password"
					)}
				</button>
			</form>

			<div className="mt-4 text-center">
				<hr className="my-4 border-indigo-800/50" />
				<Link to="/login">
					<button className="cursor-pointer text-indigo-400 underline transition-colors hover:text-indigo-300">
						Back to Login
					</button>
				</Link>
			</div>
		</div>
	);
};

export default ResetPasswordPage;
