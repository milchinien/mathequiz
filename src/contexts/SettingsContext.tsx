'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  menuSize: number; // 50-200%
  // Audio settings
  audioEnabled: boolean;
  masterVolume: number; // 0-100
  soundEffectsVolume: number; // 0-100
  musicVolume: number; // 0-100
  // Other settings
  notificationsEnabled: boolean;
  autoSaveProgress: boolean;
}

interface SettingsContextType {
  settings: Settings;
  pendingSettings: Settings;
  updatePendingSettings: (newSettings: Partial<Settings>) => void;
  saveSettings: () => void;
  cancelChanges: () => void;
  resetSettings: () => void;
  hasUnsavedChanges: boolean;
}

const defaultSettings: Settings = {
  menuSize: 100,
  audioEnabled: true,
  masterVolume: 100,
  soundEffectsVolume: 100,
  musicVolume: 50,
  notificationsEnabled: true,
  autoSaveProgress: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [pendingSettings, setPendingSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('appSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const loadedSettings = { ...defaultSettings, ...parsed };
        setSettings(loadedSettings);
        setPendingSettings(loadedSettings);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Apply menu size to CSS variable
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.style.setProperty(
        '--menu-size-scale',
        (settings.menuSize / 100).toString()
      );
    }
  }, [settings.menuSize, isLoaded]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(pendingSettings);

  const updatePendingSettings = (newSettings: Partial<Settings>) => {
    setPendingSettings(prev => ({ ...prev, ...newSettings }));
  };

  const saveSettings = () => {
    setSettings(pendingSettings);
    localStorage.setItem('appSettings', JSON.stringify(pendingSettings));
  };

  const cancelChanges = () => {
    setPendingSettings(settings);
  };

  const resetSettings = () => {
    setPendingSettings(defaultSettings);
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      pendingSettings,
      updatePendingSettings,
      saveSettings,
      cancelChanges,
      resetSettings,
      hasUnsavedChanges
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};