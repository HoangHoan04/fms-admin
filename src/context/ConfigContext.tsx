import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export interface AppSettings {
  fontSize: "small" | "medium" | "large";
  sidebarPosition: "left" | "right";
  showTabHeader: boolean;
  settingsPanelPosition: "left" | "right";
  maxTabs: number;
  notifications: boolean;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  showSidebarIcon: boolean;
  sidebarAccordion: boolean;
}

export interface FooterSettings {
  showFooter: boolean;
  footerContent: string;
  showVersion: boolean;
  showCopyright: boolean;
}

interface ConfigContextType {
  settings: AppSettings;
  footerSettings: FooterSettings;
  updateSettings: (key: keyof AppSettings, value: any) => void;
  updateFooterSettings: (newSettings: FooterSettings) => void;
  resetSettings: () => void;
  onAutoLogout?: () => void;
  onWarning?: () => void;
}

const defaultSettings: AppSettings = {
  fontSize: "medium",
  sidebarPosition: "left",
  showTabHeader: true,
  settingsPanelPosition: "right",
  maxTabs: 10,
  notifications: true,
  sidebarWidth: 270,
  sidebarCollapsedWidth: 80,
  showSidebarIcon: true,
  sidebarAccordion: true,
};

const defaultFooterSettings: FooterSettings = {
  showFooter: true,
  footerContent: "© 2024 Your Company",
  showVersion: true,
  showCopyright: true,
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{
  children: React.ReactNode;
  onAutoLogout?: () => void;
  onWarning?: () => void;
}> = ({ children, onAutoLogout, onWarning }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem("appSettings");
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (error) {
      return defaultSettings;
    }
  });

  const [footerSettings, setFooterSettings] = useState<FooterSettings>(() => {
    try {
      const saved = localStorage.getItem("footerSettings");
      return saved ? JSON.parse(saved) : defaultFooterSettings;
    } catch (error) {
      return defaultFooterSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("appSettings", JSON.stringify(settings));
    } catch (error) {
      throw error;
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem("footerSettings", JSON.stringify(footerSettings));
    } catch (error) {
      throw error;
    }
  }, [footerSettings]);

  useEffect(() => {
    const root = document.documentElement;
    switch (settings.fontSize) {
      case "small":
        root.style.fontSize = "14px";
        break;
      case "medium":
        root.style.fontSize = "16px";
        break;
      case "large":
        root.style.fontSize = "18px";
        break;
    }
  }, [settings.fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-sidebar-position", settings.sidebarPosition);
  }, [settings.sidebarPosition]);

  const onAutoLogoutRef = useRef(onAutoLogout);
  const onWarningRef = useRef(onWarning);
  useEffect(() => {
    onAutoLogoutRef.current = onAutoLogout;
  }, [onAutoLogout]);
  useEffect(() => {
    onWarningRef.current = onWarning;
  }, [onWarning]);

  const updateSettings = (key: keyof AppSettings, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      return newSettings;
    });
  };

  const updateFooterSettings = (newSettings: FooterSettings) => {
    setFooterSettings(newSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setFooterSettings(defaultFooterSettings);
    try {
      localStorage.removeItem("appSettings");
      localStorage.removeItem("footerSettings");
    } catch (error) {
      throw error;
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        settings,
        footerSettings,
        updateSettings,
        updateFooterSettings,
        resetSettings,
        onAutoLogout,
        onWarning,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
};
