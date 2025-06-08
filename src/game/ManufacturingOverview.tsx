import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
	BeakerIcon,
	BuildingLibraryIcon,
	CubeIcon,
	UserGroupIcon,
	WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import {
	ManufacturingCategory,
	ManufacturingResource,
	PlanetView,
} from "../../worker/api";
import MiniCardView from "./MiniCardView";
import { SelectableItem } from "../hooks/useSelectionContext";
import { getManufacturingCardImage } from "../cards";

// Helper function to get background image based on resource state
const getBackgroundImage = (resource: ManufacturingResource): string => {
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

export const ManufacturingOverview: React.FC<{
	planet: PlanetView;
}> = ({ planet }) => {
	const [selectedCategory, setSelectedCategory] =
		useState<ManufacturingCategory>("shipyard");

	// Get manufacturing from planet data, or use empty arrays if no manufacturing
	const planetManufacturing = planet.state?.manufacturing || {
		shipyards: [],
		training_facilities: [],
		construction_yards: [],
		refineries: [],
		mines: [],
	};

	const resources: Record<ManufacturingCategory, ManufacturingResource[]> = {
		shipyard: planetManufacturing.shipyards,
		training_facility: planetManufacturing.training_facilities,
		construction_yard: planetManufacturing.construction_yards,
		refinery: planetManufacturing.refineries,
		mine: planetManufacturing.mines,
	};

	const categories: {
		id: ManufacturingCategory;
		name: string;
		icon: React.ElementType;
	}[] = [
		{ id: "shipyard", name: "Shipyards", icon: BuildingLibraryIcon },
		{
			id: "training_facility",
			name: "Training Facilities",
			icon: UserGroupIcon,
		},
		{
			id: "construction_yard",
			name: "Construction Yards",
			icon: WrenchScrewdriverIcon,
		},
		{ id: "refinery", name: "Refineries", icon: BeakerIcon },
		{ id: "mine", name: "Mines", icon: CubeIcon },
	];

	function getOverlayImage(): string {
		// No overlays for manufacturing resources currently
		return "";
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
										{resources[category.id].map(
											(resource: ManufacturingResource) => {
												const imagePairs = [
													{
														overlay: getOverlayImage(),
														foreground: getManufacturingCardImage(resource),
														background: getBackgroundImage(resource),
													},
												];

												// Create selectable item data
												const selectableItem = {
													id: resource.id,
													type: category.id, // manufacturing category
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
											},
										)}
									</div>
								) : (
									<div className="flex flex-1 items-center justify-center">
										<p className="text-center text-slate-400">
											{planet.state?.owner === "Neutral"
												? `This neutral planet has no ${category.name.toLowerCase()}.`
												: planet.state?.owner
													? `No ${category.name.toLowerCase()} deployed on this planet.`
													: `Planet details not available. You may need to control this planet to see its manufacturing facilities.`}
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
