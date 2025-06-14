import React, { useState } from "react";
import { 
	RocketLaunchIcon, 
	UserGroupIcon, 
	UsersIcon,
	CommandLineIcon 
} from "@heroicons/react/24/outline";
import { PlanetView, ShipResource, DefenseResource, FleetResource } from "../../worker/api";
import { TwoColumnLayout } from "./components/TwoColumnLayout";
import { TabGroupComponent } from "./components/TabGroupComponent";
import { ResourceList } from "./components/ResourceList";
import { SelectableItem } from "../hooks/useSelectionContext";
import { getCardImage, getShipCardImage } from "../cards";

type FleetResourceType = "capital_ship" | "squadron" | "troop" | "personnel";

export const FleetsOverview: React.FC<{
	planet: PlanetView;
}> = ({ planet }) => {
	const [selectedFleet, setSelectedFleet] = useState<string | null>(null);
	const [selectedShip, setSelectedShip] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<FleetResourceType>("capital_ship");
	
	// Get fleets from planet data, or use empty array if no fleets
	const fleets = planet.state?.fleets?.fleets || [];
	const fleet: FleetResource | undefined = selectedFleet ? fleets.find(f => f.id === selectedFleet) : undefined;
	const ship = selectedShip && fleet ? fleet.ships.find(s => s.id === selectedShip) : null;

	// Helper function to get background image based on resource state
	const getBackgroundImage = (resource: ShipResource | DefenseResource): string => {
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

	function getOverlayImage(resource: ShipResource | DefenseResource) {
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
	}

	// Unified image function for fleet resources
	function getFleetResourceCardImage(resource: ShipResource | DefenseResource): string {
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
	}

	const getImagePairs = (resource: ShipResource | DefenseResource) => [{
		overlay: getOverlayImage(resource),
		foreground: getFleetResourceCardImage(resource),
		background: getBackgroundImage(resource),
	}];

	const getSelectableItem = (resource: ShipResource | DefenseResource): SelectableItem => {
		return resource as SelectableItem;
	};

	// Get resources by category - for ships, show all ships in fleet; for others, show selected ship's complement
	const getResources = (): Record<FleetResourceType, (ShipResource | DefenseResource)[]> => {
		if (selectedCategory === "capital_ship") {
			return {
				capital_ship: fleet?.ships || [],
				squadron: [],
				troop: [],
				personnel: [],
			};
		}
		
		// For squadron/troop/personnel, show the selected ship's complement
		if (ship) {
			return {
				capital_ship: [],
				squadron: ship.fighters || [],
				troop: ship.troops || [],
				personnel: ship.personnel || [],
			};
		}
		
		// No ship selected, show empty arrays
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
		{ id: "capital_ship", name: "Ships", icon: RocketLaunchIcon },
		{ id: "squadron", name: "Fighters", icon: CommandLineIcon },
		{ id: "troop", name: "Troops", icon: UserGroupIcon },
		{ id: "personnel", name: "Personnel", icon: UsersIcon },
	];

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
			if (!ship) {
				content = (
					<div className="flex items-center justify-center h-full">
						<p className="text-center text-slate-400 italic">
							{fleet && fleet.ships.length > 0 
								? `Select a ship from the left panel to view its ${category.name.toLowerCase()}`
								: `No ships available to view ${category.name.toLowerCase()}`
							}
						</p>
					</div>
				);
			} else {
				content = (
					<div className="space-y-2">
						<div className="text-sm text-gray-400 mb-2 p-2 bg-slate-800 rounded">
							{category.name} aboard <span className="text-gray-200">{ship.name}</span>
						</div>
						<ResourceList
							resources={categoryResources}
							getImagePairs={getImagePairs}
							getSelectableItem={getSelectableItem}
							emptyMessage={`No ${category.name.toLowerCase()} aboard this ship`}
						/>
					</div>
				);
			}
		}

		return {
			id: category.id,
			name: category.name,
			icon: category.icon,
			content
		};
	});

	const leftPanel = (
		<div className="flex flex-col h-full">
			<h3 className="text-lg font-semibold text-gray-300 mb-4">Fleets</h3>
			<div className="space-y-2 flex-1 overflow-auto">
				{fleets.length > 0 ? fleets.map((fleetItem) => (
					<div key={fleetItem.id} className="space-y-1">
						<div
							className={`p-3 rounded-lg cursor-pointer transition-colors ${
								selectedFleet === fleetItem.id
									? "bg-slate-700 border border-slate-600"
									: "bg-slate-800 hover:bg-slate-700"
							}`}
							onClick={() => {
								setSelectedFleet(fleetItem.id);
								setSelectedShip(null); // Clear ship selection when changing fleets
							}}
						>
							<div className="text-gray-300 font-medium">{fleetItem.name}</div>
							<div className="text-sm text-gray-500">
								{fleetItem.ships.length} ships
							</div>
						</div>
						
						{/* Show ships when fleet is selected */}
						{selectedFleet === fleetItem.id && fleetItem.ships.length > 0 && (
							<div className="ml-4 space-y-1">
								{fleetItem.ships.map((shipItem) => (
									<div
										key={shipItem.id}
										className={`p-2 rounded-lg cursor-pointer transition-colors text-sm ${
											selectedShip === shipItem.id
												? "bg-slate-600 border border-slate-500"
												: "bg-slate-800 hover:bg-slate-600"
										}`}
										onClick={(e) => {
											e.stopPropagation(); // Prevent fleet selection
											setSelectedShip(shipItem.id);
										}}
									>
										<div className="text-gray-300">{shipItem.name}</div>
										<div className="text-xs text-gray-500">
											{shipItem.subtype.replace(/_/g, ' ')}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)) : (
					<p className="text-center text-slate-400 italic">
						No fleets deployed on {planet.metadata.name}
					</p>
				)}
			</div>
		</div>
	);

	const rightPanel = selectedFleet && fleet ? (
		<div className="flex flex-col h-full">
			<h3 className="text-lg font-semibold text-gray-300 mb-4">{fleet.name}</h3>
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
		<div className="flex items-center justify-center h-full">
			<p className="text-center text-slate-400 italic">
				Select a fleet to view its details
			</p>
		</div>
	);

	return (
		<div className="pr-2 text-gray-300 flex-1 flex flex-col">
			<TwoColumnLayout
				leftPanel={leftPanel}
				rightPanel={rightPanel}
				className="flex-1"
			/>
		</div>
	);
};
