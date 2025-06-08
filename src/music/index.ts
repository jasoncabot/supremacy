import bg_301 from "./301.wav";

export const music = {
	first: bg_301,
} as const;

export type MusicType = keyof typeof music;
