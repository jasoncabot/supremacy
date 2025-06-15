import {
	BoltIcon,
	RocketLaunchIcon,
	ShieldCheckIcon,
	UserGroupIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react"; // Added React import
import { DefenceCategory, DefenseResource, PlanetView } from "../../worker/api";
import { SelectableItem } from "../hooks/useSelectionContext";
import { getCardImage } from "../cards";
import { TabGroupComponent } from "./components/TabGroupComponent";
import { ResourceList } from "./components/ResourceList";

// Helper function to get background image based on resource state
const getBackgroundImage = (resource: DefenseResource): string => {
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

export const DefenceOverview: React.FC<{
	planet: PlanetView;
}> = ({ planet }) => {
	const [selectedCategory, setSelectedCategory] =
		useState<DefenceCategory>("personnel");

	// Get defenses from planet data, or use empty arrays if no defenses
	const planetDefenses = planet.state?.defenses || {
		personnel: [],
		troops: [],
		squadrons: [],
		shields: [],
		batteries: [],
	};

	const resources: Record<DefenceCategory, DefenseResource[]> = {
		personnel: planetDefenses.personnel,
		troop: planetDefenses.troops,
		squadron: planetDefenses.squadrons,
		shield: planetDefenses.shields,
		battery: planetDefenses.batteries,
	};

	const categories: {
		id: DefenceCategory;
		name: string;
		icon: React.ElementType;
	}[] = [
		{ id: "personnel", name: "Personnel", icon: UsersIcon },
		{ id: "troop", name: "Trooper Regiments", icon: UserGroupIcon },
		{ id: "squadron", name: "Fighter Squadrons", icon: RocketLaunchIcon },
		{ id: "shield", name: "Planetary Shields", icon: ShieldCheckIcon },
		{ id: "battery", name: "Planetary Batteries", icon: BoltIcon },
	];

	function getOverlayImage(resource: DefenseResource) {
		if (resource.type !== "personnel" || resource.subtype !== "character") {
			return ""; // No overlay for non-personnel resources
		}
		// if the resource is injured or imprisoned, return an overlay image
		if (resource.injured) {
			return "/path/to/injured_overlay.png";
		}
		if (resource.imprisoned) {
			return "/path/to/imprisoned_overlay.png";
		}
		return ""; // No overlay
	}

	const getImagePairs = (resource: DefenseResource) => [{
		overlay: getOverlayImage(resource),
		foreground: getCardImage(resource),
		background: getBackgroundImage(resource),
	}];

	const getSelectableItem = (resource: DefenseResource): SelectableItem => ({
		id: resource.id,
		type: resource.type,
		subtype: resource.subtype,
		name: resource.name,
		status: resource.status,
	} as SelectableItem);

	const owner = planet.state?.owner || "Neutral";

	const tabs = categories.map((category) => {
		const hasResources = resources[category.id].length > 0;
		const categoryResources = resources[category.id];

		return {
			id: category.id,
			name: category.name,
			icon: category.icon,
			content: (
				<ResourceList
					resources={categoryResources}
					getImagePairs={getImagePairs}
					getSelectableItem={getSelectableItem}
					emptyMessage={
						planet.state?.owner === "Neutral"
							? `This neutral planet has no ${category.name.toLowerCase()}.`
							: planet.state?.owner
								? `No ${category.name.toLowerCase()} deployed on this planet.`
								: `Planet details not available. You may need to control this planet to see its defenses.`
					}
				/>
			),
			hasResources,
			owner
		};
	});

	return (
		<TabGroupComponent
			tabs={tabs}
			selectedTab={selectedCategory}
			onTabChange={(tabId) => setSelectedCategory(tabId as DefenceCategory)}
			className="flex-1"
			iconOnly={true}
		/>
	);
};
