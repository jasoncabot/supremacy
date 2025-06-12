import React from 'react';
import { SelectableItem, useSelectionContext } from '../hooks/useSelectionContext';
import UnitContextMenu from './UnitContextMenu';

interface ImagePair {
  foreground: string; // URL or path to foreground image
  background: string; // URL or path to background image
}

interface MiniCardViewProps {
  imagePairs: ImagePair[];
  displayText: string;
  selectableItem?: SelectableItem; // Optional - if provided, makes the card selectable
}

const MiniCardView: React.FC<MiniCardViewProps> = ({ imagePairs, displayText, selectableItem }) => {
  const { selectionMode, selectionState, selectItem, deselectItem, isSelected } = useSelectionContext();
  
  const handleClick = () => {
    if (!selectableItem || selectionMode === 'none') return;
    
    // In target selection mode, don't allow deselecting
    if (selectionState === "awaiting-target") {
      selectItem(selectableItem);
      return;
    }
    
    const selected = isSelected(selectableItem.id);
    if (selected) {
      deselectItem(selectableItem.id);
    } else {
      selectItem(selectableItem);
    }
  };

  const isCardSelected = selectableItem ? isSelected(selectableItem.id) : false;
  const isClickable = selectableItem && selectionMode !== 'none';
  const isTargetMode = selectionState === "awaiting-target";
  
  // Show context menu when not in selection or target mode
  const showContextMenu = selectableItem && selectionMode === 'none' && selectionState === 'idle';

  const cardContent = (
    <div 
      className={`flex flex-col items-center ${isClickable ? 'cursor-pointer' : ''} ${
        isCardSelected ? 'transform scale-105' : ''
      } ${
        isTargetMode ? 'ring-2 ring-orange-400 ring-offset-1 ring-offset-slate-900 bg-orange-400/10' : ''
      } transition-all duration-150 rounded p-1`}
      onClick={handleClick}
    >
      <div className="flex flex-wrap justify-center gap-2">
        {imagePairs.map((pair, index) => (
          <div
            key={index}
            className={`relative h-[30px] w-[70px] rounded overflow-hidden ${
              isCardSelected ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900' : ''
            }`}
            style={{
              backgroundImage: `url(${pair.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <img
              src={pair.foreground}
              alt={`Foreground ${index + 1}`}
              className="absolute inset-0 h-full w-full object-contain"
            />
            {isCardSelected && (
              <div className="absolute inset-0 bg-blue-400/20 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {displayText && (
        <span className={`mt-2 text-sm ${
          isCardSelected ? 'text-blue-300' : 
          isTargetMode ? 'text-orange-300' : 
          'text-slate-400'
        }`}>
          {displayText}
        </span>
      )}
    </div>
  );

  return showContextMenu ? (
    <UnitContextMenu unit={selectableItem}>
      {cardContent}
    </UnitContextMenu>
  ) : (
    cardContent
  );
};

export default MiniCardView;
