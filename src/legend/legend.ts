// Planet images by size and faction
import large_empire from "./large_empire.png";
import large_neutral from "./large_neutral.png";
import large_none from "./large_none.png";
import large_rebellion from "./large_rebellion.png";
import medium_empire from "./medium_empire.png";
import medium_neutral from "./medium_neutral.png";
import medium_none from "./medium_none.png";
import medium_rebellion from "./medium_rebellion.png";
import small_empire from "./small_empire.png";
import small_neutral from "./small_neutral.png";
import small_none from "./small_none.png";
import small_rebellion from "./small_rebellion.png";
import tiny_empire from "./tiny_empire.png";
import tiny_neutral from "./tiny_neutral.png";
import tiny_none from "./tiny_none.png";
import tiny_rebellion from "./tiny_rebellion.png";
import undiscovered from "./undiscovered.png";
import rebellion_hq from "./rebellion_hq.png";

export type PlanetSize = "tiny" | "small" | "medium" | "large";
export type PlanetOwner = "Empire" | "Rebellion" | "Neutral" | "None";

const planetImages = {
	large: {
		Empire: large_empire,
		Rebellion: large_rebellion,
		Neutral: large_neutral,
		None: large_none,
	},
	medium: {
		Empire: medium_empire,
		Rebellion: medium_rebellion,
		Neutral: medium_neutral,
		None: medium_none,
	},
	small: {
		Empire: small_empire,
		Rebellion: small_rebellion,
		Neutral: small_neutral,
		None: small_none,
	},
	tiny: {
		Empire: tiny_empire,
		Rebellion: tiny_rebellion,
		Neutral: tiny_neutral,
		None: tiny_none,
	},
	undiscovered,
	rebellion_hq,
} as const;

export function getPlanetSize(size: number): PlanetSize {
	if (size >= 4) return "large";
	if (size >= 3) return "medium";
	if (size >= 2) return "small";
	return "tiny";
}

export function getPlanetImage(
	discovered: boolean,
	owner: PlanetOwner | undefined,
	size: PlanetSize,
	isCapital?: boolean
): string {
	if (!discovered) {
		return planetImages.undiscovered;
	}

	if (isCapital && owner === "Rebellion") {
		return planetImages.rebellion_hq;
	}

	const ownerKey = owner || "None";
	return planetImages[size][ownerKey];
}