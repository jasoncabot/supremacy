import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define selection types
export type SelectableItem = {
  id: string;
  type: 'ship' | 'troop' | 'planet' | 'defence' | string;
  [key: string]: any;
};

export type SelectionMode = 'none' | 'single' | 'multiple';

// Define context type
interface SelectionContextType {
  selectedItems: SelectableItem[];
  selectionMode: SelectionMode;
  toggleSelectionMode: (mode: SelectionMode) => void;
  selectItem: (item: SelectableItem) => void;
  deselectItem: (itemId: string) => void;
  clearSelection: () => void;
  isSelected: (itemId: string) => boolean;
}

// Create context with default values
const SelectionContext = createContext<SelectionContextType>({
  selectedItems: [],
  selectionMode: 'none',
  toggleSelectionMode: () => {},
  selectItem: () => {},
  deselectItem: () => {},
  clearSelection: () => {},
  isSelected: () => false,
});

// Provider component
export const SelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<SelectableItem[]>([]);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('none');

  const toggleSelectionMode = (mode: SelectionMode) => {
    if (mode === selectionMode) {
      // If clicking the active mode, turn it off
      setSelectionMode('none');
      clearSelection();
    } else {
      setSelectionMode(mode);
      // Clear selection when switching modes
      clearSelection();
    }
  };

  const selectItem = (item: SelectableItem) => {
    if (selectionMode === 'none') return;
    
    if (selectionMode === 'single') {
      setSelectedItems([item]);
    } else if (selectionMode === 'multiple') {
      // Check if item is already selected
      if (!isSelected(item.id)) {
        setSelectedItems([...selectedItems, item]);
      }
    }
  };

  const deselectItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const isSelected = (itemId: string) => {
    return selectedItems.some(item => item.id === itemId);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedItems,
        selectionMode,
        toggleSelectionMode,
        selectItem,
        deselectItem,
        clearSelection,
        isSelected,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

// Custom hook to use the selection context
export const useSelection = () => useContext(SelectionContext);
