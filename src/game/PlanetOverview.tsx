import React from "react";
import { PlanetView } from "../../worker/api";
import { getAdornmentByTypeAndFaction, type Faction } from "../adornments";
import { useSelectionContext } from "../hooks/useSelectionContext";
import { useWindowContext } from "../hooks/useWindowContext";
import { getPlanetById } from "../planets";
import { FilterType } from "./Filters";
import PlanetMobileMenu from "./PlanetMobileMenu";

interface PlanetOverviewProps {
	planet: PlanetView;
	filter: FilterType;
}

const PlanetOverview: React.FC<PlanetOverviewProps> = ({ planet }) => {
	const { handleOpenWindow } = useWindowContext();
	const { selectionState, selectItem } = useSelectionContext();

	const handleViewFleets = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event from bubbling to parent window
		// Get the click position
		const position = {
			x: e.clientX - 150, // Center window horizontally near click
			y: e.clientY - 50, // Position window vertically near click with offset for header
		};

		handleOpenWindow({
			id: `fleets-${planet.metadata.id}`,
			title: `Fleets on ${planet.metadata.name}`,
			type: "fleets",
			planetId: planet.metadata.id,
			sectorId: planet.metadata.sectorId,
			position: position, // Pass the click position
		});
	};

	const handleViewDefence = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event from bubbling to parent window
		const position = {
			x: e.clientX - 150,
			y: e.clientY - 50,
		};

		handleOpenWindow({
			id: `defence-${planet.metadata.id}`,
			title: `Defence Overview for ${planet.metadata.name}`,
			type: "defence",
			planetId: planet.metadata.id,
			sectorId: planet.metadata.sectorId,
			position: position,
		});
	};

	const handleViewManufacturing = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event from bubbling to parent window
		const position = {
			x: e.clientX - 150,
			y: e.clientY - 50,
		};

		handleOpenWindow({
			id: `manufacturing-${planet.metadata.id}`,
			title: `Manufacturing Overview for ${planet.metadata.name}`,
			type: "manufacturing",
			planetId: planet.metadata.id,
			sectorId: planet.metadata.sectorId,
			position: position,
		});
	};

	const handleViewMissions = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event from bubbling to parent window
		const position = {
			x: e.clientX - 150,
			y: e.clientY - 50,
		};

		handleOpenWindow({
			id: `missions-${planet.metadata.id}`,
			title: `Missions on ${planet.metadata.name}`,
			type: "missions",
			planetId: planet.metadata.id,
			sectorId: planet.metadata.sectorId,
			position: position,
		});
	};

	const handlePlanetSelected = () => {
		// If we're in target selection mode, select this planet as the target
		if (selectionState === "awaiting-target") {
			const planetAsSelectableItem = {
				...planet,
				type: "planet" as const,
				id: planet.metadata.id,
			};
			selectItem(planetAsSelectableItem);
		}
		// If no selection is in progress, the mobile menu will handle the interaction
		// (for desktop, the adornment buttons are always visible)
	};

	const usedEnergy = 1; // TODO: count the manufacturing units that take energy
	const totalEnergy = planet.state?.energySpots || 0;
	const unusedEnergy = totalEnergy - usedEnergy;

	const usedResources = planet.state?.manufacturing?.mines.length || 0;
	const totalResources = planet.state?.naturalResources || 0;
	const unusedResources = totalResources - usedResources;

	const loyalty = planet.state?.loyalty || 0;

	const planetImageUrl = getPlanetById(
		planet.metadata.picture,
		planet.state?.isDestroyed,
	);

	// Determine faction for adornment icons
	const faction: Faction =
		planet.state?.owner === "Neutral"
			? "neutral"
			: planet.state?.owner || "neutral";

	return (
		<div className="items-left flex h-[80px] w-[60px] flex-col justify-center rounded-lg p-2 text-white">
			{/* Mobile: Show menu on tap, Desktop: Always show adornments */}
			<div className="md:hidden">
				{/* Mobile - Show menu only if not in target selection mode */}
				{selectionState !== "awaiting-target" ? (
					<PlanetMobileMenu
						planet={planet}
						onFleets={handleViewFleets}
						onDefence={handleViewDefence}
						onManufacturing={handleViewManufacturing}
						onMissions={handleViewMissions}
					>
						<div>
							{/* planet image */}
							<div className="mb-1 flex items-center justify-between">
								<img
									src={planetImageUrl}
									alt={planet.metadata.name}
									title={planet.metadata.name}
									className="h-[30px] w-[30px] rounded-full"
								/>
							</div>
						</div>
					</PlanetMobileMenu>
				) : (
					/* Target selection mode - just show clickable planet */
					<div onClick={handlePlanetSelected} className="cursor-pointer">
						<div className="mb-1 flex items-center justify-between">
							<img
								src={planetImageUrl}
								alt={planet.metadata.name}
								title={planet.metadata.name}
								className="h-[30px] w-[30px] rounded-full"
							/>
						</div>
					</div>
				)}
			</div>

			{/* Desktop - Always show planet image and adornments */}
			<div className="hidden md:block">
				{/* planet image */}
				<div className="mb-1 flex items-center justify-between">
					<img
						src={planetImageUrl}
						alt={planet.metadata.name}
						title={planet.metadata.name}
						className="h-[30px] w-[30px] rounded-full"
						onClick={
							selectionState === "awaiting-target"
								? handlePlanetSelected
								: undefined
						}
						style={{
							cursor:
								selectionState === "awaiting-target" ? "pointer" : "default",
						}}
					/>
				</div>

				{/* Adornments only visible on md+ devices */}
				<div className="mb-1">
					<div className="flex flex-row gap-1">
						{faction !== "neutral" && (
							<button
								onClick={handleViewFleets}
								className="hover:opacity-80"
								title="Fleets"
							>
								<img
									src={getAdornmentByTypeAndFaction("fleet", faction)}
									alt="Fleets"
								/>
							</button>
						)}
						<button
							onClick={handleViewDefence}
							className="hover:opacity-80"
							title="Defence"
						>
							<img
								src={getAdornmentByTypeAndFaction("defence", faction)}
								alt="Defence"
							/>
						</button>
						<button
							onClick={handleViewManufacturing}
							className="hover:opacity-80"
							title="Manufacturing"
						>
							<img
								src={getAdornmentByTypeAndFaction("manufacturing", faction)}
								alt="Manufacturing"
							/>
						</button>
						{faction !== "neutral" && (
							<button
								onClick={handleViewMissions}
								className="hover:opacity-80"
								title="Missions"
							>
								<img
									src={getAdornmentByTypeAndFaction("mission", faction)}
									alt="Missions"
								/>
							</button>
						)}
					</div>
				</div>
			</div>

			{/* energy spots */}
			<div
				className="mb-1 flex"
				title={`${usedEnergy} / ${totalEnergy} Energy`}
			>
				{Array.from({ length: usedEnergy }).map((_, index) => (
					<div
						key={index}
						className="h-[6px] w-[4px] border-l border-gray-400 bg-white"
					/>
				))}
				{Array.from({ length: unusedEnergy }).map((_, index) => (
					<div
						key={index}
						className="h-[6px] w-[4px] border-l border-gray-400 bg-blue-500"
					/>
				))}
			</div>

			{/* natural resources */}
			<div
				className="mb-1 flex"
				title={`${usedResources} / ${totalResources} Resources`}
			>
				{Array.from({ length: usedResources }).map((_, index) => (
					<div
						key={index}
						className="h-[6px] w-[4px] border-l border-gray-400 bg-yellow-500"
					/>
				))}
				{Array.from({ length: unusedResources }).map((_, index) => (
					<div
						key={index}
						className="h-[6px] w-[4px] border-l border-gray-400 bg-red-500"
					/>
				))}
			</div>

			{/* popular support */}
			<div className="mb-1 flex text-xs" title={`Popular support ${loyalty}%`}>
				{loyalty}%
			</div>

			<div className="text-xs">{planet.metadata.name}</div>
		</div>
	);
};

export default PlanetOverview;
