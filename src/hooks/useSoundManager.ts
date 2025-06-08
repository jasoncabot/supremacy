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
		if (!audioContextRef.current) {
			try {
				audioContextRef.current = new (window.AudioContext ||
					(window as unknown as { webkitAudioContext: typeof AudioContext })
						.webkitAudioContext)();
			} catch (error) {
				console.warn("Could not create AudioContext:", error);
			}
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
					console.warn(`Failed to load sound file: ${src}`);
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
						console.warn(`Failed to create audio source for ${type}:`, error);
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
				console.warn(`Failed to load background music: ${music.first}`);
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
					console.warn(
						"Failed to create audio source for background music:",
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
	}, [settings.soundVolume, settings.musicVolume]);

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
					// Reset to start and play
					audio.currentTime = 0;
					audio.play().catch((error) => {
						// Ignore autoplay policy errors and silent mode
						if (error.name !== "NotAllowedError") {
							console.warn(`Failed to play sound ${type}:`, error);
						}
					});
				} catch (error) {
					console.warn(`Failed to play sound ${type}:`, error);
				}
			}
		},
		[settings.soundEnabled],
	);

	const playBackgroundMusic = useCallback(() => {
		if (!settings.musicEnabled || !backgroundMusicRef.current) return;

		backgroundMusicRef.current.play().catch((error) => {
			// Ignore autoplay policy errors and silent mode
			if (error.name !== "NotAllowedError") {
				console.warn("Failed to play background music:", error);
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
