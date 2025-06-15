import React from "react";

interface TwoColumnLayoutProps {
	leftPanel: React.ReactNode;
	rightPanel: React.ReactNode;
	className?: string;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
	leftPanel,
	rightPanel,
	className = "",
}) => {
	return (
		<div className={`flex flex-1 h-full ${className}`}>
			<div className="flex w-1/3 flex-col border-r border-slate-700 overflow-y-auto min-h-0">
				{leftPanel}
			</div>
			<div className="flex w-2/3 flex-col overflow-y-auto min-h-0">{rightPanel}</div>
		</div>
	);
};
