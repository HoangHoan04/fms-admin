import { useTheme } from "@/context/ThemeContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useState } from "react";

type Tab = {
  key: string;
  title: string;
  content: React.ReactNode;
  icon?: string;
};

interface BaseViewProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  tabs?: Tab[];
}

const BaseView: React.FC<BaseViewProps> = ({ children, isLoading, tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (isLoading) {
    return (
      <div className="base-view relative flex h-full flex-col items-center justify-center p-3">
        <ProgressSpinner />
      </div>
    );
  }

  if (tabs && tabs.length > 0) {
    return (
      <div
        className={`base-view flex h-full flex-col overflow-hidden ${
          isDark ? "bg-[#1f1f1f]" : "bg-[#dee1e6]"
        }`}
      >
        <style>{`
          .base-view-tabs .p-tabview-nav {
            background: transparent !important;
            border: none !important;
            display: flex !important;
            align-items: end !important;
            padding: 8px 12px 0 12px !important;
            gap: 4px !important;
          }

          .base-view-tabs .p-tabview-nav li {
            margin-right: -4px !important;
            border: none !important;
          }

          .base-view-tabs .p-tabview-nav li .p-tabview-nav-link {
            border: none !important;
            border-radius: 8px 8px 0 0 !important;
            height: 34px !important;
            padding: 0 16px !important;
            font-size: 12px !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            transition: background 0.15s ease-in-out, color 0.15s ease-in-out !important;
            position: relative !important;
            background: ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} !important;
            color: ${isDark ? "#9aa0a6" : "#80868b"} !important;
            box-shadow: none !important;
          }

          .base-view-tabs .p-tabview-nav li:not(.p-highlight) .p-tabview-nav-link:hover {
            background: ${isDark ? "#323234" : "rgba(0,0,0,0.08)"} !important;
            color: ${isDark ? "#c8cacd" : "#3c4043"} !important;
          }

          .base-view-tabs.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link,
          .base-view-tabs .p-tabview-nav li.p-highlight .p-tabview-nav-link,
          .base-view-tabs .p-tabview-nav li.p-highlight > .p-tabview-nav-link {
            background: ${isDark ? "#2d2e31" : "#ffffff"} !important;
            color: ${isDark ? "#8ab4f8" : "#1a73e8"} !important;
            font-weight: 700 !important;
            z-index: 10 !important;
            box-shadow: none !important;
            border-top: 3px solid ${isDark ? "#8ab4f8" : "#1a73e8"} !important;
            border-bottom: none !important;
          }

          .base-view-tabs .p-tabview-nav li.p-highlight .p-tabview-nav-link::before,
          .base-view-tabs .p-tabview-nav li.p-highlight .p-tabview-nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            width: 16px;
            height: 16px;
            pointer-events: none;
          }
          .base-view-tabs .p-tabview-nav li.p-highlight .p-tabview-nav-link::before {
            left: -16px;
            border-bottom-right-radius: 12px;
            box-shadow: 6px 6px 0 ${isDark ? "#2d2e31" : "#ffffff"};
          }
          .base-view-tabs .p-tabview-nav li.p-highlight .p-tabview-nav-link::after {
            right: -16px;
            border-bottom-left-radius: 12px;
            box-shadow: -6px 6px 0 ${isDark ? "#2d2e31" : "#ffffff"};
          }

          .base-view-tabs .p-tabview-panels {
            flex: 1 !important;
            background: ${isDark ? "#2d2e31" : "#ffffff"} !important;
            overflow-y: auto !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 0 !important;
          }

          .base-view-tabs .p-tabview-panel {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            overflow-y: auto !important;
          }

          .base-view-tabs .p-tabview-ink-bar {
            display: none !important;
          }
        `}</style>

        <TabView
          className="base-view-tabs flex flex-1 flex-col overflow-hidden"
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {tabs.map((tab) => (
            <TabPanel
              key={tab.key}
              header={tab.title}
              leftIcon={tab.icon ? `${tab.icon} mr-2 text-sm` : undefined}
            >
              <div className="flex h-full flex-col overflow-y-auto">{tab.content}</div>
            </TabPanel>
          ))}
        </TabView>
      </div>
    );
  }

  return (
    <div
      className={`base-view flex h-full flex-col overflow-hidden ${
        isDark ? "bg-[#2d2e31]" : "bg-white"
      }`}
    >
      <div className="custom-scrollbar flex-1 overflow-y-auto p-3">{children}</div>
    </div>
  );
};

export { BaseView };
