import React, { useEffect, useState } from "react";
import { GameView, PlanetView, SectorMetadata } from "../../worker/api";
import { useApi } from "../hooks/useApi";
import Filters, { FilterType } from "./Filters";
import Notifications from "./Notifications";
import SectorDetailWindow from "./SectorDetailWindow";
import SectorOverview from "./SectorOverview";
import StatusBar from "./StatusBar";

const GameScreen: React.FC = () => {
	const [game, setGame] = useState<GameView | null>(null);
	const [sectors, setSectors] = useState<SectorMetadata[]>([]);
	const [filter, setFilter] = useState<FilterType>("none");
	const [openSectors, setOpenSectors] = useState<string[]>([]);
	const [notifications, setNotifications] = useState<GameView["notifications"]>(
		[],
	);
	const [planetsBySector, setPlanetsBySector] = useState<
		Record<string, PlanetView[]>
	>({});

	// Use our centralized API hook
	const { fetchData } = useApi<GameView>();

	// Fetch game state on mount
	useEffect(() => {
		const gameId = window.location.pathname.split("/").pop();

		// Use the centralized fetchData function instead of direct fetch
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

	const handleOpenSector = (sectorId: string) => {
		setOpenSectors((prev) =>
			prev.includes(sectorId) ? prev : [...prev, sectorId],
		);
	};
	const handleCloseSector = (sectorId: string) => {
		setOpenSectors((prev) => prev.filter((id) => id !== sectorId));
	};
	const handleMarkRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);
	};

	if (!game)
		return (
			<div className="flex min-h-screen items-center justify-center text-white">
				Loading...
			</div>
		);

	return (
		<div className="relative min-h-screen font-sans text-white">
			<StatusBar turn={game.turn} resources={game.faction.resources} />
			<div className="mx-auto max-w-5xl pt-8">
				<Filters filter={filter} onChange={setFilter} />
				<SectorOverview
					sectors={sectors}
					planetsBySector={planetsBySector}
					filter={filter}
					onOpenSector={handleOpenSector}
				/>
				{openSectors.map((sectorId) => {
					const sector = sectors.find((s) => s.id === sectorId);
					const planets = planetsBySector[sectorId] || [];
					return sector ? (
						<SectorDetailWindow
							key={sector.id}
							sector={sector}
							planets={planets}
							filter={filter}
							onClose={() => handleCloseSector(sector.id)}
							// Add galactic window styling inside SectorDetailWindow
						/>
					) : null;
				})}
			</div>
			<div className="fixed right-4 bottom-4 z-50">
				<Notifications
					notifications={notifications}
					onMarkRead={handleMarkRead}
				/>
			</div>
		</div>
	);
};

export default GameScreen;
