import React from "react";
import { HandRaisedIcon, StarIcon } from "@heroicons/react/24/outline";
import { useSelection, SelectionMode } from "./SelectionContext";

interface SelectionOptionsProps {
	className?: string;
}

const SelectionOptions: React.FC<SelectionOptionsProps> = ({
	className = "",
}) => {
	const { selectionMode, toggleSelectionMode } = useSelection();

	const getButtonClasses = (mode: SelectionMode) => {
		const baseClasses = "flex items-center gap-1 rounded px-2 py-1 text-sm";
		const activeClasses = "bg-indigo-600 text-white";
		const inactiveClasses =
			"bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white";

		return `${baseClasses} ${selectionMode === mode ? activeClasses : inactiveClasses}`;
	};

	return (
		<div className={`flex gap-2 ${className}`}>
			<button
				className={getButtonClasses("single")}
				onClick={() => toggleSelectionMode("single")}
				title="Select Single Item"
			>
				<HandRaisedIcon className="h-8 w-8 p-1" />
			</button>

			<button
				className={getButtonClasses("multiple")}
				onClick={() => toggleSelectionMode("multiple")}
				title="Select Multiple Items"
			>
				<div className="relative">
					<HandRaisedIcon className="h-8 w-8 p-1" />
					<StarIcon className="absolute top-0 -right-1 h-3 w-3" />
				</div>
			</button>
		</div>
	);
};

export default SelectionOptions;
