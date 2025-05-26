import { createContext } from "react";

import type {
	GameView,
	PlanetView,
	SectorMetadata,
	Notification,
	GameAction,
} from "../../worker/api";

type SectorPlanetMap = Record<string, PlanetView[]>;

export type GameContextType = {
	// Game state
	game: GameView | null;
	sectors: SectorMetadata[];
	planetsBySector: SectorPlanetMap;
	notifications: Notification[];
	loading: boolean;
	error: Error | null;

	// Game actions
	markNotificationAsRead: (id: string) => void;
	submitActions: (actions: GameAction[]) => Promise<void>;
};

export const GameContext = createContext<GameContextType | undefined>(
	undefined,
);
