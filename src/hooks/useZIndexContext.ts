// Simple shared z-index counter - persists across re-renders and hot reloads
let globalZIndexCounter = 1000;

export const useZIndex = () => {
  const getNextZIndex = () => {
    globalZIndexCounter += 10;
    return globalZIndexCounter;
  };

  return { getNextZIndex };
};
