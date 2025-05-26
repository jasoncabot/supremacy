import React, { useState, FormEvent } from "react";
import { Link } from "react-router";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const ForgotPasswordPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!email) {
			setError(new Error("Email is required"));
			return;
		}

		setLoading(true);

		try {
			// Here you would call your password reset API
			// await resetPassword(email);

			// Simulate API call for now
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// On success
			setSuccess(true);
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
					Reset Password
				</div>
			</h2>

			{error && (
				<div className="mb-6 rounded-lg border border-red-700 bg-red-900/50 p-4 text-red-300 backdrop-blur-sm">
					<p className="text-sm font-medium">{error.message}</p>
				</div>
			)}

			{success ? (
				<div className="space-y-6">
					<div className="rounded-lg border border-green-700 bg-green-900/50 p-4 text-green-300 backdrop-blur-sm">
						<p className="text-sm font-medium">
							Password reset instructions have been sent to your email.
						</p>
					</div>
					<div className="mt-4 text-center">
						<hr className="my-4 border-indigo-800/50" />
						<Link to={"/login"}>
							<button className="cursor-pointer text-indigo-400 underline transition-colors hover:text-indigo-300">
								Return to Login
							</button>
						</Link>
					</div>
				</div>
			) : (
				<>
					<p className="mb-6 text-center text-indigo-300">
						Enter your email address and we'll send you instructions to reset your password.
					</p>

					<form onSubmit={handleSubmit} className="space-y-6">
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
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={loading}
									required
									className="w-full rounded-lg border border-indigo-900/70 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-400 shadow-inner backdrop-blur-sm transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-70"
									placeholder="Enter your email address"
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
									Sending...
								</span>
							) : (
								"Reset Password"
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
				</>
			)}
		</div>
	);
};

export default ForgotPasswordPage;
