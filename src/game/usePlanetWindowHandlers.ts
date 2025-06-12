import { PlanetView } from "../../worker/api";
import { useWindowContext } from "../hooks/useWindowContext";
import { WindowInfoType } from "./WindowInfo";

interface WindowConfig {
	type: WindowInfoType;
	titlePrefix: string;
	idPrefix: string;
}

const WINDOW_CONFIGS: Record<WindowInfoType, WindowConfig> = {
	fleets: {
		type: "fleets",
		titlePrefix: "Fleets on",
		idPrefix: "fleets",
	},
	defence: {
		type: "defence",
		titlePrefix: "Defence Overview for",
		idPrefix: "defence",
	},
	manufacturing: {
		type: "manufacturing",
		titlePrefix: "Manufacturing Overview for",
		idPrefix: "manufacturing",
	},
	missions: {
		type: "missions",
		titlePrefix: "Missions on",
		idPrefix: "missions",
	},
	sector: {
		type: "sector",
		titlePrefix: "",
		idPrefix: "sector",
	},
};

export const usePlanetWindowHandlers = (planet: PlanetView) => {
	const { handleOpenWindow } = useWindowContext();

	const createWindowHandler = (windowType: WindowInfoType) => {
		return (e: React.MouseEvent) => {
			e.stopPropagation(); // Prevent event from bubbling to parent container

			// Get the click position, constrained to keep within top 25% of viewport
			const maxY = Math.max(0, window.innerHeight * 0.25 - 48);
			const position = {
				x: e.clientX - 150, // Center window horizontally near click
				y: Math.min(e.clientY - 50, maxY), // Position within top 25% of viewport
			};

			const config = WINDOW_CONFIGS[windowType];
			handleOpenWindow({
				id: `${config.idPrefix}-${planet.metadata.id}`,
				title: `${config.titlePrefix} ${planet.metadata.name}`,
				type: config.type,
				planetId: planet.metadata.id,
				sectorId: planet.metadata.sectorId,
				position: position,
			});
		};
	};

	return {
		handleViewFleets: createWindowHandler("fleets"),
		handleViewDefence: createWindowHandler("defence"),
		handleViewManufacturing: createWindowHandler("manufacturing"),
		handleViewMissions: createWindowHandler("missions"),
	};
};
