import React from "react";
import { PlanetView } from "../../worker/api";
import {
	getAdornmentByTypeAndFaction,
	getHoverAdornmentByTypeAndFaction,
	type Faction,
} from "../adornments";
import { getAvailablePlanetFeatures, type PlanetFeatureType } from "./planetFeatures";

interface AdornmentConfig {
	type: PlanetFeatureType;
	position: string;
}

const ADORNMENT_CONFIGS: AdornmentConfig[] = [
	{
		type: "manufacturing",
		position: "absolute top-[-4px] left-[4px]",
	},
	{
		type: "fleet",
		position: "absolute top-[-4px] right-[2px]",
	},
	{
		type: "defence",
		position: "absolute bottom-0 left-[4px]",
	},
	{
		type: "mission",
		position: "absolute right-[2px] bottom-0",
	},
];

interface PlanetAdornmentsProps {
	planet: PlanetView;
	faction: Faction;
	handlers?: {
		manufacturing?: (e: React.MouseEvent) => void;
		fleet?: (e: React.MouseEvent) => void;
		defence?: (e: React.MouseEvent) => void;
		mission?: (e: React.MouseEvent) => void;
	};
	interactive?: boolean;
}

const PlanetAdornments: React.FC<PlanetAdornmentsProps> = ({
	planet,
	faction,
	handlers = {},
	interactive = false,
}) => {
	// Get available features using shared logic
	const availableFeatures = getAvailablePlanetFeatures(planet, faction);
	const availableFeatureTypes = new Set(availableFeatures.map(f => f.type));

	const renderAdornment = (config: AdornmentConfig) => {
		const { type, position } = config;

		// Skip if this feature is not available for this planet/faction combination
		if (!availableFeatureTypes.has(type)) {
			return null;
		}

		const handler = handlers[type];
		const title = type.charAt(0).toUpperCase() + type.slice(1);

		if (interactive && handler) {
			// Desktop interactive version
			return (
				<button
					key={type}
					onClick={handler}
					className={`group ${position} cursor-pointer`}
					title={title}
				>
					<img
						src={getAdornmentByTypeAndFaction(type, faction)}
						alt={title}
						className="group-hover:hidden"
					/>
					<img
						src={getHoverAdornmentByTypeAndFaction(type, faction)}
						alt={title}
						className="hidden group-hover:block"
					/>
				</button>
			);
		} else {
			// Mobile/static version
			return (
				<div key={type} className={position}>
					<img src={getAdornmentByTypeAndFaction(type, faction)} alt={title} />
				</div>
			);
		}
	};

	return <>{ADORNMENT_CONFIGS.map(renderAdornment)}</>;
};

export default PlanetAdornments;
