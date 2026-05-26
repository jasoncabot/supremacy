import React, { ReactNode, useCallback, useMemo, useState } from "react";
import {
	GameAction,
	Notification,
	PlanetView,
	SectorMetadata,
} from "../../worker/api";
import { useFetch } from "../hooks/useApi";
import { GameView } from "../../worker/api";
import { GameContext, GameContextType } from "./GameContextDef";

type SectorPlanetMap = Record<string, PlanetView[]>;

export const GameProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const gameId = window.location.pathname.split("/").pop() || null;
	const {
		data: game,
		loading,
		error,
		refetch,
	} = useFetch<GameView>(gameId ? `/api/games/${gameId}` : null);

	const sectors = useMemo<SectorMetadata[]>(
		() => (game ? (Object.values(game.sectors) as SectorMetadata[]) : []),
		[game],
	);

	const planetsBySector = useMemo<SectorPlanetMap>(() => {
		if (!game) return {};
		const map: SectorPlanetMap = {};
		for (const sector of sectors) {
			map[sector.id] = sector.planetIds
				.map((id) => game.planets[id])
				.filter(Boolean);
		}
		return map;
	}, [game, sectors]);

	// Notifications come from the server view; we overlay locally-read ids rather
	// than copying the array, so a refetch can't resurrect a dismissed one.
	const [readIds, setReadIds] = useState<Set<string>>(new Set());
	const notifications = useMemo<Notification[]>(
		() =>
			(game?.notifications ?? []).map((n) =>
				readIds.has(n.id) ? { ...n, read: true } : n,
			),
		[game, readIds],
	);

	const markNotificationAsRead = useCallback((id: string) => {
		setReadIds((prev) => new Set(prev).add(id));
		// TODO: persist read state to the API
	}, []);

	const submitActions = useCallback(
		async (actions: GameAction[]): Promise<void> => {
			// TODO: POST actions once the endpoint exists:
			//   await fetchData(`/api/games/${gameId}/actions`, { method: "POST", body: { actions } });
			console.log("Actions submitted:", actions);
			// Re-derive every faction's view from the (server-resolved) truth.
			await refetch();
		},
		[refetch],
	);

	const value = useMemo<GameContextType>(
		() => ({
			game,
			sectors,
			planetsBySector,
			notifications,
			loading,
			error,
			markNotificationAsRead,
			submitActions,
		}),
		[
			game,
			sectors,
			planetsBySector,
			notifications,
			loading,
			error,
			markNotificationAsRead,
			submitActions,
		],
	);

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
