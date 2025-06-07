import {
	CharacterIdentifiers,
	PersonnelSubtype,
	TroopSubtype,
	SquadronSubtype,
	ShieldSubtype,
	BatterySubtype,
} from "./api";

/**
 * Display names for all character identifiers
 */
export const characterNames: Record<CharacterIdentifiers, string> = {
	"ackbar": "Admiral Ackbar",
	"adar_tallon": "Adar Tallon",
	"afyon": "Afyon",
	"bane_nothos": "Bane Nothos",
	"bevel_lemelisk": "Bevel Lemelisk",
	"bin_essada": "Bin Essada",
	"borsk_feylya": "Borsk Fey'lya",
	"brandei": "Brandei",
	"bren_derlin": "Bren Derlin",
	"carlist_rieekan": "Carlist Rieekan",
	"chewbacca": "Chewbacca",
	"covell": "Freja Covell",
	"crix_madine": "Crix Madine",
	"daala": "Admiral Daala",
	"darth_vader": "Darth Vader",
	"dorja": "Captain Dorja",
	"drayson": "Hiram Drayson",
	"emperor_palpatine": "Emperor Palpatine",
	"garindan": "Garindan",
	"garm_bel_iblis": "Garm Bel Iblis",
	"grammel": "Colonel Grammel",
	"griff": "Amise Griff",
	"han_solo": "Han Solo",
	"huoba_neva": "Huoba Neva",
	"jan_dodonna": "General Dodonna",
	"jerjerrod": "Moff Jerjerrod",
	"kaiya_andrimetrum": "Kaiya Andrimetrum",
	"klev": "Titus Klev",
	"labansat": "Labansat",
	"lando_calrissian": "Lando Calrissian",
	"leia_organa": "Princess Leia",
	"luke_skywalker": "Luke Skywalker",
	"mawshiye": "Ma'w'shiye",
	"mazer_rackus": "Mazer Rackus",
	"menndo": "Menndo",
	"mon_mothma": "Mon Mothma",
	"narra": "Arhul Narra",
	"needa": "Captain Needa",
	"niles_ferrier": "Niles Ferrier",
	"noval_garaint": "Noval Garaint",
	"orlok": "Orlok",
	"orrimaarko": "Orrimaarko",
	"ozzel": "Admiral Ozzel",
	"page": "Judder Page",
	"pellaeon": "Captain Pellaeon",
	"piett": "Admiral Piett",
	"pter_thanas": "Pter Thanas",
	"roget_jiriss": "Roget Jiriss",
	"sarin_virgilio": "Sarin Virgilio",
	"screed": "Admiral Screed",
	"shenir_rix": "Shenir Rix",
	"syub_snunb": "Syub Snunb",
	"talon_karrde": "Talon Karrde",
	"thrawn": "Grand Admiral Thrawn",
	"tura_raftican": "Tura Raftican",
	"vanden_willard": "Vanden Willard",
	"veers": "General Veers",
	"villar": "Villar",
	"wedge_antilles": "Wedge Antilles",
	"zuggs": "Zuggs",
};

/**
 * Display names for personnel subtypes
 */
export const personnelNames: Record<PersonnelSubtype, string> = {
	"characters": "Character", // This is used for the character type itself
	"bothan_spies": "Bothan Spy Network",
	"guerillas": "Guerrilla Cell",
	"infiltrators": "Infiltrator Team",
	"longprobe_y_wing_recon_team": "Longprobe Y-Wing Recon",
	"imperial_commandos": "Imperial Commandos",
	"imperial_espionage_droid": "Espionage Droid",
	"imperial_probe_droid": "Probe Droid",
	"noghri_death_commandos": "Noghri Death Commandos",
};

/**
 * Display names for troop subtypes
 */
export const troopNames: Record<TroopSubtype, string> = {
	"alliance_army_regiment": "Alliance Army Regiment",
	"alliance_fleet_regiment": "Alliance Fleet Regiment", 
	"mon_calamari_regiment": "Mon Calamari Regiment",
	"sullustan_regiment": "Sullustan Regiment",
	"wookie_regiment": "Wookiee Regiment",
	"dark_trooper_regiment": "Dark Trooper Regiment",
	"imperial_army_regiment": "Imperial Army Regiment",
	"imperial_fleet_regiment": "Imperial Fleet Regiment",
	"stormtrooper_regiment": "Stormtrooper Regiment",
	"war_droid_regiment": "War Droid Regiment",
};

/**
 * Display names for squadron subtypes
 */
export const squadronNames: Record<SquadronSubtype, string> = {
	"a_wing": "A-Wing Squadron",
	"b_wing": "B-Wing Squadron",
	"x_wing": "X-Wing Squadron",
	"y_wing": "Y-Wing Squadron",
	"tie_bomber": "TIE Bomber Squadron",
	"tie_defender": "TIE Defender Squadron",
	"tie_fighter": "TIE Fighter Squadron",
	"tie_interceptor": "TIE Interceptor Squadron",
};

/**
 * Display names for shield subtypes
 */
export const shieldNames: Record<ShieldSubtype, string> = {
	"death_star_shield": "Death Star Shield",
	"gen_core_level_i": "GenCore Level I Shield",
	"gen_core_level_ii": "GenCore Level II Shield",
};

/**
 * Display names for battery subtypes
 */
export const batteryNames: Record<BatterySubtype, string> = {
	"kdy_150": "KDY-150 Ion Cannon",
	"lnr_series_i": "LNR Series I Turbolaser",
	"lnr_series_ii": "LNR Series II Turbolaser",
};

/**
 * Get the display name for a character by their identifier
 */
export function getCharacterName(characterId: CharacterIdentifiers): string {
	return characterNames[characterId];
}

/**
 * Get the display name for a personnel subtype
 */
export function getPersonnelName(subtype: PersonnelSubtype): string {
	return personnelNames[subtype];
}

/**
 * Get the display name for a troop subtype
 */
export function getTroopName(subtype: TroopSubtype): string {
	return troopNames[subtype];
}

/**
 * Get the display name for a squadron subtype
 */
export function getSquadronName(subtype: SquadronSubtype): string {
	return squadronNames[subtype];
}

/**
 * Get the display name for a shield subtype
 */
export function getShieldName(subtype: ShieldSubtype): string {
	return shieldNames[subtype];
}

/**
 * Get the display name for a battery subtype
 */
export function getBatteryName(subtype: BatterySubtype): string {
	return batteryNames[subtype];
}
