import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../storage';

export type NavigationTab = 'dashboard' | 'empleados' | 'compensaciones' | 'feriados';

interface AppContextType {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedEmployeeIdForCompensations: string | null;
  setSelectedEmployeeIdForCompensations: (id: string | null) => void;
  openEmployeeCompensations: (employeeId: string) => void;
  refreshKey: number;
  triggerRefresh: () => void;
  resetDatabaseToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedEmployeeIdForCompensations, setSelectedEmployeeIdForCompensations] =
    useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setRefreshKey((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  const openEmployeeCompensations = (employeeId: string) => {
    setSelectedEmployeeIdForCompensations(employeeId);
    setCurrentTab('compensaciones');
  };

  const resetDatabaseToDefaults = () => {
    db.resetToDefaults();
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedEmployeeIdForCompensations,
        setSelectedEmployeeIdForCompensations,
        openEmployeeCompensations,
        refreshKey,
        triggerRefresh,
        resetDatabaseToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};
