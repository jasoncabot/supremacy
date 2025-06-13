import React, { useState } from "react";
import { 
	UserGroupIcon, 
	UsersIcon 
} from "@heroicons/react/24/outline";
import { PlanetView, PersonnelResource } from "../../worker/api";
import { TwoColumnLayout } from "./components/TwoColumnLayout";
import { TabGroupComponent } from "./components/TabGroupComponent";
import { ResourceList } from "./components/ResourceList";
import MiniCardView from "./MiniCardView";
import { getCardImage } from "../cards";
import { SelectableItem } from "../hooks/useSelectionContext";

export const MissionsOverview: React.FC<{
	planet: PlanetView;
}> = ({ planet }) => {
	const [selectedMission, setSelectedMission] = useState<string | null>(null);
	const [selectedTab, setSelectedTab] = useState<string>("agents");
	
	// Get missions from planet data, or use empty array if no missions
	const missions = planet.state?.missions?.missions || [];
	const mission = selectedMission ? missions.find(m => m.id === selectedMission) : null;

	// Helper function to get background image based on resource state
	const getBackgroundImage = (resource: PersonnelResource): string => {
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

	function getOverlayImage(resource: PersonnelResource) {
		if (resource.type !== "personnel") {
			return ""; // No overlay for non-personnel resources
		}
		// if the resource is injured or imprisoned, return an overlay image
		if (resource.injured) {
			return "/path/to/injured_overlay.png";
		}
		if (resource.imprisoned) {
			return "/path/to/imprisoned_overlay.png";
		}
		return ""; // No overlay
	}

	const getImagePairs = (resource: PersonnelResource) => [{
		overlay: getOverlayImage(resource),
		foreground: getCardImage(resource),
		background: getBackgroundImage(resource),
	}];

	const getSelectableItem = (resource: PersonnelResource): SelectableItem => ({
		id: resource.id,
		type: resource.type,
		subtype: resource.subtype,
		name: resource.name,
		status: resource.status,
	} as SelectableItem);

	const tabs = [
		{
			id: "agents",
			name: "Agents",
			icon: UsersIcon,
			content: (
				<ResourceList
					resources={mission?.agents || []}
					getImagePairs={getImagePairs}
					getSelectableItem={getSelectableItem}
					emptyMessage="No agents assigned to this mission"
				/>
			)
		},
		{
			id: "decoys",
			name: "Decoys",
			icon: UserGroupIcon,
			content: (
				<ResourceList
					resources={mission?.decoys || []}
					getImagePairs={getImagePairs}
					getSelectableItem={getSelectableItem}
					emptyMessage="No decoys assigned to this mission"
				/>
			)
		}
	];

	const leftPanel = (
		<div className="flex flex-col h-full">
			<h3 className="text-lg font-semibold text-gray-300 mb-4">Active Missions</h3>
			<div className="space-y-2 flex-1 overflow-auto">
				{missions.length > 0 ? missions.map((mission) => (
					<div
						key={mission.id}
						className={`p-3 rounded-lg cursor-pointer transition-colors ${
							selectedMission === mission.id
								? "bg-slate-700 border border-slate-600"
								: "bg-slate-800 hover:bg-slate-700"
						}`}
						onClick={() => setSelectedMission(mission.id)}
					>
						<div className="text-gray-300 font-medium">{mission.name}</div>
						<div className="text-sm text-gray-500 capitalize">
							{mission.type} • Target: {mission.target.name}
						</div>
						<div className="text-xs text-gray-600">
							{mission.agents.length} agents, {mission.decoys.length} decoys
						</div>
					</div>
				)) : (
					<p className="text-center text-slate-400 italic">
						No active missions on {planet.metadata.name}
					</p>
				)}
			</div>
		</div>
	);

	const rightPanel = selectedMission && mission ? (
		<div className="flex flex-col h-full">
			<h3 className="text-lg font-semibold text-gray-300 mb-4">{mission.name}</h3>
			
			{/* Mission Target */}
			<div className="mb-4">
				<h4 className="text-sm font-medium text-gray-400 mb-2">Target</h4>
				<MiniCardView
					imagePairs={[{
						foreground: "/path/to/default_card.png",
						background: "/path/to/default_bg.png"
					}]}
					displayText={mission.target.name}
					selectableItem={undefined}
				/>
			</div>

			{/* Mission Units */}
			<div className="flex-1">
				<h4 className="text-sm font-medium text-gray-400 mb-2">Assigned Units</h4>
				<TabGroupComponent
					tabs={tabs}
					selectedTab={selectedTab}
					onTabChange={setSelectedTab}
					className="flex-1"
					iconOnly={true}
				/>
			</div>
		</div>
	) : (
		<div className="flex items-center justify-center h-full">
			<p className="text-center text-slate-400 italic">
				Select a mission to view its details
			</p>
		</div>
	);

	return (
		<div className="pr-2 text-gray-300 flex-1 flex flex-col">
			<TwoColumnLayout
				leftPanel={leftPanel}
				rightPanel={rightPanel}
				className="flex-1"
			/>
		</div>
	);
};
