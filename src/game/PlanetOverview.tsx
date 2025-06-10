import React from "react";
import { PlanetView } from "../../worker/api";
import {
	getAdornmentByTypeAndFaction,
	getHoverAdornmentByTypeAndFaction,
	type Faction,
} from "../adornments";
import { useGame } from "../hooks/useGame";
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
	const { game } = useGame();

	const handleViewFleets = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event from bubbling to parent container
		// Get the click position, constrained to keep within top 25% of viewport
		const maxY = Math.max(0, window.innerHeight * 0.25 - 48);
		const position = {
			x: e.clientX - 150, // Center window horizontally near click
			y: Math.min(e.clientY - 50, maxY), // Position within top 25% of viewport
		};

		handleOpenWindow({
			id: `fleets-${planet.metadata.id}`,
			title: `Fleets on ${planet.metadata.name}`,
			type: "fleets",
			planetId: planet.metadata.id,
			sectorId: planet.metadata.sectorId,
			position: position,
		});
	};

	const handleViewDefence = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event from bubbling to parent container
		const maxY = Math.max(0, window.innerHeight * 0.25 - 48);
		const position = {
			x: e.clientX - 150,
			y: Math.min(e.clientY - 50, maxY),
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
		e.stopPropagation(); // Prevent event from bubbling to parent container
		const maxY = Math.max(0, window.innerHeight * 0.25 - 48);
		const position = {
			x: e.clientX - 150,
			y: Math.min(e.clientY - 50, maxY),
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
		e.stopPropagation(); // Prevent event from bubbling to parent container
		const maxY = Math.max(0, window.innerHeight * 0.25 - 48);
		const position = {
			x: e.clientX - 150,
			y: Math.min(e.clientY - 50, maxY),
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

	// Handle container click for mobile - allows tapping anywhere on the planet overview
	const handleContainerClick = () => {
		// Only handle container clicks on mobile (when adornments are hidden)
		// On desktop, individual buttons handle their own clicks
		const isMobile = window.innerWidth < 768; // md breakpoint
		if (isMobile) {
			if (selectionState === "awaiting-target") {
				handlePlanetSelected();
			}
			// For non-target selection, the PlanetMobileMenu will handle the interaction
		}
	};

	// used energy is the number of refineries + shipyards + construction facilities + troop factories + shields + batteries
	const usedEnergy = planet.state?.manufacturing
		? planet.state.manufacturing.refineries.length +
			planet.state.manufacturing.shipyards.length +
			planet.state.manufacturing.construction_yards.length +
			planet.state.manufacturing.training_facilities.length +
			(planet.state.defenses?.shields.length || 0) +
			(planet.state.defenses?.batteries.length || 0)
		: 0;
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

	// Calculate loyalty bar colors based on player's faction
	const playerFaction = game?.side || "Empire";
	const isPlayerEmpire = playerFaction === "Empire";

	// If player is Empire: green for empire loyalty, red for rebellion loyalty
	// If player is Rebellion: green for rebellion loyalty, red for empire loyalty
	const loyaltyToPlayer = loyalty;
	const loyaltyToOpponent = 100 - loyalty;

	const playerColor = isPlayerEmpire ? "bg-green-500" : "bg-green-500";
	const opponentColor = isPlayerEmpire ? "bg-red-500" : "bg-red-500";

	// Calculate planet name color based on faction and discovery status
	const getPlanetNameColor = () => {
		if (!planet.discovered) {
			return "text-gray-400"; // Light grey for undiscovered planets
		}

		if (planet.state?.owner === "Neutral") {
			return "text-cyan-400"; // Turquoise for neutral planets
		}

		if (planet.state?.owner === "Empire") {
			return "text-red-500"; // Red for Empire (matching loyalty bar)
		}

		if (planet.state?.owner === "Rebellion") {
			return "text-green-500"; // Green for Rebellion (matching loyalty bar)
		}

		return "text-gray-400"; // Default fallback
	};

	return (
		<div
			className="items-left flex h-[120px] w-[80px] cursor-pointer flex-col justify-center rounded-lg p-2 text-white md:cursor-default"
			onClick={handleContainerClick}
		>
			{/* Planet with adornments positioned around it - same layout for mobile and desktop */}
			<div className="relative mb-2">
				{/* Mobile: Wrap entire planet area with menu when not in target selection mode */}
				{selectionState !== "awaiting-target" ? (
					<div className="md:hidden">
						<PlanetMobileMenu
							planet={planet}
							onFleets={handleViewFleets}
							onDefence={handleViewDefence}
							onManufacturing={handleViewManufacturing}
							onMissions={handleViewMissions}
						>
							{/* Planet with positioned adornments */}
							<div className="relative flex items-center justify-center">
								{/* Adornments positioned around planet - only show if discovered */}
								{planet.discovered && (
									<>
										{/* Top left - Manufacturing */}
										<div className="absolute top-[-4px] left-[4px]">
											<img
												src={getAdornmentByTypeAndFaction(
													"manufacturing",
													faction,
												)}
												alt="Manufacturing"
											/>
										</div>

										{/* Top right - Fleets (only for non-neutral) */}
										{faction !== "neutral" && (
											<div className="absolute top-[-4px] right-[2px]">
												<img
													src={getAdornmentByTypeAndFaction("fleet", faction)}
													alt="Fleets"
												/>
											</div>
										)}

										{/* Bottom left - Defence */}
										<div className="absolute bottom-0 left-[4px]">
											<img
												src={getAdornmentByTypeAndFaction("defence", faction)}
												alt="Defence"
											/>
										</div>

										{/* Bottom right - Missions (only for non-neutral) */}
										{faction !== "neutral" && (
											<div className="absolute right-[2px] bottom-0">
												<img
													src={getAdornmentByTypeAndFaction("mission", faction)}
													alt="Missions"
												/>
											</div>
										)}
									</>
								)}

								{/* Planet image */}
								<img
									src={planetImageUrl}
									alt={planet.metadata.name}
									title={planet.metadata.name}
									className="h-[37px] w-[37px]"
								/>
							</div>
						</PlanetMobileMenu>
					</div>
				) : (
					/* Target selection mode - show planet with adornments, container handles click */
					<div className="md:hidden">
						<div className="relative flex items-center justify-center">
							{/* Adornments positioned around planet - only show if discovered */}
							{planet.discovered && (
								<>
									{/* Top left - Manufacturing */}
									<div className="absolute top-[-4px] left-[4px]">
										<img
											src={getAdornmentByTypeAndFaction(
												"manufacturing",
												faction,
											)}
											alt="Manufacturing"
										/>
									</div>

									{/* Top right - Fleets (only for non-neutral) */}
									{faction !== "neutral" && (
										<div className="absolute top-[-4px] right-[2px]">
											<img
												src={getAdornmentByTypeAndFaction("fleet", faction)}
												alt="Fleets"
											/>
										</div>
									)}

									{/* Bottom left - Defence */}
									<div className="absolute bottom-0 left-[4px]">
										<img
											src={getAdornmentByTypeAndFaction("defence", faction)}
											alt="Defence"
										/>
									</div>

									{/* Bottom right - Missions (only for non-neutral) */}
									{faction !== "neutral" && (
										<div className="absolute right-[2px] bottom-0">
											<img
												src={getAdornmentByTypeAndFaction("mission", faction)}
												alt="Missions"
											/>
										</div>
									)}
								</>
							)}

							{/* Planet image */}
							<img
								src={planetImageUrl}
								alt={planet.metadata.name}
								title={planet.metadata.name}
								className="h-[37px] w-[37px]"
							/>
						</div>
					</div>
				)}

				{/* Desktop - Planet with clickable adornments */}
				<div className="hidden md:block">
					<div className="relative flex items-center justify-center">
						{/* Adornments positioned around planet - only show if discovered */}
						{planet.discovered && (
							<>
								{/* Top left - Manufacturing */}
								<button
									onClick={handleViewManufacturing}
									className="group absolute top-[-4px] left-[4px] cursor-pointer"
									title="Manufacturing"
								>
									<img
										src={getAdornmentByTypeAndFaction("manufacturing", faction)}
										alt="Manufacturing"
										className="group-hover:hidden"
									/>
									<img
										src={getHoverAdornmentByTypeAndFaction(
											"manufacturing",
											faction,
										)}
										alt="Manufacturing"
										className="hidden group-hover:block"
									/>
								</button>

								{/* Top right - Fleets (only for non-neutral) */}
								{faction !== "neutral" && (
									<button
										onClick={handleViewFleets}
										className="group absolute top-[-4px] right-[2px] cursor-pointer"
										title="Fleets"
									>
										<img
											src={getAdornmentByTypeAndFaction("fleet", faction)}
											alt="Fleets"
											className="group-hover:hidden"
										/>
										<img
											src={getHoverAdornmentByTypeAndFaction("fleet", faction)}
											alt="Fleets"
											className="hidden group-hover:block"
										/>
									</button>
								)}

								{/* Bottom left - Defence */}
								<button
									onClick={handleViewDefence}
									className="group absolute bottom-0 left-[4px] cursor-pointer"
									title="Defence"
								>
									<img
										src={getAdornmentByTypeAndFaction("defence", faction)}
										alt="Defence"
										className="group-hover:hidden"
									/>
									<img
										src={getHoverAdornmentByTypeAndFaction("defence", faction)}
										alt="Defence"
										className="hidden group-hover:block"
									/>
								</button>

								{/* Bottom right - Missions (only for non-neutral) */}
								{faction !== "neutral" && (
									<button
										onClick={handleViewMissions}
										className="group absolute right-[2px] bottom-0 cursor-pointer"
										title="Missions"
									>
										<img
											src={getAdornmentByTypeAndFaction("mission", faction)}
											alt="Missions"
											className="group-hover:hidden"
										/>
										<img
											src={getHoverAdornmentByTypeAndFaction(
												"mission",
												faction,
											)}
											alt="Missions"
											className="hidden group-hover:block"
										/>
									</button>
								)}
							</>
						)}

						{/* Planet image */}
						<img
							src={planetImageUrl}
							alt={planet.metadata.name}
							title={planet.metadata.name}
							className="h-[37px] w-[37px]"
							onClick={
								selectionState === "awaiting-target"
									? (e) => {
											e.stopPropagation();
											handlePlanetSelected();
										}
									: undefined
							}
							style={{
								cursor:
									selectionState === "awaiting-target" ? "pointer" : "default",
							}}
						/>
					</div>
				</div>
			</div>

			{/* energy spots - only show if planet is discovered */}
			{planet.discovered && (
				<div
					className="mb-[2px] flex h-[6px] space-x-[2px] overflow-hidden"
					title={`${usedEnergy} / ${totalEnergy} Energy`}
				>
					{Array.from({ length: usedEnergy }).map((_, index) => (
						<div
							key={index}
							className="h-[6px] w-[4px] flex-shrink-0 bg-white"
						/>
					))}
					{Array.from({ length: unusedEnergy }).map((_, index) => (
						<div
							key={index}
							className="h-[6px] w-[4px] flex-shrink-0 bg-blue-500"
						/>
					))}
				</div>
			)}

			{/* natural resources - only show if planet is discovered */}
			{planet.discovered && (
				<div
					className="mb-[2px] flex h-[6px] space-x-[2px] overflow-hidden"
					title={`${usedResources} / ${totalResources} Resources`}
				>
					{Array.from({ length: usedResources }).map((_, index) => (
						<div
							key={index}
							className="h-[6px] w-[4px] flex-shrink-0 bg-yellow-500"
						/>
					))}
					{Array.from({ length: unusedResources }).map((_, index) => (
						<div
							key={index}
							className="h-[6px] w-[4px] flex-shrink-0 bg-red-500"
						/>
					))}
				</div>
			)}

			{/* popular support - only show if planet is discovered */}
			{planet.discovered && (
				<div title={`Popular support ${loyalty}%`}>
					<div className="flex h-[6px] w-full overflow-hidden">
						{/* Player faction loyalty (green) */}
						<div
							className={playerColor}
							style={{ width: `${loyaltyToPlayer}%` }}
						/>
						{/* Opponent faction loyalty (red) */}
						<div
							className={opponentColor}
							style={{ width: `${loyaltyToOpponent}%` }}
						/>
					</div>
				</div>
			)}

			<div className={`text-center text-xs ${getPlanetNameColor()}`}>
				{planet.metadata.name}
			</div>
		</div>
	);
};

export default PlanetOverview;
