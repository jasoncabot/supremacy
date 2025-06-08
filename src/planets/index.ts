// Planet images
import planet1 from './planet1.png';
import planet2 from './planet2.png';
import planet3 from './planet3.png';
import planet4 from './planet4.png';
import planet5 from './planet5.png';
import planet6 from './planet6.png';
import planet7 from './planet7.png';
import planet8 from './planet8.png';
import planet9 from './planet9.png';
import planet10 from './planet10.png';
import planet11 from './planet11.png';
import planet12 from './planet12.png';
import planet13 from './planet13.png';
import planet14 from './planet14.png';
import planet15 from './planet15.png';
import planet16 from './planet16.png';
import planet17 from './planet17.png';
import planet18 from './planet18.png';
import planet19 from './planet19.png';
import planet20 from './planet20.png';
import planet21 from './planet21.png';
import planet22 from './planet22.png';
import planet23 from './planet23.png';
import planet24 from './planet24.png';
import planet25 from './planet25.png';
import planet26 from './planet26.png';
import planetDestroyed from './planetdestroyed.png';

// Export all planet images
export {
  planet1,
  planet2,
  planet3,
  planet4,
  planet5,
  planet6,
  planet7,
  planet8,
  planet9,
  planet10,
  planet11,
  planet12,
  planet13,
  planet14,
  planet15,
  planet16,
  planet17,
  planet18,
  planet19,
  planet20,
  planet21,
  planet22,
  planet23,
  planet24,
  planet25,
  planet26,
  planetDestroyed,
};

// Array of all planet images for easy access
export const planetImages = [
  planet1,
  planet2,
  planet3,
  planet4,
  planet5,
  planet6,
  planet7,
  planet8,
  planet9,
  planet10,
  planet11,
  planet12,
  planet13,
  planet14,
  planet15,
  planet16,
  planet17,
  planet18,
  planet19,
  planet20,
  planet21,
  planet22,
  planet23,
  planet24,
  planet25,
  planet26,
];

/**
 * Get a planet image by ID
 * @param id - Planet ID (1-26)
 * @param destroyed - Whether to return the destroyed planet image
 * @returns The planet image URL
 */
export function getPlanetById(id: number, destroyed: boolean = false): string {
  if (destroyed) {
    return planetDestroyed;
  }
  
  if (id < 1 || id > 26) {
    console.warn(`Invalid planet ID: ${id}. Must be between 1 and 26. Defaulting to planet 1.`);
    return planet1;
  }
  
  return planetImages[id - 1]; // Convert to 0-based index
}

/**
 * Get a random planet image
 * @param destroyed - Whether to return the destroyed planet image
 * @returns A random planet image URL
 */
export function getRandomPlanet(destroyed: boolean = false): string {
  if (destroyed) {
    return planetDestroyed;
  }
  
  const randomId = Math.floor(Math.random() * 26) + 1;
  return getPlanetById(randomId);
}

/**
 * Get the total number of available planets
 * @returns The number of planet images available
 */
export function getPlanetCount(): number {
  return planetImages.length;
}
