import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React from "react";
import { PlanetView } from "../../worker/api";
import { getMenuAdornmentByTypeAndFaction, type Faction } from "../adornments";
import { getAvailablePlanetFeatures } from "./planetFeatures";

interface PlanetMobileMenuProps {
	planet: PlanetView;
	onFleets: (e: React.MouseEvent) => void;
	onDefence: (e: React.MouseEvent) => void;
	onManufacturing: (e: React.MouseEvent) => void;
	onMissions: (e: React.MouseEvent) => void;
	children: React.ReactNode; // The planet element that triggers the menu
}

const PlanetMobileMenu: React.FC<PlanetMobileMenuProps> = ({
	planet,
	onFleets,
	onDefence,
	onManufacturing,
	onMissions,
	children,
}) => {
	// Determine faction for adornment icons
	const faction: Faction =
		planet.state?.owner === "Neutral"
			? "neutral"
			: planet.state?.owner || "neutral";

	// Get available features using shared logic
	const availableFeatures = getAvailablePlanetFeatures(planet, faction);

	// Map features to menu items with handlers
	const menuItems = availableFeatures.map((feature) => {
		const handlerMap = {
			manufacturing: onManufacturing,
			fleet: onFleets,
			defence: onDefence,
			mission: onMissions,
		};

		return {
			label: feature.label,
			onClick: handlerMap[feature.type],
			icon: getMenuAdornmentByTypeAndFaction(feature.type, faction),
		};
	});

	return (
		<Menu as="div" className="relative cursor-pointer">
			<MenuButton as="div" className="cursor-pointer">
				{children}
			</MenuButton>

			<MenuItems
				transition
				anchor="bottom start"
				className="z-50 mt-1 flex w-48 origin-top-left flex-col rounded border border-white/5 bg-gray-900 p-1 text-sm text-white shadow-lg transition duration-100 ease-out focus:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0"
			>
				{menuItems.map((item) => (
					<MenuItem key={item.label}>
						<button
							onClick={item.onClick}
							className="flex w-full cursor-pointer items-center rounded p-2 text-left text-white hover:bg-gray-700 data-active:bg-gray-700 data-focus:bg-gray-700"
						>
							<img src={item.icon} alt={item.label} className="mr-3" />
							{item.label}
						</button>
					</MenuItem>
				))}
			</MenuItems>
		</Menu>
	);
};

export { PlanetMobileMenu as default };
