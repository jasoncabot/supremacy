import React, { useEffect, useState } from 'react';
import { useWindowContext } from '../hooks/useWindowContext';

/**
 * An overlay that blocks touch interactions with the page
 * when windows are being dragged to prevent body scrolling on mobile
 */
const TouchBlockingOverlay: React.FC = () => {
  const { openWindows } = useWindowContext();
  const [isDragging, setIsDragging] = useState(false);
  
  // Listen for a custom event that the DraggableWindow component will dispatch
  useEffect(() => {
    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => setIsDragging(false);
    
    // Prevent scroll when dragging windows
    const preventScroll = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    window.addEventListener('window-drag-start', handleDragStart);
    window.addEventListener('window-drag-end', handleDragEnd);
    
    // Add a passive false listener to document for scroll events
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      window.removeEventListener('window-drag-start', handleDragStart);
      window.removeEventListener('window-drag-end', handleDragEnd);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isDragging]);
  
  // Only show the overlay when there are open windows and dragging is happening
  if (!openWindows.length || !isDragging) {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 z-[99] bg-transparent touch-none"
      style={{ pointerEvents: 'all' }}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
    />
  );
};

export default TouchBlockingOverlay;
