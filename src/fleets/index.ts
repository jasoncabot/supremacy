import type { FactionMetadata } from "../../worker/api";

import empire_fleet_damage from './empire_fleet_damage.png';
import empire_fleet_enroute from './empire_fleet_en-route.png';
import empire_fleet from './empire_fleet.png';
import rebellion_fleet_damage from './rebellion_fleet_damage.png';
import rebellion_fleet_enroute from './rebellion_fleet_en-route.png';
import rebellion_fleet from './rebellion_fleet.png';

export {
  empire_fleet_damage,
  empire_fleet_enroute,
  empire_fleet,
  rebellion_fleet_damage,
  rebellion_fleet_enroute,
  rebellion_fleet
};

/**
 * Gets fleet image layers based on faction, status, and damage level
 * @param faction - The faction ("Empire" or "Rebellion")
 * @param isEnroute - Whether the fleet is en-route
 * @param isDamaged - Whether the fleet is damaged
 * @returns An array of image URLs to be layered (bottom to top)
 */
export const getFleetImageLayers = (
  faction: FactionMetadata, 
  isEnroute: boolean, 
  isDamaged: boolean
): string[] => {
  const layers: string[] = [];
  
  // Bottom layer: en-route status
  if (isEnroute) {
    layers.push(faction === "Empire" ? empire_fleet_enroute : rebellion_fleet_enroute);
  }
  
  // Middle layer: faction fleet base image
  layers.push(faction === "Empire" ? empire_fleet : rebellion_fleet);
  
  // Top layer: damage overlay (if applicable)
  if (isDamaged) {
    layers.push(faction === "Empire" ? empire_fleet_damage : rebellion_fleet_damage);
  }
  
  return layers;
};
