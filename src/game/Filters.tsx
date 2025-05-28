import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";

// Define FilterType as a union of all possible filter values
export type FilterType =
	| "OFF"
	| "LOYALTY_SUPPORT"
	| "LOYALTY_UPRISING"
	| "FLEETS_IDLE"
	| "FLEETS_ENROUTE"
	| "PERSONNEL_IDLE"
	| "PERSONNEL_ACTIVE"
	| "RESOURCES_ENERGY"
	| "RESOURCES_RAW_MATERIAL"
	| "RESOURCES_MINES"
	| "RESOURCES_REFINERIES"
	| "MANUFACTURING_SHIPYARD"
	| "MANUFACTURING_SHIPYARD_IDLE"
	| "MANUFACTURING_TRAINING"
	| "MANUFACTURING_TRAINING_IDLE"
	| "MANUFACTURING_CONSTRUCTION"
	| "MANUFACTURING_CONSTRUCTION_IDLE"
	| "DEFENCE_BATTERIES"
	| "DEFENCE_SHIELDS"
	| "DEFENCE_FIGHTERS"
	| "DEFENCE_TROOPS"
	| "DEFENCE_DEATH_STAR_SHIELDS";

interface FiltersProps {
	filter: FilterType | null;
	onChange: (filter: FilterType) => void;
}

// Define the filter options in a hierarchical structure
const filterCategories = [
	{
		name: "Loyalty",
		options: [
			{ value: "LOYALTY_SUPPORT", label: "Popular Support" },
			{ value: "LOYALTY_UPRISING", label: "Uprising" },
		],
	},
	{
		name: "Fleets",
		options: [
			{ value: "FLEETS_IDLE", label: "Idle Fleets" },
			{ value: "FLEETS_ENROUTE", label: "Fleets Enroute" },
		],
	},
	{
		name: "Personnel",
		options: [
			{ value: "PERSONNEL_IDLE", label: "Idle Personnel" },
			{ value: "PERSONNEL_ACTIVE", label: "Active Personnel" },
		],
	},
	{
		name: "Resources",
		options: [
			{ value: "RESOURCES_ENERGY", label: "Available Energy" },
			{ value: "RESOURCES_RAW_MATERIAL", label: "Available Raw Material" },
			{ value: "RESOURCES_MINES", label: "Mines" },
			{ value: "RESOURCES_REFINERIES", label: "Refineries" },
		],
	},
	{
		name: "Manufacturing",
		options: [
			{ value: "MANUFACTURING_SHIPYARD", label: "Shipyards" },
			{ value: "MANUFACTURING_SHIPYARD_IDLE", label: "Idle Shipyards" },
			{ value: "MANUFACTURING_TRAINING", label: "Training Facilities" },
			{
				value: "MANUFACTURING_TRAINING_IDLE",
				label: "Idle Training Facilities",
			},
			{ value: "MANUFACTURING_CONSTRUCTION", label: "Construction Yards" },
			{
				value: "MANUFACTURING_CONSTRUCTION_IDLE",
				label: "Idle Construction Yards",
			},
		],
	},
	{
		name: "Defence",
		options: [
			{ value: "DEFENCE_BATTERIES", label: "Planetary Defence Batteries" },
			{ value: "DEFENCE_SHIELDS", label: "Planetary Shield Generators" },
			{ value: "DEFENCE_FIGHTERS", label: "Fighter Squadrons" },
			{ value: "DEFENCE_TROOPS", label: "Troopers" },
			{ value: "DEFENCE_DEATH_STAR_SHIELDS", label: "Death Star Shields" },
		],
	},
];

// Flatten all options for finding the label of the current filter
const allFilterOptions = [
	{ value: "OFF", label: "Display Off" },
	...filterCategories.flatMap((category) => category.options),
];

const Filters: React.FC<FiltersProps> = ({ filter, onChange }) => {
	// Find the label for the currently selected filter
	const selectedFilterLabel = filter
		? allFilterOptions.find((opt) => opt.value === filter)?.label || "None"
		: "None";

	return (
		<div className="flex flex-1 items-center gap-3">
			<label className="hidden items-center gap-1 font-semibold text-slate-300 sm:flex">
				<FunnelIcon className="animate-spin-slow h-5 w-5 text-purple-400" />
			</label>
			<Listbox value={filter} onChange={onChange}>
				<div className="relative">
					<ListboxButton className="ml-1 flex cursor-pointer appearance-none items-center justify-between rounded-md border border-slate-700 bg-slate-800/80 p-2 text-white shadow-md transition-colors duration-300 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500">
						{selectedFilterLabel}
						<ChevronDownIcon className="ml-1 h-5 w-5 text-purple-400" />
					</ListboxButton>
					<ListboxOptions
						anchor="bottom"
						className="absolute z-20 mt-1 max-h-32 overflow-y-hidden rounded-md bg-slate-900/95 shadow-lg ring-1 ring-purple-700/30 focus:outline-none"
					>
						{/* Display Off option */}
						<ListboxOption
							key="OFF"
							value="OFF"
							className="group flex cursor-pointer gap-2 bg-slate-900 px-4 py-2 text-slate-200 select-none data-[focus]:bg-purple-700/60 data-[selected]:text-white"
						>
							Display Off
						</ListboxOption>

						{/* Categories and their options */}
						{filterCategories.map((category) => (
							<Fragment key={category.name}>
								{/* Category header */}
								<div className="bg-slate-800 px-4 py-1 font-semibold text-purple-300">
									{category.name}
								</div>

								{/* Category options */}
								{category.options.map((option) => (
									<ListboxOption
										key={option.value}
										value={option.value}
										className="group flex cursor-pointer gap-2 bg-slate-900 px-6 py-2 text-slate-200 select-none data-[focus]:bg-purple-700/60 data-[selected]:text-white"
									>
										{option.label}
									</ListboxOption>
								))}
							</Fragment>
						))}
					</ListboxOptions>
				</div>
			</Listbox>
		</div>
	);
};

export default Filters;
