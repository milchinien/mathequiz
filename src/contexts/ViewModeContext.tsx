'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type ViewMode = 'grid' | 'sidebar';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('grid');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);

    // Check localStorage for saved preference
    const saved = localStorage.getItem('viewMode');
    if (saved && (saved === 'grid' || saved === 'sidebar')) {
      setViewModeState(saved as ViewMode);
    } else {
      // Default to grid
      setViewModeState('grid');
      localStorage.setItem('viewMode', 'grid');
    }
  }, []);

  useEffect(() => {
    // Only update localStorage on client side after initial hydration
    if (isClient) {
      localStorage.setItem('viewMode', viewMode);
    }
  }, [viewMode, isClient]);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
  };

  const toggleViewMode = () => {
    setViewModeState(prev => prev === 'grid' ? 'sidebar' : 'grid');
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}