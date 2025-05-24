import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/react";
import { FunnelIcon } from "@heroicons/react/24/solid";
import React from "react";

// Define FilterType here as it's not in the API
export type FilterType = "none" | "energy" | "minerals" | "population";

interface FiltersProps {
	filter: FilterType;
	onChange: (filter: FilterType) => void;
}

const filterOptions = [
	{ value: "none", label: "None" },
	{ value: "energy", label: "Energy" },
	{ value: "minerals", label: "Minerals" },
	{ value: "population", label: "Population" },
];

const Filters: React.FC<FiltersProps> = ({ filter, onChange }) => (
	<div className="mb-4 flex items-center gap-3">
		<label className="flex items-center gap-1 font-semibold text-slate-300">
			<FunnelIcon className="animate-spin-slow h-5 w-5 text-purple-400" />
			Filter:
		</label>
		<Listbox value={filter} onChange={onChange}>
			<div className="relative min-w-[140px]">
				<ListboxButton className="flex w-full cursor-pointer appearance-none items-center justify-between rounded-md border border-slate-700 bg-slate-800/80 p-2 pr-8 text-white shadow-md transition-colors duration-300 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500">
					{filterOptions.find((f) => f.value === filter)?.label}
					<svg
						className="ml-2 h-4 w-4 text-slate-400"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</ListboxButton>
				<ListboxOptions
					anchor="bottom"
					className="absolute z-20 mt-1 w-full rounded-md bg-slate-900/95 shadow-lg ring-1 ring-purple-700/30 focus:outline-none"
				>
					{filterOptions.map((opt) => (
						<ListboxOption
							key={opt.value}
							value={opt.value as FilterType}
							className="group flex cursor-pointer gap-2 bg-slate-900 px-4 py-2 text-slate-200 select-none data-[focus]:bg-purple-700/60 data-[selected]:text-white"
						>
							{opt.label}
						</ListboxOption>
					))}
				</ListboxOptions>
			</div>
		</Listbox>
	</div>
);

export default Filters;
