import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  CalendarDays,
  RotateCcw,
  Sparkles,
  Database,
  Printer
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { dashboardService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { DataManagementModal } from '../common/DataManagementModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentTab, setCurrentTab, resetDatabaseToDefaults } = useApp();
  const { success } = useToast();
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  const metrics = dashboardService.getMetrics();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />
    },
    {
      id: 'empleados',
      label: 'Empleados',
      icon: <Users size={20} />,
      badge: metrics.trabajadoresActivos
    },
    {
      id: 'compensaciones',
      label: 'Compensaciones',
      icon: <CalendarClock size={20} />,
      badge: metrics.totalDiasPendientes > 0 ? metrics.totalDiasPendientes : undefined
    },
    {
      id: 'feriados',
      label: 'Feriados',
      icon: <CalendarDays size={20} />
    },
    {
      id: 'permisos',
      label: 'Hoja de Permiso',
      icon: <Printer size={20} />
    }
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setCurrentTab(tabId);
    onClose();
  };

  const handleReset = () => {
    if (
      window.confirm(
        '¿Desea limpiar toda la información? Se eliminarán todos los empleados y compensaciones cargadas (los feriados oficiales 2026 se mantendrán).'
      )
    ) {
      resetDatabaseToDefaults();
      success('Base de datos limpiada. Se eliminaron todos los empleados y compensaciones.', 'Data Limpiada');
    }
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header / Brand */}
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <Sparkles size={22} />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">ADPmodul</span>
            <span className="sidebar-brand-subtitle">Compensaciones</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Módulos Principales</div>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge !== undefined && item.id === 'compensaciones' && (
                  <span className="nav-item-badge" title="Días pendientes">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            className="db-reset-button"
            onClick={() => setIsDataModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0.05) 100%)',
              color: '#93c5fd',
              borderColor: 'rgba(59, 130, 246, 0.3)'
            }}
            title="Importar Excel/CSV o descargar copia de seguridad"
          >
            <Database size={14} />
            <span>Carga Masiva / Backup</span>
          </button>

          <button
            type="button"
            className="db-reset-button"
            onClick={handleReset}
            title="Limpiar base de datos (elimina empleados y compensaciones)"
          >
            <RotateCcw size={14} />
            <span>Limpiar Toda la Data</span>
          </button>
        </div>
      </aside>

      {/* Data Management & Bulk Import Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </>
  );
};
