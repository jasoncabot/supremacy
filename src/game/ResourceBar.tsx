import React from "react";

interface ResourceBarProps {
	used: number;
	total: number;
	usedColor: string;
	unusedColor: string;
	label: string;
}

const ResourceBar: React.FC<ResourceBarProps> = ({
	used,
	total,
	usedColor,
	unusedColor,
	label,
}) => {
	const unused = total - used;

	return (
		<div
			className="mb-[2px] flex h-[6px] space-x-[2px] overflow-hidden"
			title={`${used} / ${total} ${label}`}
		>
			{Array.from({ length: used }).map((_, index) => (
				<div
					key={`used-${index}`}
					className={`h-[6px] w-[4px] flex-shrink-0 ${usedColor}`}
				/>
			))}
			{Array.from({ length: unused }).map((_, index) => (
				<div
					key={`unused-${index}`}
					className={`h-[6px] w-[4px] flex-shrink-0 ${unusedColor}`}
				/>
			))}
		</div>
	);
};

export default ResourceBar;
