import React from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

interface TabInfo {
  id: string;
  name: string;
  icon?: React.ElementType;
  content: React.ReactNode;
  hasResources?: boolean;
  owner?: string | "Neutral";
}

interface TabGroupComponentProps {
  tabs: TabInfo[];
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  iconOnly?: boolean; // New prop to control icon-only display
}

export const TabGroupComponent: React.FC<TabGroupComponentProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  className = "",
  iconOnly = false
}) => {
  return (
    <TabGroup
      className={`flex w-full flex-col ${className}`}
      selectedIndex={tabs.findIndex((tab) => tab.id === selectedTab)}
      onChange={(index) => onTabChange(tabs[index].id)}
    >
      <TabList className="flex space-x-1 rounded-md bg-slate-800 p-1">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <Tab
              key={tab.id}
              title={tab.name}
              className={({ selected }) => {
                const hasResources = tab.hasResources ?? true;
                const owner = tab.owner || "Neutral";
                
                return `flex w-full items-center justify-center rounded-lg py-2 text-sm ${
                  selected
                    ? "bg-slate-700 text-white shadow"
                    : "cursor-pointer text-slate-400 hover:bg-slate-800 hover:text-white"
                } ${!hasResources && !selected ? "opacity-50" : ""} ${
                  owner === "Empire" && hasResources ? "text-blue-300" : ""
                } ${
                  owner === "Rebellion" && hasResources ? "text-red-300" : ""
                } transition-all duration-100 ease-in-out`;
              }}
            >
              {iconOnly ? (
                TabIcon && <TabIcon className="h-10 w-10" />
              ) : (
                <>
                  {TabIcon && <TabIcon className="h-6 w-6 mr-1" />}
                  <span className="hidden sm:inline">{tab.name}</span>
                </>
              )}
            </Tab>
          );
        })}
      </TabList>

      <TabPanels className="mt-2 flex-1">
        {tabs.map((tab) => (
          <TabPanel key={tab.id} className="rounded-md p-1 flex-1 flex flex-col">
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};
