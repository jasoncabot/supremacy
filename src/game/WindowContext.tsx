import React, { createContext, useCallback, useContext, useState } from "react";
import { MenuView } from "./SideMenu";
import { MinimizedWindowType, ViewWindowType, ViewWindowViewType } from "./types/WindowTypes";

interface WindowContextType {
  // Window states
  openSectors: string[];
  openViewWindows: ViewWindowType[];
  minimizedWindows: MinimizedWindowType[];
  
  // Window actions
  handleOpenSector: (sectorId: string) => void;
  handleViewPlanet: (sectorId: string, planetId: string, viewType: ViewWindowViewType) => void;
  handleMinimizeWindow: (windowInfo: MinimizedWindowType) => void;
  handleMaximizeWindow: (windowId: string) => void;
  handleCloseViewWindow: (viewId: string) => void;
  handleCloseSector: (sectorId: string) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openSectors, setOpenSectors] = useState<string[]>([]);
  const [openViewWindows, setOpenViewWindows] = useState<ViewWindowType[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<MinimizedWindowType[]>([]);

  const handleMinimizeWindow = useCallback((windowInfo: MinimizedWindowType) => {
    setMinimizedWindows((prev) => [...prev, windowInfo]);
  }, []);

  const handleCloseViewWindow = useCallback((viewId: string) => {
    setOpenViewWindows((prev) => prev.filter((view) => view.id !== viewId));
  }, []);

  const handleCloseSector = useCallback((sectorId: string) => {
    setOpenSectors((prev) => prev.filter((id) => id !== sectorId));
  }, []);

  // Define this first to avoid dependency ordering issues
  const handleMaximizeWindow = useCallback(
    (windowId: string) => {
      const windowToRestore = minimizedWindows.find((w) => w.id === windowId);
      if (windowToRestore) {
        // If it's a sector window
        if (windowToRestore.type === "sector" && windowToRestore.sectorId) {
          // Special case to avoid recursion - directly manipulate the state
          if (!openSectors.includes(windowToRestore.sectorId)) {
            setOpenSectors((prev) => [...prev, windowToRestore.sectorId!]);
          } else {
            setOpenSectors((prev) => {
              const others = prev.filter(
                (id) => id !== windowToRestore.sectorId,
              );
              return [...others, windowToRestore.sectorId!];
            });
          }
        }
        // If it's a view window
        else if (
          windowToRestore.type === "view" &&
          windowToRestore.sectorId &&
          windowToRestore.planetId &&
          windowToRestore.viewType
        ) {
          const viewId = `${windowToRestore.planetId}-${windowToRestore.viewType}`;
          // Special case to avoid recursion - directly manipulate the state
          if (!openViewWindows.some((view) => view.id === viewId)) {
            setOpenViewWindows((prev) => [
              ...prev,
              {
                id: viewId,
                sectorId: windowToRestore.sectorId!,
                planetId: windowToRestore.planetId!,
                viewType: windowToRestore.viewType!,
              },
            ]);
          } else {
            setOpenViewWindows((prev) => {
              const others = prev.filter((view) => view.id !== viewId);
              return [
                ...others,
                {
                  id: viewId,
                  sectorId: windowToRestore.sectorId!,
                  planetId: windowToRestore.planetId!,
                  viewType: windowToRestore.viewType!,
                },
              ];
            });
          }
        }

        // Remove from minimized list
        setMinimizedWindows((prev) => prev.filter((w) => w.id !== windowId));
      }
    },
    [minimizedWindows, openSectors, openViewWindows],
  );

  // Handle sector opening/closing
  const handleOpenSector = useCallback(
    (sectorId: string) => {
      // Check if the sector window is in minimized windows
      const minimizedSector = minimizedWindows.find(
        (w) => w.type === "sector" && w.sectorId === sectorId,
      );

      if (minimizedSector) {
        // Restore from minimized
        handleMaximizeWindow(minimizedSector.id);
        return;
      }

      // Otherwise handle normally
      if (!openSectors.includes(sectorId)) {
        setOpenSectors((prev) => [...prev, sectorId]);
      } else {
        setOpenSectors((prev) => {
          const others = prev.filter((id) => id !== sectorId);
          return [...others, sectorId];
        });
      }
    },
    [openSectors, minimizedWindows, handleMaximizeWindow],
  );

  // Handle view planet opening/closing
  const handleViewPlanet = useCallback(
    (sectorId: string, planetId: string, viewType: ViewWindowViewType) => {
      const viewId = `${planetId}-${viewType}`;

      // Check if this view window is in minimized windows
      const minimizedView = minimizedWindows.find(
        (w) =>
          w.type === "view" &&
          w.sectorId === sectorId &&
          w.planetId === planetId &&
          w.viewType === viewType,
      );

      if (minimizedView) {
        // Restore from minimized
        handleMaximizeWindow(minimizedView.id);
        return;
      }

      // Check if this view is already open
      if (!openViewWindows.some((view) => view.id === viewId)) {
        setOpenViewWindows((prev) => [
          ...prev,
          { id: viewId, sectorId, planetId, viewType } as ViewWindowType,
        ]);
      } else {
        // Bring to front if already open
        setOpenViewWindows((prev) => {
          const others = prev.filter((view) => view.id !== viewId);
          return [
            ...others,
            { id: viewId, sectorId, planetId, viewType } as ViewWindowType,
          ];
        });
      }
    },
    [openViewWindows, minimizedWindows, handleMaximizeWindow],
  );

  const value = {
    openSectors,
    openViewWindows,
    minimizedWindows,
    handleOpenSector,
    handleViewPlanet,
    handleMinimizeWindow,
    handleMaximizeWindow,
    handleCloseViewWindow,
    handleCloseSector,
  };

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
};

export const useWindowContext = (): WindowContextType => {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error("useWindowContext must be used within a WindowProvider");
  }
  return context;
};
