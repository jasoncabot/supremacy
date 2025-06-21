import React from "react";
import { PlanetView } from "../../worker/api";
import { type Faction } from "../adornments";
import { usePlanetWindowHandlers } from "../hooks/usePlanetWindowHandlers";
import { SelectableItemWithLocation, useSelectionContext } from "../hooks/useSelectionContext";
import { getPlanetById } from "../planets";
import { FilterType } from "./Filters";
import LoyaltyBar from "./LoyaltyBar";
import PlanetCore from "./PlanetCore";
import PlanetMobileMenu from "./PlanetMobileMenu";
import ResourceBar from "./ResourceBar";

interface PlanetOverviewProps {
	planet: PlanetView;
	filter: FilterType;
}

const PlanetOverview: React.FC<PlanetOverviewProps> = ({ planet, filter }) => {
	const { selectionState, selectItem } = useSelectionContext();

	const {
		handleViewFleets,
		handleViewDefence,
		handleViewManufacturing,
		handleViewMissions,
	} = usePlanetWindowHandlers(planet);

	const handlePlanetSelected = () => {
		// If we're in target selection mode, select this planet as the target
		if (selectionState === "awaiting-target") {
			const planetAsSelectableItem = {
				...planet,
				type: "planet" as const,
				id: planet.metadata.id,
				location: {
					planetId: planet.metadata.id,
				},
			} as SelectableItemWithLocation;
			selectItem(planetAsSelectableItem);
		}
		// If no selection is in progress, the mobile menu will handle the interaction
		// (for desktop, the adornment buttons are always visible)
	};

	// Handle container click for mobile - allows tapping anywhere on the planet overview
	const handleContainerClick = (e: React.MouseEvent) => {
		// Only handle container clicks on mobile (when adornments are hidden)
		// On desktop, individual buttons handle their own clicks
		const isMobile = window.innerWidth < 768; // md breakpoint
		if (isMobile) {
			if (selectionState === "awaiting-target") {
				e.stopPropagation();
				handlePlanetSelected();
			}
			// For non-target selection, the PlanetMobileMenu will handle the interaction
		}
	};

	// Calculate planet metrics
	const usedEnergy = planet.state?.manufacturing
		? planet.state.manufacturing.refineries.length +
			planet.state.manufacturing.shipyards.length +
			planet.state.manufacturing.construction_yards.length +
			planet.state.manufacturing.training_facilities.length +
			(planet.state.defenses?.shields.length || 0) +
			(planet.state.defenses?.batteries.length || 0)
		: 0;
	const totalEnergy = planet.state?.energySpots || 0;
	const usedResources = planet.state?.manufacturing?.mines.length || 0;
	const totalResources = planet.state?.naturalResources || 0;
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

	// Calculate loyalty bar colors
	const playerColor = "bg-green-500";
	const opponentColor = "bg-red-500";

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
			className="items-left flex w-[80px] cursor-pointer flex-col justify-center rounded-lg px-2 text-white md:cursor-default"
			onClick={handleContainerClick}
		>
			{/* Planet with adornments positioned around it - same layout for mobile and desktop */}
			<div className="relative mb-2">
				{/* Mobile: Wrap entire planet area with menu when not in target selection mode */}
				{selectionState !== "awaiting-target" && planet.discovered ? (
					<div className="md:hidden">
						<PlanetMobileMenu
							planet={planet}
							onFleets={handleViewFleets}
							onDefence={handleViewDefence}
							onManufacturing={handleViewManufacturing}
							onMissions={handleViewMissions}
						>
							<PlanetCore
								planet={planet}
								faction={faction}
								planetImageUrl={planetImageUrl}
								filter={filter}
								interactive={false}
							/>
						</PlanetMobileMenu>
					</div>
				) : (
					/* Target selection mode - show planet with adornments, container handles click */
					<div className="md:hidden">
						<PlanetCore
							planet={planet}
							faction={faction}
							planetImageUrl={planetImageUrl}
							filter={filter}
							onPlanetClick={undefined}
							interactive={false}
						/>
					</div>
				)}

				{/* Desktop - Planet with clickable adornments */}
				<div className="hidden md:block">
					<PlanetCore
						planet={planet}
						faction={faction}
						planetImageUrl={planetImageUrl}
						filter={filter}
						handlers={{
							manufacturing: handleViewManufacturing,
							fleet: handleViewFleets,
							defence: handleViewDefence,
							mission: handleViewMissions,
						}}
						onPlanetClick={
							selectionState === "awaiting-target"
								? (e) => {
										e.stopPropagation();
										handlePlanetSelected();
									}
								: undefined
						}
						interactive={true}
					/>
				</div>
			</div>

			{/* Resource bars - only show if planet is discovered */}
			{planet.discovered && (
				<>
					<ResourceBar
						used={usedEnergy}
						total={totalEnergy}
						usedColor="bg-white"
						unusedColor="bg-blue-500"
						label="Energy"
					/>
					<ResourceBar
						used={usedResources}
						total={totalResources}
						usedColor="bg-yellow-500"
						unusedColor="bg-red-500"
						label="Resources"
					/>
					<LoyaltyBar
						loyalty={loyalty}
						playerColor={playerColor}
						opponentColor={opponentColor}
					/>
				</>
			)}

			<div className={`text-center text-xs ${getPlanetNameColor()}`}>
				{planet.metadata.name}
			</div>
		</div>
	);
};

export default PlanetOverview;
