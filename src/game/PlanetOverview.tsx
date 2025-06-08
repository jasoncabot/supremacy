import React from "react";
import { PlanetView } from "../../worker/api";
import { useWindowContext } from "../hooks/useWindowContext";
import { FilterType } from "./Filters";
import { getPlanetById } from "../planets";
import { getAdornmentByTypeAndFaction, type Faction } from "../adornments";

interface PlanetOverviewProps {
	planet: PlanetView;
	filter: FilterType;
}

const PlanetOverview: React.FC<PlanetOverviewProps> = ({ planet }) => {
	const { handleOpenWindow } = useWindowContext();

	const handleViewFleets = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event from bubbling to parent window
		// Get the click position
		const position = {
			x: e.clientX - 150, // Center window horizontally near click
			y: e.clientY - 50, // Position window vertically near click with offset for header
		};

		handleOpenWindow({
			id: `fleets-${planet.metadata.id}`,
			title: `Fleets on ${planet.metadata.name}`,
			type: "fleets",
			planetId: planet.metadata.id,
			sectorId: planet.metadata.sectorId,
			position: position, // Pass the click position
		});
	};

	const handleViewDefence = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event from bubbling to parent window
		const position = {
			x: e.clientX - 150,
			y: e.clientY - 50,
		};

		handleOpenWindow({
			id: `defence-${planet.metadata.id}`,
			title: `Defence Overview for ${planet.metadata.name}`,
			type: "defence",
			planetId: planet.metadata.id,
			sectorId: planet.metadata.sectorId,
			position: position,
		});
	};

	const handleViewManufacturing = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event from bubbling to parent window
		const position = {
			x: e.clientX - 150,
			y: e.clientY - 50,
		};

		handleOpenWindow({
			id: `manufacturing-${planet.metadata.id}`,
			title: `Manufacturing Overview for ${planet.metadata.name}`,
			type: "manufacturing",
			planetId: planet.metadata.id,
			sectorId: planet.metadata.sectorId,
			position: position,
		});
	};

	const handleViewMissions = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent event from bubbling to parent window
		const position = {
			x: e.clientX - 150,
			y: e.clientY - 50,
		};

		handleOpenWindow({
			id: `missions-${planet.metadata.id}`,
			title: `Missions on ${planet.metadata.name}`,
			type: "missions",
			planetId: planet.metadata.id,
			sectorId: planet.metadata.sectorId,
			position: position,
		});
	};

	const usedEnergy = 1; // TODO: count the manufacturing units that take energy
	const totalEnergy = planet.state?.energySpots || 0;
	const unusedEnergy = totalEnergy - usedEnergy;

	const usedResources = planet.state?.manufacturing?.mines.length || 0;
	const totalResources = planet.state?.naturalResources || 0;
	const unusedResources = totalResources - usedResources;

	const loyalty = planet.state?.loyalty || 0;

	const planetImageUrl = getPlanetById(
		planet.metadata.picture,
		planet.state?.isDestroyed,
	);

	// Determine faction for adornment icons
	const faction: Faction =
		planet.state?.owner === "Neutral"
			? "neutral"
			: planet.state?.owner || "neutral";

	return (
		<div className="items-left flex h-[80px] w-[60px] flex-col justify-center rounded-lg p-2 text-white">
			{/* planet image */}
			<div className="mb-1 flex items-center justify-between">
				<img
					src={planetImageUrl}
					alt={planet.metadata.name}
					title={planet.metadata.name}
					className="h-[30px] w-[30px] rounded-full"
				/>
			</div>

			{/* Adornments only visible on md+ devices */}
			<div className="mb-1 hidden md:block">
				<div className="flex flex-row gap-1">
					<button
						onClick={handleViewFleets}
						className="hover:opacity-80"
						title="Fleets"
					>
						<img
							src={getAdornmentByTypeAndFaction("fleet", faction)}
							alt="Fleets"
						/>
					</button>
					<button
						onClick={handleViewDefence}
						className="hover:opacity-80"
						title="Defence"
					>
						<img
							src={getAdornmentByTypeAndFaction("defence", faction)}
							alt="Defence"
						/>
					</button>
					<button
						onClick={handleViewManufacturing}
						className="hover:opacity-80"
						title="Manufacturing"
					>
						<img
							src={getAdornmentByTypeAndFaction("manufacturing", faction)}
							alt="Manufacturing"
						/>
					</button>
					<button
						onClick={handleViewMissions}
						className="hover:opacity-80"
						title="Missions"
					>
						<img
							src={getAdornmentByTypeAndFaction("mission", faction)}
							alt="Missions"
						/>
					</button>
				</div>
			</div>

			{/* energy spots */}
			<div
				className="mb-1 flex"
				title={`${usedEnergy} / ${totalEnergy} Energy`}
			>
				{Array.from({ length: usedEnergy }).map((_, index) => (
					<div
						key={index}
						className="h-[6px] w-[4px] border-l border-gray-400 bg-white"
					/>
				))}
				{Array.from({ length: unusedEnergy }).map((_, index) => (
					<div
						key={index}
						className="h-[6px] w-[4px] border-l border-gray-400 bg-blue-500"
					/>
				))}
			</div>

			{/* natural resources */}
			<div
				className="mb-1 flex"
				title={`${usedResources} / ${totalResources} Resources`}
			>
				{Array.from({ length: usedResources }).map((_, index) => (
					<div
						key={index}
						className="h-[6px] w-[4px] border-l border-gray-400 bg-yellow-500"
					/>
				))}
				{Array.from({ length: unusedResources }).map((_, index) => (
					<div
						key={index}
						className="h-[6px] w-[4px] border-l border-gray-400 bg-red-500"
					/>
				))}
			</div>

			{/* popular support */}
			<div className="mb-1 flex text-xs" title={`Popular support ${loyalty}%`}>
				{loyalty}%
			</div>

			<div className="text-xs">{planet.metadata.name}</div>
		</div>
	);
};

export default PlanetOverview;
