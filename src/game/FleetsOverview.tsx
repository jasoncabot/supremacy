import {
	CommandLineIcon,
	RocketLaunchIcon,
	UserGroupIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import {
	DefenseResource,
	FleetResource,
	PlanetView,
	ShipResource,
} from "../../worker/api";
import { getCardImage, getShipCardImage } from "../cards";
import { getFleetImageLayers } from "../fleets";
import { SelectableItemWithLocation } from "../hooks/useSelectionContext";
import { ResourceList } from "./components/ResourceList";
import { TabGroupComponent } from "./components/TabGroupComponent";
import { TwoColumnLayout } from "./components/TwoColumnLayout";
import MiniCardView from "./MiniCardView";

type FleetResourceType = "capital_ship" | "squadron" | "troop" | "personnel";

export const FleetsOverview: React.FC<{
	planet: PlanetView;
}> = ({ planet }) => {
	const [selectedFleet, setSelectedFleet] = useState<string | null>(null);
	const [selectedShip, setSelectedShip] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] =
		useState<FleetResourceType>("capital_ship");

	// Get fleets from planet data, or use empty array if no fleets
	const fleets = planet.state?.fleets?.fleets || [];
	const fleet: FleetResource | undefined = selectedFleet
		? fleets.find((f) => f.id === selectedFleet)
		: undefined;
	const ship =
		selectedShip && fleet
			? fleet.ships.find((s) => s.id === selectedShip)
			: null;

	// Helper function to get background image based on resource state
	const getBackgroundImage = (
		resource: ShipResource | DefenseResource,
	): string => {
		switch (resource.status) {
			case "active":
				return "/path/to/active_bg.png";
			case "en-route":
				return "/path/to/en_route_bg.png";
			case "under-construction":
				return "/path/to/under_construction_bg.png";
			default:
				return "/path/to/default_bg.png";
		}
	};

	const getOverlayImage = (resource: ShipResource | DefenseResource) => {
		// For personnel, check for injured/imprisoned status
		if (resource.type === "personnel") {
			if (resource.injured) {
				return "/path/to/injured_overlay.png";
			}
			if (resource.imprisoned) {
				return "/path/to/imprisoned_overlay.png";
			}
		}
		return ""; // No overlay for other types
	};

	// Unified image function for fleet resources
	const getFleetResourceCardImage = (
		resource: ShipResource | DefenseResource,
	) => {
		switch (resource.type) {
			case "personnel":
			case "squadron":
			case "troop":
				// Use the existing getCardImage for defense resources
				return getCardImage(resource as DefenseResource);
			case "capital_ship":
				// For ships, use the dedicated ship image function
				return getShipCardImage(resource.subtype);
			default:
				return "/path/to/default_card.png";
		}
	};

	const getImagePairs = (resource: ShipResource | DefenseResource) => [
		{
			overlay: getOverlayImage(resource),
			foreground: getFleetResourceCardImage(resource),
			background: getBackgroundImage(resource),
		},
	];

	const getSelectableItem = (
		resource: ShipResource | DefenseResource,
	): SelectableItemWithLocation => {
		return {
			...resource,
			location: {
				planetId: planet.metadata.id,
				fleetId: fleet?.id || null,
				shipId: ship?.id || null,
			},
		} as SelectableItemWithLocation;
	};

	// Get resources by category - for ships, show all ships in fleet; for others, show totals from all ships or selected ship's complement
	const getResources = (): {
		capital_ship: ShipResource[];
		squadron: DefenseResource[];
		troop: DefenseResource[];
		personnel: DefenseResource[];
	} => {
		if (selectedCategory === "capital_ship") {
			return {
				capital_ship: fleet?.ships || [],
				squadron: [],
				troop: [],
				personnel: [],
			};
		}

		// For squadron/troop/personnel, aggregate from all ships in fleet or show selected ship's complement
		if (fleet) {
			if (ship) {
				// Show only selected ship's complement
				return {
					capital_ship: [],
					squadron: ship.fighters || [],
					troop: ship.troops || [],
					personnel: ship.personnel || [],
				};
			} else {
				// Aggregate from all ships in the fleet
				const allSquadrons: DefenseResource[] = [];
				const allTroops: DefenseResource[] = [];
				const allPersonnel: DefenseResource[] = [];

				fleet.ships.forEach((fleetShip) => {
					if (fleetShip.fighters) allSquadrons.push(...fleetShip.fighters);
					if (fleetShip.troops) allTroops.push(...fleetShip.troops);
					if (fleetShip.personnel) allPersonnel.push(...fleetShip.personnel);
				});

				return {
					capital_ship: [],
					squadron: allSquadrons,
					troop: allTroops,
					personnel: allPersonnel,
				};
			}
		}

		// No fleet selected, show empty arrays
		return {
			capital_ship: [],
			squadron: [],
			troop: [],
			personnel: [],
		};
	};

	const resources = getResources();

	const categories: {
		id: FleetResourceType;
		name: string;
		icon: React.ElementType;
	}[] = [
		{ id: "squadron", name: "Fighters", icon: CommandLineIcon },
		{ id: "troop", name: "Troops", icon: UserGroupIcon },
		{ id: "personnel", name: "Personnel", icon: UsersIcon },
	];

	if (!selectedShip) {
		// Don't show ships unless only a fleet is selected
		categories.unshift({
			id: "capital_ship",
			name: "Ships",
			icon: RocketLaunchIcon,
		});
	}

	const tabs = categories.map((category) => {
		const categoryResources = resources[category.id];

		let content;
		if (category.id === "capital_ship") {
			// For ships tab, show the ship list directly
			content = (
				<ResourceList
					resources={categoryResources}
					getImagePairs={getImagePairs}
					getSelectableItem={getSelectableItem}
					emptyMessage={
						!fleet
							? "Select a fleet to view its ships"
							: "No ships in this fleet"
					}
				/>
			);
		} else {
			// For squadron/troop/personnel tabs
			if (!fleet || fleet.ships.length === 0) {
				content = (
					<div className="flex h-full items-center justify-center">
						<p className="text-center text-slate-400 italic">
							No ships available to view {category.name.toLowerCase()}
						</p>
					</div>
				);
			} else {
				// Show either fleet total or individual ship's complement
				const headerText = ship
					? `${category.name} aboard ${ship.name}`
					: `All ${category.name} in ${fleet.name}`;

				content = (
					<div className="space-y-2">
						<div className="mb-2 rounded bg-slate-800 p-2 text-sm text-gray-400">
							{headerText}
						</div>
						<ResourceList
							resources={categoryResources}
							getImagePairs={getImagePairs}
							getSelectableItem={getSelectableItem}
							emptyMessage={`No ${category.name.toLowerCase()} ${ship ? "aboard this ship" : "in this fleet"}`}
						/>
					</div>
				);
			}
		}

		return {
			id: category.id,
			name: category.name,
			icon: category.icon,
			content,
		};
	});

	const rightPanel =
		selectedFleet && fleet ? (
			<div className="overflow-none flex h-full flex-col">
				<TabGroupComponent
					tabs={tabs}
					selectedTab={selectedCategory}
					onTabChange={(tabId) => {
						setSelectedCategory(tabId as FleetResourceType);
						// Clear ship selection when switching to ships tab
						if (tabId === "capital_ship") {
							setSelectedShip(null);
						}
					}}
					className="flex-1"
					iconOnly={true}
				/>
			</div>
		) : (
			<div className="flex h-full items-center justify-center p-4">
				<p className="text-center text-slate-400 italic">
					Select a fleet to view its details
				</p>
			</div>
		);

	return (
		<div className="flex h-full flex-1 flex-col text-gray-300">
			<TwoColumnLayout
				leftPanel={
					<div className="space-y-1 p-4">
						{fleets.map((fleetItem) => (
							<FleetComponent
								key={fleetItem.id}
								fleet={fleetItem}
								planet={planet}
								selected={selectedFleet === fleetItem.id}
								onSelect={() => {
									if (fleetItem.id === selectedFleet) {
										// Deselect if already selected
										setSelectedFleet(null);
										setSelectedShip(null); // Clear ship selection
									} else {
										// Select the fleet and clear ship selection
										setSelectedFleet(fleetItem.id);
										setSelectedShip(null); // Clear ship selection when changing fleet
									}
								}}
								onShipSelect={(shipId) => {
									if (shipId === selectedShip) {
										// Deselect if already selected
										setSelectedShip(null);
									} else {
										// Select the ship
										setSelectedShip(shipId);
									}
								}}
								selectedShipId={selectedShip}
							/>
						))}
					</div>
				}
				rightPanel={rightPanel}
			/>
		</div>
	);
};

const FleetComponent: React.FC<{
	fleet: FleetResource;
	planet: PlanetView;
	selected: boolean;
	selectedShipId?: string | null;
	onSelect: () => void;
	onShipSelect: (shipId: string) => void;
}> = ({ fleet, selected, selectedShipId, onSelect, onShipSelect }) => {
	// Determine if the fleet is en-route
	const isEnroute = fleet.status === "en-route";

	// Determine if any ships in the fleet are damaged
	const hasDamage = fleet.ships.some(
		(ship) => ship.damage === "medium" || ship.damage === "high",
	);

	const faction = fleet.faction;

	// Get the image layers for the fleet
	const fleetImageLayers = getFleetImageLayers(faction, isEnroute, hasDamage);

	return (
		<div key={fleet.id} className="space-y-1">
			<div
				className={`cursor-pointer p-3 transition-colors ${
					selected ? "border-1 border-purple-500" : "hover:bg-slate-700"
				}`}
				onClick={(e) => {
					e.stopPropagation(); // Prevent parent click event
					onSelect();
				}}
			>
				<div className="flex flex-col items-center">
					<div className="relative h-16 w-16 flex-shrink-0">
						{fleetImageLayers.map((imageUrl, index) => (
							<img
								key={index}
								src={imageUrl}
								alt={`Fleet ${index}`}
								className="absolute inset-0 h-full w-full object-contain"
								style={{ zIndex: index }}
							/>
						))}
					</div>
					<div className="flex-1">
						<div className="font-sm text-gray-300">{fleet.name}</div>
						<div className="text-xs text-gray-500">
							{fleet.ships.length} ships
						</div>
					</div>
				</div>
			</div>

			{/* Show ships when fleet is selected */}
			{selected && fleet.ships.length > 0 && (
				<div className="ml-2">
					{fleet.ships.map((shipItem) => (
						<div
							key={shipItem.id}
							className={`cursor-pointer p-1 text-sm transition-colors ${
								selectedShipId === shipItem.id
									? "border-1 border-purple-500 bg-purple-900/10"
									: "hover:bg-purple-900/20"
							}`}
							onClick={(e) => {
								e.stopPropagation(); // Prevent fleet selection
								onShipSelect(shipItem.id);
							}}
						>
							<MiniCardView
								key={shipItem.id}
								imagePairs={[
									{
										foreground: getShipCardImage(shipItem.subtype),
										background: "/path/to/ship_background.png",
									},
								]}
								displayText={shipItem.name}
								selectableItem={undefined}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
