import {
	BatterySubtype,
	CapitalShipSubtype,
	CharacterIdentifiers,
	ConstructionYardSubtype,
	DefenseResource,
	ManufacturingResource,
	MineSubtype,
	PersonnelSubtype,
	RefinerySubtype,
	ShieldSubtype,
	ShipyardSubtype,
	SquadronSubtype,
	TrainingFacilitySubtype,
	TroopSubtype,
} from "../../worker/api";
// NOTE: Display names for resources are now in ../../worker/names.ts

// Character images
import adar_tallon from "./adar_tallon.png";
import afyon from "./afyon.png";
import amise_griff from "./amise_griff.png";
import arhul_narra from "./arhul_narra.png";
import bane_nothos from "./bane_nothos.png";
import bevel_lemelisk from "./bevel_lemelisk.png";
import bin_essada from "./bin_essada.png";
import borsk_feylya from "./borsk_feylya.png";
import brandei from "./brandei.png";
import bren_derlin from "./bren_derlin.png";
import carlist_rieekan from "./carlist_rieekan.png";
import chewbacca from "./chewbacca.png";
import crix_madine from "./crix_madine.png";
import darth_vader from "./darth_vader.png";
import dorja from "./dorja.png";
import firmus_piett from "./firmus_piett.png";
import freja_covell from "./freja_covell.png";
import garindan from "./garindan.png";
import garm_bel_iblis from "./garm_bel_iblis.png";
import gial_ackbar from "./gial_ackbar.png";
import gilad_pellaeon from "./gilad_pellaeon.png";
import grammel from "./grammel.png";
import han_solo from "./han_solo.png";
import hiram_drayson from "./hiram_drayson.png";
import huoba_neva from "./huoba_neva.png";
import jan_dodonna from "./jan_dodonna.png";
import judder_page from "./judder_page.png";
import kaiya_adrimetrum from "./kaiya_adrimetrum.png";
import kendal_ozzel from "./kendal_ozzel.png";
import labansat from "./labansat.png";
import lando_calrissian from "./lando_calrissian.png";
import leia_organa from "./leia_organa.png";
import lorth_needa from "./lorth_needa.png";
import luke_skywalker from "./luke_skywalker.png";
import ma_w_shiye from "./ma_w_shiye.png";
import maximilian_veers from "./maximilian_veers.png";
import mazer_rackus from "./mazer_rackus.png";
import menndo from "./menndo.png";
import mon_mothma from "./mon_mothma.png";
import natasi_daala from "./natasi_daala.png";
import niles_ferrier from "./niles_ferrier.png";
import noval_garaint from "./noval_garaint.png";
import orlok from "./orlok.png";
import orrimaarko from "./orrimaarko.png";
import palpatine from "./palpatine.png";
import pter_thanas from "./pter_thanas.png";
import roget_jiriss from "./roget_jiriss.png";
import sarin_virgilio from "./sarin_virgilio.png";
import shenir_rix from "./shenir_rix.png";
import syub_snunb from "./syub_snunb.png";
import talon_karrde from "./talon_karrde.png";
import terrinald_screed from "./terrinald_screed.png";
import thrawn from "./thrawn.png";
import tiaan_jerjerrod from "./tiaan_jerjerrod.png";
import titus_klev from "./titus_klev.png";
import tura_raftican from "./tura_raftican.png";
import vanden_willard from "./vanden_willard.png";
import villar from "./villar.png";
import wedge_antilles from "./wedge_antilles.png";
import zuggs from "./zuggs.png";

// Personnel non-character images
import bothan_spy from "./bothan_spy.png";
import commandos from "./commandos.png";
import espionage_droid from "./espionage_droid.png";
import guerilla from "./guerilla.png";
import infiltrator from "./infiltrator.png";
import longprobe_ywing from "./longprobe_ywing.png";
import noghri_death_commando from "./noghri_death_commando.png";
import probe_droid from "./probe_droid.png";

// Troop images
import alliance_army from "./alliance_army.png";
import alliance_fleet from "./alliance_fleet.png";
import dark_trooper from "./dark_trooper.png";
import imperial_army from "./imperial_army.png";
import imperial_fleet from "./imperial_fleet.png";
import mon_calamari from "./mon_calamari.png";
import stormtrooper from "./stormtrooper.png";
import sullustan from "./sullustan.png";
import war_droid from "./war_droid.png";
import wookiee from "./wookiee.png";

// Squadron images
import awing from "./awing.png";
import bwing from "./bwing.png";
import tie_bomber from "./tie_bomber.png";
import tie_defender from "./tie_defender.png";
import tie_fighter from "./tie_fighter.png";
import tie_interceptor from "./tie_interceptor.png";
import xwing from "./xwing.png";
import ywing from "./ywing.png";

// Shield images
import death_star_shield from "./death_star_shield.png";
import gencore1 from "./gencore1.png";
import gencore2 from "./gencore2.png";

// Battery images
import kdy150 from "./kdy150.png";
import lnr1 from "./lnr1.png";
import lnr2 from "./lnr2.png";

// Manufacturing images
import advanced_construction from "./advanced_construction.png";
import advanced_shipyard from "./advanced_shipyard.png";
import advanced_training from "./advanced_training.png";
import construction from "./construction.png";
import mine from "./mine.png";
import rawMaterial from "./raw_material.png";
import refinery from "./refinery.png";
import shipyard from "./shipyard.png";
import training from "./training.png";

// Ship images
import alliance_dreadnaught from "./alliance_dreadnaught.png";
import alliance_escort_carrier from "./alliance_escort_carrier.png";
import assault_frigate from "./assault_frigate.png";
import assault_transport from "./assault_transport.png";
import bulk_cruiser from "./bulk_cruiser.png";
import bulk_transport from "./bulk_transport.png";
import bulwark_battlecruiser from "./bulwark_battlecruiser.png";
import carrack_light_cruiser from "./carrack_light_cruiser.png";
import cc_7700_frigate from "./cc7700_frigate.png";
import cc_9600_frigate from "./cc9600_frigate.png";
import corellian_corvette from "./corellian_corvette.png";
import corellian_gunship from "./corellian_gunship.png";
import dauntless_cruiser from "./dauntless_cruiser.png";
import death_star from "./death_star.png";
import galleon from "./galleon.png";
import imperial_dreadnaught from "./imperial_dreadnaught.png";
import imperial_escort_carrier from "./imperial_escort_carrier.png";
import imperial_ii_star_destroyer from "./imperial_ii_star_destroyer.png";
import imperial_star_destroyer from "./imperial_star_destroyer.png";
import interdictor_cruiser from "./interdictor_cruiser.png";
import lancer_frigate from "./lancer_frigate.png";
import liberator_cruiser from "./liberator_cruiser.png";
import medium_transport from "./medium_transport.png";
import mon_calamari_cruiser from "./mon_calamari_cruiser.png";
import nebulon_b_frigate from "./nebulon_b_frigate.png";
import star_galleon from "./star_galleon.png";
import strike_cruiser from "./strike_cruiser.png";
import super_star_destroyer from "./super_star_destroyer.png";
import victory_destroyer from "./victory_star_destroyer.png";
import victory_ii_star_destroyer from "./victory_ii_star_destroyer.png";

// Character mapping
const characterImages: Record<CharacterIdentifiers, string> = {
	ackbar: gial_ackbar,
	adar_tallon: adar_tallon,
	afyon: afyon,
	bane_nothos: bane_nothos,
	bevel_lemelisk: bevel_lemelisk,
	bin_essada: bin_essada,
	borsk_feylya: borsk_feylya,
	brandei: brandei,
	bren_derlin: bren_derlin,
	carlist_rieekan: carlist_rieekan,
	chewbacca: chewbacca,
	covell: freja_covell,
	crix_madine: crix_madine,
	daala: natasi_daala,
	darth_vader: darth_vader,
	dorja: dorja,
	drayson: hiram_drayson,
	emperor_palpatine: palpatine,
	garindan: garindan,
	garm_bel_iblis: garm_bel_iblis,
	grammel: grammel,
	griff: amise_griff,
	han_solo: han_solo,
	huoba_neva: huoba_neva,
	jan_dodonna: jan_dodonna,
	jerjerrod: tiaan_jerjerrod,
	kaiya_andrimetrum: kaiya_adrimetrum,
	klev: titus_klev,
	labansat: labansat,
	lando_calrissian: lando_calrissian,
	leia_organa: leia_organa,
	luke_skywalker: luke_skywalker,
	mawshiye: ma_w_shiye,
	mazer_rackus: mazer_rackus,
	menndo: menndo,
	mon_mothma: mon_mothma,
	narra: arhul_narra,
	needa: lorth_needa,
	niles_ferrier: niles_ferrier,
	noval_garaint: noval_garaint,
	orlok: orlok,
	orrimaarko: orrimaarko,
	ozzel: kendal_ozzel,
	page: judder_page,
	pellaeon: gilad_pellaeon,
	piett: firmus_piett,
	pter_thanas: pter_thanas,
	roget_jiriss: roget_jiriss,
	sarin_virgilio: sarin_virgilio,
	screed: terrinald_screed,
	shenir_rix: shenir_rix,
	syub_snunb: syub_snunb,
	talon_karrde: talon_karrde,
	thrawn: thrawn,
	tura_raftican: tura_raftican,
	vanden_willard: vanden_willard,
	veers: maximilian_veers,
	villar: villar,
	wedge_antilles: wedge_antilles,
	zuggs: zuggs,
};

// Personnel non-character mapping
const personnelImages: Record<PersonnelSubtype, string> = {
	characters: luke_skywalker, // Default character image
	bothan_spies: bothan_spy,
	guerillas: guerilla,
	infiltrators: infiltrator,
	longprobe_y_wing_recon_team: longprobe_ywing,
	imperial_commandos: commandos,
	imperial_espionage_droid: espionage_droid,
	imperial_probe_droid: probe_droid,
	noghri_death_commandos: noghri_death_commando,
};

// Troop mapping
const troopImages: Record<TroopSubtype, string> = {
	alliance_army_regiment: alliance_army,
	alliance_fleet_regiment: alliance_fleet,
	mon_calamari_regiment: mon_calamari,
	sullustan_regiment: sullustan,
	wookie_regiment: wookiee,
	dark_trooper_regiment: dark_trooper,
	imperial_army_regiment: imperial_army,
	imperial_fleet_regiment: imperial_fleet,
	stormtrooper_regiment: stormtrooper,
	war_droid_regiment: war_droid,
};

// Squadron mapping
const squadronImages: Record<SquadronSubtype, string> = {
	a_wing: awing,
	b_wing: bwing,
	x_wing: xwing,
	y_wing: ywing,
	tie_bomber: tie_bomber,
	tie_defender: tie_defender,
	tie_fighter: tie_fighter,
	tie_interceptor: tie_interceptor,
};

// Shield mapping
const shieldImages: Record<ShieldSubtype, string> = {
	death_star_shield: death_star_shield,
	gen_core_level_i: gencore1,
	gen_core_level_ii: gencore2,
};

// Battery mapping
const batteryImages: Record<BatterySubtype, string> = {
	kdy_150: kdy150,
	lnr_series_i: lnr1,
	lnr_series_ii: lnr2,
};

const shipImages: Record<CapitalShipSubtype, string> = {
	alliance_dreadnaught: alliance_dreadnaught,
	alliance_escort_carrier: alliance_escort_carrier,
	assault_frigate: assault_frigate,
	assault_transport: assault_transport,
	bulk_cruiser: bulk_cruiser,
	bulk_transport: bulk_transport,
	bulwark_battlecruiser: bulwark_battlecruiser,
	carrack_light_cruiser: carrack_light_cruiser,
	cc_7700_frigate: cc_7700_frigate,
	cc_9600_frigate: cc_9600_frigate,
	corellian_corvette: corellian_corvette,
	corellian_gunship: corellian_gunship,
	dauntless_cruiser: dauntless_cruiser,
	death_star: death_star,
	galleon: galleon,
	imperial_dreadnaught: imperial_dreadnaught,
	imperial_escort_carrier: imperial_escort_carrier,
	imperial_ii_star_destroyer: imperial_ii_star_destroyer,
	imperial_star_destroyer: imperial_star_destroyer,
	interdictor_cruiser: interdictor_cruiser,
	lancer_frigate: lancer_frigate,
	liberator_cruiser: liberator_cruiser,
	medium_transport: medium_transport,
	mon_calamari_cruiser: mon_calamari_cruiser,
	nebulon_b_frigate: nebulon_b_frigate,
	star_galleon: star_galleon,
	strike_cruiser: strike_cruiser,
	super_star_destroyer: super_star_destroyer,
	victory_destroyer: victory_destroyer,
	victory_ii_star_destroyer: victory_ii_star_destroyer,
};

// Manufacturing mappings
const shipyardImages: Record<ShipyardSubtype, string> = {
	orbital_shipyard: shipyard,
	advanced_shipyard: advanced_shipyard,
};

const trainingFacilityImages: Record<TrainingFacilitySubtype, string> = {
	training_facility: training,
	advanced_training_facility: advanced_training,
};

const constructionYardImages: Record<ConstructionYardSubtype, string> = {
	construction_yard: construction,
	advanced_construction_yard: advanced_construction,
};

const refineryImages: Record<RefinerySubtype, string> = {
	refinery: refinery,
};

const mineImages: Record<MineSubtype, string> = {
	mine: mine,
};

export const rawMaterialImage = rawMaterial;

/**
 * Get the appropriate card image for a defense resource
 * @param resource - The defense resource to get the image for
 * @returns The image URL string
 */
export function getCardImage(resource: DefenseResource): string {
	switch (resource.type) {
		case "personnel":
			if (resource.subtype === "characters") {
				// For characters, use the resource ID to lookup the character image
				return (
					characterImages[resource.id as CharacterIdentifiers] ||
					characterImages["luke_skywalker"]
				); // fallback
			} else {
				// For other personnel, use the subtype
				return (
					personnelImages[resource.subtype] || personnelImages["bothan_spies"]
				); // fallback
			}

		case "troop":
			return (
				troopImages[resource.subtype] || troopImages["alliance_army_regiment"]
			); // fallback

		case "squadron":
			return squadronImages[resource.subtype] || squadronImages["x_wing"]; // fallback

		case "shield":
			return shieldImages[resource.subtype] || shieldImages["gen_core_level_i"]; // fallback

		case "battery":
			return batteryImages[resource.subtype] || batteryImages["kdy_150"]; // fallback
	}
}

/**
 * Get the appropriate card image for a manufacturing resource
 * @param resource - The manufacturing resource to get the image for
 * @returns The image URL string
 */
export function getManufacturingCardImage(
	resource: ManufacturingResource,
): string {
	switch (resource.type) {
		case "shipyard":
			return (
				shipyardImages[resource.subtype] || shipyardImages["orbital_shipyard"]
			); // fallback

		case "training_facility":
			return (
				trainingFacilityImages[resource.subtype] ||
				trainingFacilityImages["training_facility"]
			); // fallback

		case "construction_yard":
			return (
				constructionYardImages[resource.subtype] ||
				constructionYardImages["construction_yard"]
			); // fallback

		case "refinery":
			return refineryImages[resource.subtype] || refineryImages["refinery"]; // fallback

		case "mine":
			return mineImages[resource.subtype] || mineImages["mine"]; // fallback
	}
}

/**
 * Get the appropriate card image for a ship
 * @param subtype - The ship subtype to get the image for
 * @returns The image URL string
 */
export function getShipCardImage(subtype: CapitalShipSubtype): string {
	return shipImages[subtype];
}

/**
 * Get all available character images
 * @returns Record of character ID to image URL
 */
export function getCharacterImages(): Record<string, string> {
	return { ...characterImages };
}

/**
 * Get image for a specific character by ID
 * @param characterId - The character identifier
 * @returns The image URL or undefined if not found
 */
export function getCharacterImage(
	characterId: CharacterIdentifiers,
): string | undefined {
	return characterImages[characterId];
}

/**
 * Check if a character image exists
 * @param characterId - The character identifier
 * @returns True if the character image exists
 */
export function hasCharacterImage(characterId: string): boolean {
	return characterId in characterImages;
}
