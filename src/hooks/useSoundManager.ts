import { useCallback, useEffect, useRef } from "react";
import { music } from "../music/index.ts";
import { SoundType, sounds } from "../sounds/index.ts";
import { useSettings } from "./useSettings.ts";

interface SoundManager {
	playSound: (type: SoundType) => void;
	playBackgroundMusic: () => void;
	stopBackgroundMusic: () => void;
	setVolume: (volume: number) => void;
	setMusicVolume: (volume: number) => void;
}

export const useSoundManager = (): SoundManager => {
	const { settings } = useSettings();
	const audioCache = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
	const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const audioSourcesRef = useRef<Map<SoundType, MediaElementAudioSourceNode>>(
		new Map(),
	);
	const backgroundMusicSourceRef = useRef<MediaElementAudioSourceNode | null>(
		null,
	);

	// Initialize audio elements
	useEffect(() => {
		// Only initialize audio if either sound or music is enabled
		if (!settings.soundEnabled && !settings.musicEnabled) {
			return;
		}

		// Initialize AudioContext with user gesture handling
		const initializeAudioContext = () => {
			if (!audioContextRef.current) {
				try {
					audioContextRef.current = new (window.AudioContext ||
						(window as unknown as { webkitAudioContext: typeof AudioContext })
							.webkitAudioContext)();
					
					// Handle suspended context (due to autoplay policies)
					if (audioContextRef.current.state === 'suspended') {
						// Context will be resumed when user first interacts with audio
						console.info('AudioContext suspended - will resume on first user interaction');
					}
				} catch (error) {
					console.info("AudioContext not available, audio will be disabled:", error);
					return false;
				}
			}
			return true;
		};

		if (!initializeAudioContext()) {
			return;
		}

		// Capture current ref values at the start of the effect
		const currentAudioCache = audioCache.current;
		const currentBackgroundMusic = backgroundMusicRef.current;
		const currentAudioSources = audioSourcesRef.current;

		// Preload sound effects
		Object.entries(sounds).forEach(([type, src]) => {
			if (!currentAudioCache.has(type as SoundType)) {
				const audio = new Audio();
				audio.preload = "auto";
				audio.src = src;
				audio.volume = settings.soundVolume;

				// Handle loading errors gracefully
				audio.addEventListener("error", () => {
					console.info(`Sound file not available: ${src}`);
				});

				currentAudioCache.set(type as SoundType, audio);

				// Create MediaElementSource for Web Audio API if context is available
				if (audioContextRef.current) {
					try {
						const source =
							audioContextRef.current.createMediaElementSource(audio);
						source.connect(audioContextRef.current.destination);
						currentAudioSources.set(type as SoundType, source);
					} catch (error) {
						console.info(`Audio source not available for ${type}:`, error);
					}
				}
			}
		});

		// Initialize background music
		if (!currentBackgroundMusic) {
			const newBackgroundMusic = new Audio();
			newBackgroundMusic.src = music.first;
			newBackgroundMusic.loop = true;
			newBackgroundMusic.volume = settings.musicVolume;

			// Handle loading errors gracefully
			newBackgroundMusic.addEventListener("error", () => {
				console.info(`Background music file not available: ${music.first}`);
			});

			backgroundMusicRef.current = newBackgroundMusic;

			// Create MediaElementSource for background music if context is available
			if (audioContextRef.current) {
				try {
					const source =
						audioContextRef.current.createMediaElementSource(
							newBackgroundMusic,
						);
					source.connect(audioContextRef.current.destination);
					backgroundMusicSourceRef.current = source;
				} catch (error) {
					console.info(
						"Audio source not available for background music:",
						error,
					);
				}
			}
		}

		return () => {
			// Cleanup using the captured values
			currentAudioCache.forEach((audio) => {
				audio.pause();
				audio.currentTime = 0;
			});
			if (backgroundMusicRef.current) {
				backgroundMusicRef.current.pause();
			}
		};
	}, [settings.soundVolume, settings.musicVolume, settings.soundEnabled, settings.musicEnabled]);

	// Update volumes when settings change
	useEffect(() => {
		audioCache.current.forEach((audio) => {
			audio.volume = settings.soundVolume;
		});
		if (backgroundMusicRef.current) {
			backgroundMusicRef.current.volume = settings.musicVolume;
		}
	}, [settings.soundVolume, settings.musicVolume]);

	// Stop background music immediately when music is disabled
	useEffect(() => {
		if (!settings.musicEnabled && backgroundMusicRef.current) {
			backgroundMusicRef.current.pause();
		}
	}, [settings.musicEnabled]);

	const playSound = useCallback(
		(type: SoundType) => {
			if (!settings.soundEnabled) return;

			const audio = audioCache.current.get(type);
			if (audio) {
				try {
					// Resume AudioContext if suspended (handles autoplay policies)
					if (audioContextRef.current?.state === 'suspended') {
						audioContextRef.current.resume().catch((error) => {
							console.info('Could not resume AudioContext:', error);
						});
					}

					// Reset to start and play
					audio.currentTime = 0;
					audio.play().catch((error) => {
						// Ignore autoplay policy errors and silent mode
						if (error.name !== "NotAllowedError") {
							console.info(`Sound ${type} could not play:`, error);
						}
					});
				} catch (error) {
					console.info(`Failed to play sound ${type}:`, error);
				}
			}
		},
		[settings.soundEnabled],
	);

	const playBackgroundMusic = useCallback(() => {
		if (!settings.musicEnabled || !backgroundMusicRef.current) return;

		// Resume AudioContext if suspended (handles autoplay policies)
		if (audioContextRef.current?.state === 'suspended') {
			audioContextRef.current.resume().catch((error) => {
				console.info('Could not resume AudioContext:', error);
			});
		}

		backgroundMusicRef.current.play().catch((error) => {
			// Ignore autoplay policy errors and silent mode
			if (error.name !== "NotAllowedError") {
				console.info("Background music could not play:", error);
			}
		});
	}, [settings.musicEnabled]);

	const stopBackgroundMusic = useCallback(() => {
		if (backgroundMusicRef.current) {
			backgroundMusicRef.current.pause();
		}
	}, []);

	const setVolume = useCallback((volume: number) => {
		audioCache.current.forEach((audio) => {
			audio.volume = volume;
		});
	}, []);

	const setMusicVolume = useCallback((volume: number) => {
		if (backgroundMusicRef.current) {
			backgroundMusicRef.current.volume = volume;
		}
	}, []);

	return {
		playSound,
		playBackgroundMusic,
		stopBackgroundMusic,
		setVolume,
		setMusicVolume,
	};
};
