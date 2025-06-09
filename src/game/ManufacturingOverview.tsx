import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
	BeakerIcon,
	BuildingLibraryIcon,
	CogIcon,
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
import { getManufacturingCardImage } from "../cards";
import { SelectableItem } from "../hooks/useSelectionContext";
import MiniCardView from "./MiniCardView";
import { rawMaterialImage } from "../cards/cards";

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
	const [selectedCategory, setSelectedCategory] = useState<
		ManufacturingCategory | "build"
	>("build");

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
		id: ManufacturingCategory | "build";
		name: string;
		icon: React.ElementType;
	}[] = [
		{ id: "build", name: "Build", icon: CogIcon },
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
					const hasResources =
						category.id === "build"
							? true
							: category.id === "mine"
								? (resources.mine?.length || 0) > 0 ||
									(planet.state?.naturalResources ?? 0) > 0
								: resources[category.id as ManufacturingCategory]?.length > 0;
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
				{categories.map((category) => {
					if (category.id === "build") {
						return (
							<TabPanel key={category.id} className="rounded-md p-1">
								<div className="flex flex-col space-y-4">
									{/* Shipyard Construction */}
									<div className="rounded-lg bg-slate-800 p-4">
										<h3 className="mb-3 flex items-center text-lg font-semibold text-white">
											<BuildingLibraryIcon className="mr-2 h-5 w-5" />
											Shipyard Construction
										</h3>
										<div className="space-y-2">
											{/* Example construction item */}
											<div className="rounded bg-slate-700 p-3">
												<div className="mb-2 flex items-center justify-between">
													<span className="text-sm text-white">
														Alliance Dreadnaught
													</span>
													<span className="text-xs text-slate-300">65%</span>
												</div>
												<div className="h-2 overflow-hidden rounded-full bg-slate-600">
													<div className="h-full w-[65%] bg-blue-500 transition-all duration-300"></div>
												</div>
											</div>
											{/* No construction message */}
											<div className="text-center text-slate-400">
												<p className="text-sm">
													No ships currently under construction
												</p>
											</div>
										</div>
									</div>

									{/* Troop Training */}
									<div className="rounded-lg bg-slate-800 p-4">
										<h3 className="mb-3 flex items-center text-lg font-semibold text-white">
											<UserGroupIcon className="mr-2 h-5 w-5" />
											Troop Training
										</h3>
										<div className="space-y-2">
											{/* Example training item */}
											<div className="rounded bg-slate-700 p-3">
												<div className="mb-2 flex items-center justify-between">
													<span className="text-sm text-white">
														Alliance Army
													</span>
													<span className="text-xs text-slate-300">25%</span>
												</div>
												<div className="h-2 overflow-hidden rounded-full bg-slate-600">
													<div className="h-full w-[25%] bg-green-500 transition-all duration-300"></div>
												</div>
											</div>
											{/* No training message */}
											<div className="text-center text-slate-400">
												<p className="text-sm">
													No troops currently in training
												</p>
											</div>
										</div>
									</div>

									{/* Facility Construction */}
									<div className="rounded-lg bg-slate-800 p-4">
										<h3 className="mb-3 flex items-center text-lg font-semibold text-white">
											<WrenchScrewdriverIcon className="mr-2 h-5 w-5" />
											Facility Construction
										</h3>
										<div className="space-y-2">
											{/* Example facility construction */}
											<div className="rounded bg-slate-700 p-3">
												<div className="mb-2 flex items-center justify-between">
													<span className="text-sm text-white">
														Advanced Shipyard
													</span>
													<span className="text-xs text-slate-300">80%</span>
												</div>
												<div className="h-2 overflow-hidden rounded-full bg-slate-600">
													<div className="h-full w-[80%] bg-orange-500 transition-all duration-300"></div>
												</div>
											</div>
											{/* No construction message */}
											<div className="text-center text-slate-400">
												<p className="text-sm">
													No facilities currently under construction
												</p>
											</div>
										</div>
									</div>
								</div>
							</TabPanel>
						);
					}

					if (category.id == "mine") {
						return (
							<TabPanel key={category.id} className="rounded-md p-1">
								<div className="flex flex-col">
									<div className="flex-grow overflow-auto scrollbar-none">
										{(() => {
											const totalNaturalResources =
												planet.state?.naturalResources ?? 0;
											const numberOfMines = resources.mine?.length || 0;
											const availableRawMaterials = Math.max(
												0,
												totalNaturalResources - numberOfMines,
											);

											// Create array of all items to display (mines + available raw materials)
											const allItems = [
												// Existing mines
												...(resources.mine || []).map(
													(resource: ManufacturingResource) => ({
														type: "mine" as const,
														resource,
													}),
												),
												// Available raw material slots
												...Array.from(
													{ length: availableRawMaterials },
													(_, index) => ({
														type: "raw_material" as const,
														index,
													}),
												),
											];

											if (allItems.length > 0) {
												return (
													<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
														{allItems.map((item) => {
															if (item.type === "mine") {
																const imagePairs = [
																	{
																		overlay: getOverlayImage(),
																		foreground: getManufacturingCardImage(
																			item.resource,
																		),
																		background: getBackgroundImage(
																			item.resource,
																		),
																	},
																];

																const selectableItem = {
																	id: item.resource.id,
																	type: category.id,
																	subtype: item.resource.subtype,
																	name: item.resource.name,
																	status: item.resource.status,
																} as SelectableItem;

																return (
																	<MiniCardView
																		key={item.resource.id}
																		imagePairs={imagePairs}
																		displayText={item.resource.name}
																		selectableItem={selectableItem}
																	/>
																);
															} else {
																// Raw material slot
																const imagePairs = [
																	{
																		overlay: getOverlayImage(),
																		foreground: rawMaterialImage,
																		background: getBackgroundImage({
																			id: `raw_material_${item.index}`,
																			name: "Raw Material",
																			status: "active",
																			type: "mine",
																			subtype: "mine",
																		} as ManufacturingResource),
																	},
																];

																return (
																	<MiniCardView
																		key={`raw_material_${item.index}`}
																		imagePairs={imagePairs}
																		displayText="Raw Material"
																	/>
																);
															}
														})}
													</div>
												);
											} else {
												return (
													<div className="flex flex-1 items-center justify-center">
														<p className="text-center text-slate-400">
															{planet.state?.owner === "Neutral"
																? "This neutral planet has no natural resources."
																: planet.state?.owner
																	? "No natural resources available on this planet."
																	: "Planet details not available. You may need to control this planet to see its natural resources."}
														</p>
													</div>
												);
											}
										})()}
									</div>
								</div>
							</TabPanel>
						);
					}

					return (
						<TabPanel key={category.id} className="rounded-md p-1">
							<div className="flex flex-col">
								<div className="flex-grow overflow-auto scrollbar-none">
									{resources[category.id as ManufacturingCategory]?.length >
									0 ? (
										<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
											{resources[category.id as ManufacturingCategory].map(
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
					);
				})}
			</TabPanels>
		</TabGroup>
	);
};
