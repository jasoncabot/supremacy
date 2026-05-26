import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { useSettings } from "../hooks/useSettings";
import { SoundContext, SoundContextType } from "../hooks/useSound";
import { music } from "../music";
import { SoundType, sounds } from "../sounds";

/**
 * Owns all audio for the game as a single instance. Plays HTMLAudioElements
 * directly — no Web Audio graph, which previously routed every sound through a
 * suspended AudioContext and silently swallowed it. Sound effects are triggered
 * by user gestures so they satisfy autoplay policy; background music can't
 * autostart, so it's kicked off on the first user interaction instead.
 */
export const SoundProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { settings } = useSettings();

	// Read settings through a ref so the play callbacks stay referentially
	// stable (no consumer re-renders when volumes change) yet always see the
	// latest values.
	const settingsRef = useRef(settings);
	useEffect(() => {
		settingsRef.current = settings;
	}, [settings]);

	const soundCacheRef = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
	const musicRef = useRef<HTMLAudioElement | null>(null);

	const getSound = useCallback((type: SoundType): HTMLAudioElement => {
		let audio = soundCacheRef.current.get(type);
		if (!audio) {
			audio = new Audio(sounds[type]);
			audio.preload = "auto";
			audio.addEventListener("error", () =>
				console.info(`Sound file not available: ${sounds[type]}`),
			);
			soundCacheRef.current.set(type, audio);
		}
		audio.volume = settingsRef.current.soundVolume;
		return audio;
	}, []);

	const getMusic = useCallback((): HTMLAudioElement => {
		if (!musicRef.current) {
			const audio = new Audio(music.first);
			audio.loop = true;
			audio.preload = "none"; // the track is large; don't fetch until needed
			audio.volume = settingsRef.current.musicVolume;
			audio.addEventListener("error", () =>
				console.info(`Background music not available: ${music.first}`),
			);
			musicRef.current = audio;
		}
		return musicRef.current;
	}, []);

	const playSound = useCallback(
		(type: SoundType) => {
			if (!settingsRef.current.soundEnabled) return;
			const audio = getSound(type);
			audio.currentTime = 0;
			audio.play().catch((error: DOMException) => {
				if (error.name !== "NotAllowedError") {
					console.info(`Sound ${type} could not play:`, error);
				}
			});
		},
		[getSound],
	);

	const playBackgroundMusic = useCallback(() => {
		if (!settingsRef.current.musicEnabled) return;
		const audio = getMusic();
		audio.play().catch((error: DOMException) => {
			if (error.name !== "NotAllowedError") {
				console.info("Background music could not play:", error);
			}
		});
	}, [getMusic]);

	const stopBackgroundMusic = useCallback(() => {
		musicRef.current?.pause();
	}, []);

	// Keep a playing music track's volume in sync, and stop it the moment music
	// is disabled.
	useEffect(() => {
		if (musicRef.current) musicRef.current.volume = settings.musicVolume;
	}, [settings.musicVolume]);
	useEffect(() => {
		if (!settings.musicEnabled) musicRef.current?.pause();
	}, [settings.musicEnabled]);

	// Browsers block audio until the user interacts with the page. Start music
	// (if enabled) on the first gesture, then stop listening.
	useEffect(() => {
		const unlock = () => {
			if (settingsRef.current.musicEnabled) {
				const audio = getMusic();
				if (audio.paused) playBackgroundMusic();
			}
			window.removeEventListener("pointerdown", unlock);
			window.removeEventListener("keydown", unlock);
		};
		window.addEventListener("pointerdown", unlock);
		window.addEventListener("keydown", unlock);
		return () => {
			window.removeEventListener("pointerdown", unlock);
			window.removeEventListener("keydown", unlock);
		};
	}, [getMusic, playBackgroundMusic]);

	// Pause everything on unmount.
	useEffect(() => {
		const soundCache = soundCacheRef.current;
		return () => {
			soundCache.forEach((audio) => audio.pause());
			musicRef.current?.pause();
		};
	}, []);

	const value = useMemo<SoundContextType>(
		() => ({ playSound, playBackgroundMusic, stopBackgroundMusic }),
		[playSound, playBackgroundMusic, stopBackgroundMusic],
	);

	return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};
