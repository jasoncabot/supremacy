import React from "react";
import { PlanetView } from "../../worker/api";
import { type Faction } from "../adornments";
import { FilterType } from "./Filters";
import PlanetAdornments from "./PlanetAdornments";
import StarLegend from "./StarLegend";
import { ViewfinderCircleIcon } from "@heroicons/react/24/outline";
import { useSelectionContext } from "../hooks/useSelectionContext";

interface PlanetCoreProps {
	planet: PlanetView;
	faction: Faction;
	planetImageUrl: string;
	filter: FilterType;
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
	handlers,
	onPlanetClick,
	interactive = false,
}) => {
	const { selectionState } = useSelectionContext();
	const isTargetMode = selectionState === "awaiting-target";

	return (
		<div
			className={`relative flex items-center justify-center ${isTargetMode ? "cursor-pointer" : ""}`}
		>
			{/* Adornments positioned around planet - only show if discovered */}
			{planet.discovered && (
				<PlanetAdornments
					planet={planet}
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
				className={`h-[37px] w-[37px] shrink-0`}
				onClick={onPlanetClick}
			/>

			{/* Display targeting icon when in target selection mode */}
			{isTargetMode && (
				<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded">
					<ViewfinderCircleIcon className="h-10 w-10 text-red-500 drop-shadow-lg" />
				</div>
			)}
		</div>
	);
};

export default PlanetCore;
