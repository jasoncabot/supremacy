import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
	BoltIcon,
	RocketLaunchIcon,
	ShieldCheckIcon,
	UserGroupIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react"; // Added React import
import { PlanetView } from "../../worker/api";
import MiniCardView from "./MiniCardView";

// Define the defence categories
type DefenceCategory =
	| "personnel"
	| "troops"
	| "squadrons"
	| "shields"
	| "batteries";

// Define resources for each category (placeholder data)
interface CategoryResource {
	id: string;
	name: string;
	icon: React.ElementType;
	injured: boolean;
	imprisoned: boolean;
	status: "active" | "en-route" | "under-construction";
}

// Helper function to get foreground image based on icon
const getForegroundImage = (icon: React.ElementType): string => {
	if (icon === UsersIcon) return "/path/to/personnel_fg.png";
	if (icon === UserGroupIcon) return "/path/to/troops_fg.png";
	if (icon === RocketLaunchIcon) return "/path/to/squadron_fg.png";
	if (icon === ShieldCheckIcon) return "/path/to/shield_fg.png";
	if (icon === BoltIcon) return "/path/to/battery_fg.png";
	return "/path/to/default_fg.png";
};

// Helper function to get background image based on resource state
const getBackgroundImage = (resource: CategoryResource): string => {
	if (resource.injured) return "/path/to/injured_bg.png";
	if (resource.imprisoned) return "/path/to/imprisoned_bg.png";
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

	const resources: Record<DefenceCategory, CategoryResource[]> = {
		personnel: [
			{
				id: "security-forces",
				name: "Security Forces",
				icon: UsersIcon,
				injured: false,
				imprisoned: false,
				status: "active",
			},
			{
				id: "military-police",
				name: "Military Police",
				icon: UsersIcon,
				injured: false,
				imprisoned: false,
				status: "active",
			},
			{
				id: "elite-guards",
				name: "Elite Guards",
				icon: UsersIcon,
				injured: false,
				imprisoned: false,
				status: "active",
			},
		],
		troops: [
			{
				id: "infantry",
				name: "Infantry",
				icon: UserGroupIcon,
				injured: false,
				imprisoned: false,
				status: "active",
			},
			{
				id: "armored-division",
				name: "Armored Division",
				icon: UserGroupIcon,
				injured: false,
				imprisoned: false,
				status: "en-route",
			},
			{
				id: "special-forces",
				name: "Special Forces",
				icon: UserGroupIcon,
				injured: false,
				imprisoned: false,
				status: "under-construction",
			},
		],
		squadrons: [
			{
				id: "x-wing-squadron",
				name: "X-Wing Squadron",
				icon: RocketLaunchIcon,
				injured: false,
				imprisoned: false,
				status: "active",
			},
			{
				id: "tie-fighter-squadron",
				name: "TIE Fighter Squadron",
				icon: RocketLaunchIcon,
				injured: false,
				imprisoned: false,
				status: "en-route",
			},
			{
				id: "bomber-squadron",
				name: "Bomber Squadron",
				icon: RocketLaunchIcon,
				injured: false,
				imprisoned: false,
				status: "under-construction",
			},
		],
		shields: [
			{
				id: "planetary-shield",
				name: "Planetary Shield",
				icon: ShieldCheckIcon,
				injured: false,
				imprisoned: false,
				status: "active",
			},
			{
				id: "shield-generator",
				name: "Shield Generator",
				icon: ShieldCheckIcon,
				injured: false,
				imprisoned: false,
				status: "en-route",
			},
			{
				id: "deflector-shield",
				name: "Deflector Shield",
				icon: ShieldCheckIcon,
				injured: false,
				imprisoned: false,
				status: "under-construction",
			},
		],
		batteries: [
			{
				id: "ion-cannon",
				name: "Ion Cannon",
				icon: BoltIcon,
				injured: false,
				imprisoned: false,
				status: "active",
			},
			{
				id: "laser-battery",
				name: "Laser Battery",
				icon: BoltIcon,
				injured: false,
				imprisoned: false,
				status: "en-route",
			},
			{
				id: "turbolaser-battery",
				name: "Turbolaser Battery",
				icon: BoltIcon,
				injured: false,
				imprisoned: false,
				status: "under-construction",
			},
		],
	};

	const categories: {
		id: DefenceCategory;
		name: string;
		icon: React.ElementType;
	}[] = [
		{ id: "personnel", name: "Personnel", icon: UsersIcon },
		{ id: "troops", name: "Trooper Regiments", icon: UserGroupIcon },
		{ id: "squadrons", name: "Fighter Squadrons", icon: RocketLaunchIcon },
		{ id: "shields", name: "Planetary Shields", icon: ShieldCheckIcon },
		{ id: "batteries", name: "Planetary Batteries", icon: BoltIcon },
	];

	return (
		<div className="flex h-full rounded-lg bg-slate-900 p-2 text-slate-200">
			<TabGroup
				className="flex w-full flex-col"
				selectedIndex={categories.findIndex(
					(cat) => cat.id === selectedCategory,
				)}
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
								disabled={!hasResources}
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

				<TabPanels className="mt-2 flex-grow">
					{categories.map((category) => (
						<TabPanel key={category.id} className="h-full rounded-md p-1">
							<div className="flex h-full flex-col">
								<div className="flex-grow overflow-auto">
									{resources[category.id].length > 0 ? (
										<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
											{resources[category.id].map(
												(resource: CategoryResource) => {
													// Added type for resource
													const imagePairs = [
														{
															foreground: getForegroundImage(resource.icon),
															background: getBackgroundImage(resource),
														},
													];

													// Create selectable item data
													const selectableItem = {
														id: resource.id,
														type: category.id, // defence category
														name: resource.name,
														status: resource.status,
														injured: resource.injured,
														imprisoned: resource.imprisoned,
														category: category.id,
													};

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
										<div className="flex h-full items-center justify-center">
											<p className="text-slate-400">
												No {category.name.toLowerCase()} available on this
												planet.
											</p>
										</div>
									)}
								</div>
							</div>
						</TabPanel>
					))}
				</TabPanels>
			</TabGroup>
		</div>
	);
};
