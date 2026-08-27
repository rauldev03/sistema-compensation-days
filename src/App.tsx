import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { EmployeeListView } from './components/employees/EmployeeListView';
import { CompensationsMainView } from './components/compensations/CompensationsMainView';
import { HolidayListView } from './components/holidays/HolidayListView';

const MainViewRouter: React.FC = () => {
  const { currentTab } = useApp();

  switch (currentTab) {
    case 'dashboard':
      return <DashboardView />;
    case 'empleados':
      return <EmployeeListView />;
    case 'compensaciones':
      return <CompensationsMainView />;
    case 'feriados':
      return <HolidayListView />;
    default:
      return <DashboardView />;
  }
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppProvider>
        <AppLayout>
          <MainViewRouter />
        </AppLayout>
      </AppProvider>
    </ToastProvider>
  );
};

export default App;
