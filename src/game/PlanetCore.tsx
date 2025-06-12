import React from "react";
import { PlanetView } from "../../worker/api";
import { type Faction } from "../adornments";
import { FilterType } from "./Filters";
import PlanetAdornments from "./PlanetAdornments";
import StarLegend from "./StarLegend";

interface PlanetCoreProps {
	planet: PlanetView;
	faction: Faction;
	planetImageUrl: string;
	filter: FilterType;
	selectionState: string;
	handlers?: {
		manufacturing?: (e: React.MouseEvent) => void;
		fleet?: (e: React.MouseEvent) => void;
		defence?: (e: React.MouseEvent) => void;
		mission?: (e: React.MouseEvent) => void;
	};
	onPlanetClick?: (e: React.MouseEvent) => void;
	interactive?: boolean;
}

const PlanetCore: React.FC<PlanetCoreProps> = ({
	planet,
	faction,
	planetImageUrl,
	filter,
	selectionState,
	handlers,
	onPlanetClick,
	interactive = false,
}) => {
	return (
		<div className="relative flex items-center justify-center">
			{/* Adornments positioned around planet - only show if discovered */}
			{planet.discovered && (
				<PlanetAdornments
					faction={faction}
					handlers={handlers}
					interactive={interactive}
				/>
			)}

			{/* Star Legend - positioned to the right of defence adornment */}
			<div className="absolute bottom-[-4px] left-[12px] z-20 h-[15px] w-[15px]">
				<StarLegend planet={planet} filter={filter} />
			</div>

			{/* Planet image */}
			<img
				src={planetImageUrl}
				alt={planet.metadata.name}
				title={planet.metadata.name}
				className="h-[37px] w-[37px] shrink-0"
				onClick={onPlanetClick}
				style={{
					cursor: selectionState === "awaiting-target" ? "pointer" : "default",
				}}
			/>
		</div>
	);
};

export default PlanetCore;
