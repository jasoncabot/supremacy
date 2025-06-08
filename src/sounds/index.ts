import filterSwitchWav from "./filter_switch.wav";
import itemCloseWav from "./item_close.wav";
import itemOpenWav from "./item_open.wav";
import sectorCloseWav from "./sector_close.wav";
import sectorOpenWav from "./sector_open.wav";

export const sounds = {
	filterSwitch: filterSwitchWav,
	itemClose: itemCloseWav,
	itemOpen: itemOpenWav,
	sectorClose: sectorCloseWav,
	sectorOpen: sectorOpenWav,
} as const;

export type SoundType = keyof typeof sounds;
