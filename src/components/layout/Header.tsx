import React from 'react';
import { Menu, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CloudSyncBadge } from './CloudSyncBadge';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { currentTab } = useApp();

  const getPageInfo = () => {
    switch (currentTab) {
      case 'dashboard':
        return {
          title: 'Panel General (Dashboard)',
          breadcrumb: 'Inicio / Vista General y Métricas Clave'
        };
      case 'empleados':
        return {
          title: 'Gestión de Empleados',
          breadcrumb: 'Recursos / Padrón y Registro de Personal'
        };
      case 'compensaciones':
        return {
          title: 'Control de Días de Compensación',
          breadcrumb: 'Operaciones / Registro 1:1 y Programación'
        };
      case 'feriados':
        return {
          title: 'Catálogo de Feriados',
          breadcrumb: 'Configuración / Calendario Oficial y No Laborables'
        };
      default:
        return {
          title: 'Sistema de Compensaciones',
          breadcrumb: 'ADPmodul'
        };
    }
  };

  const pageInfo = getPageInfo();

  // Fecha actual formateada
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Abrir menú lateral"
        >
          <Menu size={22} />
        </button>
        <div className="header-title-container">
          <h1 className="header-title">{pageInfo.title}</h1>
          <span className="header-breadcrumb">{pageInfo.breadcrumb}</span>
        </div>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <CloudSyncBadge />
        <div className="system-date-badge" title="Fecha del sistema">
          <Calendar size={15} style={{ color: '#2563eb' }} />
          <span style={{ textTransform: 'capitalize' }}>{dateFormatted}</span>
        </div>
      </div>
    </header>
  );
};

