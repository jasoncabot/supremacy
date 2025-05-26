import React, { ReactNode, useEffect, useState } from "react";
import {
	GameAction,
	GameView,
	Notification,
	PlanetView,
	SectorMetadata,
} from "../../worker/api";
import { useApi } from "../hooks/useApi";
import { GameContext, GameContextType } from "./GameContextDef";

type SectorPlanetMap = Record<string, PlanetView[]>;

export const GameProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [game, setGame] = useState<GameView | null>(null);
	const [sectors, setSectors] = useState<SectorMetadata[]>([]);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [planetsBySector, setPlanetsBySector] = useState<SectorPlanetMap>({});
	const { fetchData, loading, error } = useApi<GameView>();

	// Fetch game state on mount
	useEffect(() => {
		const gameId = window.location.pathname.split("/").pop();
		if (!gameId) return;

		fetchData(`/api/games/${gameId}`)
			.then((data: GameView) => {
				setGame(data);

				// Transform sectors data
				const sectorList = Object.values(data.sectors) as SectorMetadata[];
				setSectors(sectorList);

				// Group planets by sector
				const planetMap: Record<string, PlanetView[]> = {};
				for (const sector of sectorList) {
					planetMap[sector.id] = sector.planetIds
						.map((id: string) => data.planets[id])
						.filter(Boolean);
				}
				setPlanetsBySector(planetMap);

				setNotifications(data.notifications || []);
			})
			.catch((error: Error) => {
				if (error.name === "AbortError") {
					return;
				}
				console.error("Failed to load game:", error);
			});
	}, [fetchData]);

	const markNotificationAsRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);

		// In a real implementation, you would likely also send this to the API
		// TODO: Implement API call to mark notification as read
	};

	const submitActions = async (actions: GameAction[]): Promise<void> => {
		if (!game) return;

		try {
			// TODO: Implement the actual API call to submit actions
			// await fetchData(`/api/games/${game.id}/actions`, {
			//   method: 'POST',
			//   body: { actions }
			// });

			console.log("Actions submitted:", actions);
		} catch (error) {
			console.error("Failed to submit actions:", error);
			throw error;
		}
	};

	const value: GameContextType = {
		game,
		sectors,
		planetsBySector,
		notifications,
		loading,
		error,
		markNotificationAsRead,
		submitActions,
	};

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
