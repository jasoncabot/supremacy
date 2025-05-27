import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
	BoltIcon,
	RocketLaunchIcon,
	ShieldCheckIcon,
	UserGroupIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { PlanetView } from "../../worker/api";

// Define the defence categories
type DefenceCategory =
	| "personnel"
	| "regiments"
	| "squadrons"
	| "shields"
	| "batteries";

// Define resources for each category (placeholder data)
interface CategoryResources {
	available: number;
	total: number;
	details: {
		name: string;
		level: number;
		status: "active" | "idle" | "under-construction";
	}[];
}

export const DefenceOverview: React.FC<{
	planet: PlanetView;
}> = ({ planet }) => {
	// We're tracking the selected category for future use but not currently using the variable directly
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setSelectedCategory] = useState<DefenceCategory>("personnel");

	// This would normally come from the planet data
	// For now we'll create placeholder data
	const resources: Record<DefenceCategory, CategoryResources> = {
		personnel: {
			available: 3,
			total: 5,
			details: [
				{ name: "Security Forces", level: 2, status: "active" },
				{ name: "Military Police", level: 1, status: "active" },
				{ name: "Elite Guards", level: 3, status: "idle" },
			],
		},
		regiments: {
			available: 2,
			total: 3,
			details: [
				{ name: "Infantry Regiment", level: 3, status: "active" },
				{ name: "Mechanized Battalion", level: 2, status: "idle" },
			],
		},
		squadrons: {
			available: 1,
			total: 2,
			details: [{ name: "Interceptor Squadron", level: 2, status: "active" }],
		},
		shields: {
			available: 2,
			total: 2,
			details: [
				{ name: "Primary Shield Generator", level: 1, status: "idle" },
				{ name: "Secondary Shield Array", level: 2, status: "active" },
			],
		},
		batteries: {
			available: 3,
			total: 4,
			details: [
				{ name: "Orbital Defense Cannon", level: 3, status: "active" },
				{ name: "Surface-to-Space Batteries", level: 2, status: "active" },
				{ name: "Point Defense Grid", level: 1, status: "active" },
			],
		},
	};

	// Set up category data
	const categories: {
		id: DefenceCategory;
		name: string;
		icon: React.ElementType;
	}[] = [
		{ id: "personnel", name: "Personnel", icon: UsersIcon },
		{ id: "regiments", name: "Trooper Regiments", icon: UserGroupIcon },
		{ id: "squadrons", name: "Fighter Squadrons", icon: RocketLaunchIcon },
		{ id: "shields", name: "Planetary Shields", icon: ShieldCheckIcon },
		{ id: "batteries", name: "Planetary Batteries", icon: BoltIcon },
	];

	return (
		<div className="flex h-full flex-col rounded-lg bg-slate-900 p-4 text-slate-200">
			<TabGroup onChange={(index) => setSelectedCategory(categories[index].id)}>
				<TabList className="flex space-x-1 rounded-xl bg-slate-800 p-1">
					{categories.map((category) => {
						const CategoryIcon = category.icon;
						const hasResources = resources[category.id].available > 0;
						const owner = planet.state?.owner || "Neutral";

						return (
							<Tab
								key={category.id}
								className={({ selected }) =>
									`flex w-full items-center justify-center rounded-lg py-2.5 text-sm leading-5 font-medium ${
										selected
											? "bg-slate-700 text-white shadow"
											: "text-slate-400 hover:bg-slate-800 hover:text-white"
									} ${!hasResources && !selected ? "opacity-50" : ""} ${owner === "Empire" && hasResources ? "text-blue-300" : ""} ${owner === "Rebellion" && hasResources ? "text-red-300" : ""} transition-all duration-100 ease-in-out`
								}
							>
								<CategoryIcon className="mr-2 h-5 w-5" />
								<span>{category.name}</span>
								{hasResources && (
									<span className="ml-2 rounded-full bg-slate-600 px-2 py-0.5 text-xs">
										{resources[category.id].available}/
										{resources[category.id].total}
									</span>
								)}
							</Tab>
						);
					})}
				</TabList>

				<TabPanels className="mt-4 flex-grow">
					{categories.map((category) => (
						<TabPanel
							key={category.id}
							className="h-full rounded-xl bg-slate-800 p-4"
						>
							<div className="flex h-full flex-col">
								<h2 className="mb-4 border-b border-slate-700 pb-2 text-xl font-bold text-slate-200">
									{category.name} on {planet.metadata.name}
								</h2>

								<div className="flex-grow overflow-auto">
									{resources[category.id].details.length > 0 ? (
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											{resources[category.id].details.map((resource, idx) => (
												<div
													key={idx}
													className={`rounded-lg border p-4 ${
														resource.status === "active"
															? "border-green-700 bg-slate-800"
															: resource.status === "idle"
																? "border-yellow-700 bg-slate-800"
																: "border-blue-700 bg-slate-800"
													}`}
												>
													<div className="flex items-center justify-between">
														<h3 className="text-lg font-medium">
															{resource.name}
														</h3>
														<span className="rounded-full bg-slate-700 px-2 py-1 text-sm">
															Level {resource.level}
														</span>
													</div>
													<div className="mt-2 flex items-center justify-between">
														<span
															className={`text-sm ${
																resource.status === "active"
																	? "text-green-400"
																	: resource.status === "idle"
																		? "text-yellow-400"
																		: "text-blue-400"
															}`}
														>
															Status:{" "}
															{resource.status.charAt(0).toUpperCase() +
																resource.status.slice(1)}
														</span>
														<button className="rounded-md bg-slate-700 px-3 py-1 text-sm hover:bg-slate-600">
															Manage
														</button>
													</div>
												</div>
											))}
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

								<div className="mt-4 flex justify-end">
									<button className="rounded-md bg-slate-700 px-4 py-2 hover:bg-slate-600">
										Build New{" "}
										{category.id === "batteries"
											? "Battery"
											: category.id === "personnel"
												? "Personnel Facility"
												: category.id === "shields"
													? "Shield Generator"
													: category.id.charAt(0).toUpperCase() +
														category.id.slice(1, -1)}
									</button>
								</div>
							</div>
						</TabPanel>
					))}
				</TabPanels>
			</TabGroup>
		</div>
	);
};
