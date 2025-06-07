import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
	BoltIcon,
	RocketLaunchIcon,
	ShieldCheckIcon,
	UserGroupIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react"; // Added React import
import { DefenceCategory, DefenseResource, PlanetView } from "../../worker/api";
import MiniCardView from "./MiniCardView";
import { SelectableItem } from "../hooks/useSelectionContext";
import { getCardImage } from "../cards";

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
		if (resource.type !== "personnel" || resource.subtype !== "characters") {
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

	return (
		<TabGroup
			className="flex w-full flex-col"
			selectedIndex={categories.findIndex((cat) => cat.id === selectedCategory)}
			onChange={(index) => setSelectedCategory(categories[index].id)}
		>
			<TabList className="flex space-x-1 rounded-md bg-slate-800 p-1">
				{categories.map((category) => {
					const CategoryIcon = category.icon;
					const hasResources = resources[category.id].length > 0;
					const owner = planet.state?.owner || "Neutral";

					return (
						<Tab
							key={category.id}
							title={category.name}
							className={({ selected }) =>
								`flex w-full items-center justify-center rounded-lg py-2 text-sm ${
									selected
										? "bg-slate-700 text-white shadow"
										: "cursor-pointer text-slate-400 hover:bg-slate-800 hover:text-white"
								} ${!hasResources && !selected ? "opacity-50" : ""} ${
									owner === "Empire" && hasResources ? "text-blue-300" : ""
								} ${
									owner === "Rebellion" && hasResources ? "text-red-300" : ""
								} transition-all duration-100 ease-in-out`
							}
						>
							<CategoryIcon className="h-10 w-10" />
						</Tab>
					);
				})}
			</TabList>

			<TabPanels className="mt-2 flex-1 flex-grow">
				{categories.map((category) => (
					<TabPanel key={category.id} className="rounded-md p-1">
						<div className="flex flex-col">
							<div className="flex-grow overflow-auto">
								{resources[category.id].length > 0 ? (
									<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
										{resources[category.id].map((resource: DefenseResource) => {
											const imagePairs = [
												{
													overlay: getOverlayImage(resource),
													foreground: getCardImage(resource),
													background: getBackgroundImage(resource),
												},
											];

											// Create selectable item data
											const selectableItem = {
												id: resource.id,
												type: category.id, // defence category
												subtype: resource.subtype,
												name: resource.name,
												status: resource.status,
											} as SelectableItem;

											return (
												<MiniCardView
													key={resource.id}
													imagePairs={imagePairs}
													displayText={resource.name}
													selectableItem={selectableItem}
												/>
											);
										})}
									</div>
								) : (
									<div className="flex flex-1 items-center justify-center">
										<p className="text-center text-slate-400">
											{planet.state?.owner === "Neutral"
												? `This neutral planet has no ${category.name.toLowerCase()}.`
												: planet.state?.owner
													? `No ${category.name.toLowerCase()} deployed on this planet.`
													: `Planet details not available. You may need to control this planet to see its defenses.`}
										</p>
									</div>
								)}
							</div>
						</div>
					</TabPanel>
				))}
			</TabPanels>
		</TabGroup>
	);
};
