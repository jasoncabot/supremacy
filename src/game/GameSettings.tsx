import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { useSettings } from "../hooks/useSettings";

const GameSettings: React.FC = () => {
	const { gameId } = useParams<{ gameId: string }>();
	const navigate = useNavigate();
	const { settings, updateSettings, resetSettings } = useSettings();

	const handleBack = () => {
		navigate(`/game/${gameId}`);
	};

	const handleToggleSound = () => {
		updateSettings({ soundEnabled: !settings.soundEnabled });
	};

	const handleToggleMusic = () => {
		updateSettings({ musicEnabled: !settings.musicEnabled });
	};

	const handleSoundVolumeChange = (volume: number) => {
		updateSettings({ soundVolume: volume });
	};

	const handleMusicVolumeChange = (volume: number) => {
		updateSettings({ musicVolume: volume });
	};

	const handleReset = () => {
		resetSettings();
	};

	return (
		<div className="relative flex h-dvh flex-col overflow-hidden bg-black text-white select-none">
			<div className="absolute inset-0 bg-[url('/stars-bg.jpg')] bg-cover opacity-50"></div>
			<div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950/60 to-purple-950/40"></div>

			<div className="relative z-10 flex h-full flex-col">
				{/* Header */}
				<div className="flex-shrink-0 border-b border-purple-700/30 bg-gray-900/80 backdrop-blur-md">
					<div className="flex items-center px-4 py-3">
						<button
							onClick={handleBack}
							className="mr-4 flex items-center justify-center rounded-lg p-2 text-purple-300 transition-colors hover:bg-purple-900/40 hover:text-purple-100"
						>
							<ArrowLeftIcon className="h-5 w-5" />
						</button>
						<h1 className="text-lg font-semibold text-white">Game Settings</h1>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-auto p-4">
					<div className="mx-auto max-w-2xl space-y-6">
						{/* Audio Settings */}
						<div className="rounded-lg border border-purple-700/30 bg-gray-900/40 p-6 backdrop-blur-sm">
							<h2 className="mb-4 text-xl font-semibold text-white">
								Audio Settings
							</h2>

							<div className="space-y-6">
								{/* Sound Effects Toggle */}
								<div className="flex items-center justify-between">
									<div>
										<label className="text-sm font-medium text-purple-200">
											Sound Effects
										</label>
										<p className="text-xs text-purple-300/70">
											Enable UI sounds and action feedback
										</p>
									</div>
									<button
										onClick={handleToggleSound}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none ${
											settings.soundEnabled ? "bg-purple-600" : "bg-gray-600"
										}`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												settings.soundEnabled
													? "translate-x-6"
													: "translate-x-1"
											}`}
										/>
									</button>
								</div>

								{/* Sound Volume */}
								<div
									className={`transition-opacity ${settings.soundEnabled ? "opacity-100" : "opacity-50"}`}
								>
									<label className="mb-2 block text-sm font-medium text-purple-200">
										Sound Volume: {Math.round(settings.soundVolume * 100)}%
									</label>
									<input
										type="range"
										min="0"
										max="1"
										step="0.1"
										value={settings.soundVolume}
										onChange={(e) =>
											handleSoundVolumeChange(Number(e.target.value))
										}
										disabled={!settings.soundEnabled}
										className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 disabled:cursor-not-allowed"
										style={{
											background: settings.soundEnabled
												? `linear-gradient(to right, rgb(147 51 234) 0%, rgb(147 51 234) ${settings.soundVolume * 100}%, rgb(55 65 81) ${settings.soundVolume * 100}%, rgb(55 65 81) 100%)`
												: "rgb(55 65 81)",
										}}
									/>
								</div>

								{/* Music Toggle */}
								<div className="flex items-center justify-between">
									<div>
										<label className="text-sm font-medium text-purple-200">
											Background Music
										</label>
										<p className="text-xs text-purple-300/70">
											Play ambient background music
										</p>
									</div>
									<button
										onClick={handleToggleMusic}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none ${
											settings.musicEnabled ? "bg-purple-600" : "bg-gray-600"
										}`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												settings.musicEnabled
													? "translate-x-6"
													: "translate-x-1"
											}`}
										/>
									</button>
								</div>

								{/* Music Volume */}
								<div
									className={`transition-opacity ${settings.musicEnabled ? "opacity-100" : "opacity-50"}`}
								>
									<label className="mb-2 block text-sm font-medium text-purple-200">
										Music Volume: {Math.round(settings.musicVolume * 100)}%
									</label>
									<input
										type="range"
										min="0"
										max="1"
										step="0.1"
										value={settings.musicVolume}
										onChange={(e) =>
											handleMusicVolumeChange(Number(e.target.value))
										}
										disabled={!settings.musicEnabled}
										className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 disabled:cursor-not-allowed"
										style={{
											background: settings.musicEnabled
												? `linear-gradient(to right, rgb(147 51 234) 0%, rgb(147 51 234) ${settings.musicVolume * 100}%, rgb(55 65 81) ${settings.musicVolume * 100}%, rgb(55 65 81) 100%)`
												: "rgb(55 65 81)",
										}}
									/>
								</div>
							</div>
						</div>

						{/* Reset Settings */}
						<div className="rounded-lg border border-purple-700/30 bg-gray-900/40 p-6 backdrop-blur-sm">
							<h2 className="mb-4 text-xl font-semibold text-white">
								Reset Settings
							</h2>
							<p className="mb-4 text-sm text-purple-300/70">
								Reset all settings to their default values.
							</p>
							<button
								onClick={handleReset}
								className="rounded-lg border border-red-600/50 bg-red-900/20 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-900/40 hover:text-red-200"
							>
								Reset to Defaults
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameSettings;
