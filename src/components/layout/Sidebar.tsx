import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  CalendarDays,
  RotateCcw,
  Sparkles,
  Database,
  Printer,
  LogOut
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { DataManagementModal } from '../common/DataManagementModal';
import { SanFlavioPrayerModal } from './SanFlavioPrayerModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentTab, setCurrentTab, resetDatabaseToDefaults } = useApp();
  const { user, logout } = useAuth();
  const { success } = useToast();
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);

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
          {/* Card de San Flavio (Clickable para abrir la Oración) */}
          <div
            className="san-flavio-card"
            onClick={() => setIsPrayerModalOpen(true)}
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.98) 100%)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '0.55rem 0.45rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Haga clic para rezar a San Flavio (El Padre Sueldo)"
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <img
                src="/san-flavio.png"
                alt="San Flavio"
                style={{
                  maxHeight: '130px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
                  transition: 'transform 0.25s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#fbbf24',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'block',
                  textShadow: '0 1px 3px rgba(0,0,0,0.9)'
                }}
              >
                SAN FLAVIO
              </span>
              <span style={{ fontSize: '0.625rem', color: '#cbd5e1', fontWeight: 600 }}>
                Patrono de los Sueldos 🙏
              </span>
            </div>
          </div>

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

          {/* User Session Profile & Logout */}
          {user && (
            <div
              style={{
                marginTop: '0.4rem',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    flexShrink: 0
                  }}
                >
                  FM
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.nombre}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    RRHH Admin
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Cerrar Sesión Segura"
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '6px',
                  padding: '0.35rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                  e.currentTarget.style.color = '#f87171';
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Data Management & Bulk Import Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />

      {/* Modal Devocionario: Oración a San Flavio (El Padre Sueldo) */}
      <SanFlavioPrayerModal
        isOpen={isPrayerModalOpen}
        onClose={() => setIsPrayerModalOpen(false)}
      />
    </>
  );
};

