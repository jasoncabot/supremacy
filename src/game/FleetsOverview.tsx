import React, { useState } from "react";
import { 
	RocketLaunchIcon, 
	UserGroupIcon, 
	UsersIcon,
	CommandLineIcon 
} from "@heroicons/react/24/outline";
import { PlanetView, FleetUnit } from "../../worker/api";
import { TwoColumnLayout } from "./components/TwoColumnLayout";
import { TabGroupComponent } from "./components/TabGroupComponent";
import { ResourceList } from "./components/ResourceList";
import { SelectableItem } from "../hooks/useSelectionContext";
import { getCardImage, getShipCardImage } from "../cards";

export const FleetsOverview: React.FC<{
	planet: PlanetView;
}> = ({ planet }) => {
	const [selectedFleet, setSelectedFleet] = useState<string | null>(null);
	const [selectedTab, setSelectedTab] = useState<string>("ships");
	
	// Get fleets from planet data, or use empty array if no fleets
	const fleets = planet.state?.fleets?.fleets || [];
	const fleet = selectedFleet ? fleets.find(f => f.id === selectedFleet) : null;

	// Helper function to get background image based on resource state
	const getBackgroundImage = (resource: FleetUnit): string => {
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

	function getOverlayImage(resource: FleetUnit) {
		// For personnel, check for injured/imprisoned status
		if (resource.type === "personnel") {
			const personnelResource = resource as FleetUnit & { injured?: boolean; imprisoned?: boolean };
			if (personnelResource.injured) {
				return "/path/to/injured_overlay.png";
			}
			if (personnelResource.imprisoned) {
				return "/path/to/imprisoned_overlay.png";
			}
		}
		return ""; // No overlay for other types
	}

	// Flexible image function for FleetUnits
	function getFleetUnitCardImage(resource: FleetUnit): string {
		switch (resource.type) {
			case "personnel":
				// For personnel, we can use the existing getCardImage if the resource matches DefenseResource structure
				try {
					// Try to use the existing getCardImage for personnel
					if (resource.subtype && typeof resource.subtype === 'string') {
						// Create a minimal DefenseResource-like object for getCardImage
						const defenseResourceLike = {
							...resource,
							injured: false,
							imprisoned: false,
						};
						return getCardImage(defenseResourceLike as Parameters<typeof getCardImage>[0]);
					}
				} catch (error) {
					// Fall back to default if getCardImage doesn't work
					console.warn('Could not get card image for personnel:', error);
				}
				return "/path/to/default_personnel.png";
			case "squadron":
				// For squadrons, try to use the existing getCardImage
				try {
					const defenseResourceLike = {
						...resource,
					};
					return getCardImage(defenseResourceLike as Parameters<typeof getCardImage>[0]);
				} catch (error) {
					console.warn('Could not get card image for squadron:', error);
				}
				return "/path/to/default_squadron.png";
			case "troop":
				// For troops, try to use the existing getCardImage
				try {
					const defenseResourceLike = {
						...resource,
					};
					return getCardImage(defenseResourceLike as Parameters<typeof getCardImage>[0]);
				} catch (error) {
					console.warn('Could not get card image for troop:', error);
				}
				return "/path/to/default_troop.png";
			case "ship":
				// For ships, use the dedicated ship image function
				return getShipCardImage(resource.subtype);
			default:
				return "/path/to/default_card.png";
		}
	}

	const getImagePairs = (resource: FleetUnit) => [{
		overlay: getOverlayImage(resource),
		foreground: getFleetUnitCardImage(resource),
		background: getBackgroundImage(resource),
	}];

	const getSelectableItem = (resource: FleetUnit): SelectableItem => ({
		id: resource.id,
		type: resource.type,
		subtype: resource.subtype,
		name: resource.name,
		status: resource.status,
	} as SelectableItem);

	const tabs = [
		{
			id: "ships",
			name: "Ships",
			icon: RocketLaunchIcon,
			content: (
				<ResourceList
					resources={fleet?.ships || []}
					getImagePairs={getImagePairs}
					getSelectableItem={getSelectableItem}
					emptyMessage="No ships in this fleet"
				/>
			)
		},
		{
			id: "fighters",
			name: "Fighters",
			icon: CommandLineIcon,
			content: (
				<ResourceList
					resources={fleet?.fighters || []}
					getImagePairs={getImagePairs}
					getSelectableItem={getSelectableItem}
					emptyMessage="No fighter squadrons in this fleet"
				/>
			)
		},
		{
			id: "troops",
			name: "Troops",
			icon: UserGroupIcon,
			content: (
				<ResourceList
					resources={fleet?.troops || []}
					getImagePairs={getImagePairs}
					getSelectableItem={getSelectableItem}
					emptyMessage="No troops in this fleet"
				/>
			)
		},
		{
			id: "personnel",
			name: "Personnel",
			icon: UsersIcon,
			content: (
				<ResourceList
					resources={fleet?.personnel || []}
					getImagePairs={getImagePairs}
					getSelectableItem={getSelectableItem}
					emptyMessage="No personnel in this fleet"
				/>
			)
		}
	];

	const leftPanel = (
		<div className="flex flex-col h-full">
			<h3 className="text-lg font-semibold text-gray-300 mb-4">Fleets</h3>
			<div className="space-y-2 flex-1 overflow-auto">
				{fleets.length > 0 ? fleets.map((fleet) => (
					<div
						key={fleet.id}
						className={`p-3 rounded-lg cursor-pointer transition-colors ${
							selectedFleet === fleet.id
								? "bg-slate-700 border border-slate-600"
								: "bg-slate-800 hover:bg-slate-700"
						}`}
						onClick={() => setSelectedFleet(fleet.id)}
					>
						<div className="text-gray-300 font-medium">{fleet.name}</div>
						<div className="text-sm text-gray-500">
							{fleet.ships.length} ships, {fleet.fighters.length} squadrons
						</div>
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
				selectedTab={selectedTab}
				onTabChange={setSelectedTab}
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
