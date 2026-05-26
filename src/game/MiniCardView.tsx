import { ViewfinderCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useItemClick } from "../hooks/useItemClick";
import { SelectableItemWithLocation, useSelection } from "../hooks/useSelection";
import { useCommand } from "./CommandContextDef";
import { getItemTargetType } from "./types/actions";
import UnitContextMenu from "./UnitContextMenu";

interface ImagePair {
	foreground: string; // URL or path to foreground image
	background: string; // URL or path to background image
}

interface MiniCardViewProps {
	imagePairs: ImagePair[];
	displayText: string;
	selectableItem?: SelectableItemWithLocation;
}

const MiniCardView: React.FC<MiniCardViewProps> = ({
	imagePairs,
	displayText,
	selectableItem,
}) => {
	const { selectionMode, isSelected } = useSelection();
	const { phase, command } = useCommand();
	const onItemClick = useItemClick();

	const handleClick = () => {
		if (selectableItem) onItemClick(selectableItem);
	};

	const isCardSelected = selectableItem ? isSelected(selectableItem.id) : false;
	const isTargetMode = phase === "awaiting-target";
	const isValidTarget =
		isTargetMode &&
		!!selectableItem &&
		!!command?.actionDef.validTargets.includes(getItemTargetType(selectableItem));

	// Show context menu when not in selection or target mode
	const showContextMenu =
		(selectableItem && selectionMode === "none" && phase === "idle") || false;

	const cardContent = (
		<div
			className={`flex w-full cursor-pointer flex-col items-center p-1 transition-all duration-150 ${
				isTargetMode ? "" : "hover:bg-purple-700/10"
			} `}
			onClick={handleClick}
		>
			<div className="flex flex-wrap justify-center gap-2">
				{imagePairs.map((pair, index) => (
					<div
						key={index}
						className={`relative h-[30px] w-[70px] overflow-hidden rounded bg-cover bg-center ${
							isCardSelected
								? "ring-2 ring-purple-400 ring-offset-1 ring-offset-slate-900"
								: ""
						}`}
						style={{
							backgroundImage: `url(${pair.background})`,
						}}
					>
						<img
							src={pair.foreground}
							alt={`Foreground ${index + 1}`}
							className="absolute inset-0 h-full w-full object-contain"
						/>
						{isValidTarget && (
							<div className="absolute inset-0 z-10 flex items-center justify-center rounded">
								<ViewfinderCircleIcon className="h-10 w-10 text-red-500 drop-shadow-lg" />
							</div>
						)}
					</div>
				))}
			</div>
			{displayText && (
				<span
					className={`mt-2 text-sm ${
						isCardSelected ? "text-purple-300" : "text-slate-400"
					}`}
				>
					{displayText}
				</span>
			)}
		</div>
	);

	return (
		<UnitContextMenu unit={selectableItem} showContextMenu={showContextMenu}>
			{cardContent}
		</UnitContextMenu>
	);
};

export default MiniCardView;
