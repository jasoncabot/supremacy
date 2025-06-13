import React from 'react';

interface TwoColumnLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  className?: string;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  leftPanel,
  rightPanel,
  className = ""
}) => {
  return (
    <div className={`flex flex-1 ${className}`}>
      <div className="w-1/3 pr-4 border-r border-slate-700 flex flex-col">
        {leftPanel}
      </div>
      <div className="w-2/3 pl-4 flex flex-col">
        {rightPanel}
      </div>
    </div>
  );
};
