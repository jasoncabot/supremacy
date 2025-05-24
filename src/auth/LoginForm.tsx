import { FormEvent, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAuthContext } from "./useAuthContext";

interface LoginFormProps {
	onLoginSuccess?: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
	const { login, loading, error } = useAuthContext();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!username || !password) {
			return;
		}

		const loginResult = await login(username, password);
		if (loginResult && onLoginSuccess) {
			onLoginSuccess();
		}
	};

	return (
		<div className="relative z-10 w-full p-16">
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
		</div>
	);
}
