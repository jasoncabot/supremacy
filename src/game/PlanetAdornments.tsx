import React from "react";
import {
	getAdornmentByTypeAndFaction,
	getHoverAdornmentByTypeAndFaction,
	type Faction,
} from "../adornments";

interface AdornmentConfig {
	type: "manufacturing" | "fleet" | "defence" | "mission";
	position: string;
	showForNeutral: boolean;
}

const ADORNMENT_CONFIGS: AdornmentConfig[] = [
	{
		type: "manufacturing",
		position: "absolute top-[-4px] left-[4px]",
		showForNeutral: true,
	},
	{
		type: "fleet",
		position: "absolute top-[-4px] right-[2px]",
		showForNeutral: false,
	},
	{
		type: "defence",
		position: "absolute bottom-0 left-[4px]",
		showForNeutral: true,
	},
	{
		type: "mission",
		position: "absolute right-[2px] bottom-0",
		showForNeutral: false,
	},
];

interface PlanetAdornmentsProps {
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
	faction,
	handlers = {},
	interactive = false,
}) => {
	const renderAdornment = (config: AdornmentConfig) => {
		const { type, position, showForNeutral } = config;

		// Skip if neutral faction and adornment shouldn't show for neutral
		if (faction === "neutral" && !showForNeutral) {
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
