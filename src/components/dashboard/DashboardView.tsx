import React from 'react';
import {
  Users,
  Clock,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  UserCheck,
  Calendar
} from 'lucide-react';
import { dashboardService } from '../../services';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Button } from '../common/Button';

export const DashboardView: React.FC = () => {
  const { openEmployeeCompensations, setCurrentTab } = useApp();
  const metrics = dashboardService.getMetrics();

  return (
    <div className="flex flex-col gap-6">
      {/* 4 KPI Metrics */}
      <div className="stat-grid">
        <StatCard
          label="Trabajadores Activos"
          value={metrics.trabajadoresActivos}
          icon={<Users size={26} />}
          colorTheme="blue"
          onClick={() => setCurrentTab('empleados')}
        />

        <StatCard
          label="Total Días Pendientes"
          value={metrics.totalDiasPendientes}
          icon={<Clock size={26} />}
          colorTheme="amber"
          onClick={() => setCurrentTab('compensaciones')}
        />

        <StatCard
          label="Compensaciones Programadas"
          value={metrics.compensacionesProgramadas}
          icon={<CalendarCheck size={26} />}
          colorTheme="indigo"
          onClick={() => setCurrentTab('compensaciones')}
        />

        <StatCard
          label="Compensaciones Realizadas"
          value={metrics.compensacionesRealizadas}
          icon={<CheckCircle2 size={26} />}
          colorTheme="emerald"
          onClick={() => setCurrentTab('compensaciones')}
        />
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem' }}>
        {/* Table: Trabajadores con más días pendientes */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={20} style={{ color: '#d97706' }} />
              <span>Trabajadores con más días pendientes de compensación</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentTab('compensaciones')}
              icon={<ArrowUpRight size={14} />}
              iconPosition="right"
            >
              Ir a Compensaciones
            </Button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trabajador</th>
                  <th>Documento (DNI)</th>
                  <th>Área</th>
                  <th>Cargo</th>
                  <th style={{ textAlign: 'center' }}>Días Pendientes</th>
                  <th style={{ textAlign: 'center' }}>Programados</th>
                  <th style={{ textAlign: 'center' }}>Compensados</th>
                  <th style={{ textAlign: 'right' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topTrabajadoresPendientes.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="empty-state">
                        <CheckCircle2 className="empty-state-icon" style={{ color: '#10b981' }} />
                        <div className="empty-state-title">
                          No hay trabajadores con días pendientes
                        </div>
                        <div className="empty-state-desc">
                          Todos los días de compensación registrados han sido atendidos o no se han generado días trabajados aún.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  metrics.topTrabajadoresPendientes.map((item) => (
                    <tr
                      key={item.empleadoId}
                      style={{ cursor: 'pointer' }}
                      onClick={() => openEmployeeCompensations(item.empleadoId)}
                      title="Haga clic para abrir el panel de compensaciones de este trabajador"
                    >
                      <td>
                        <strong style={{ color: '#0f172a' }}>{item.nombre}</strong>
                      </td>
                      <td>{item.documento}</td>
                      <td>
                        <span
                          style={{
                            background: '#f1f5f9',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                        >
                          {item.area}
                        </span>
                      </td>
                      <td style={{ color: '#64748b' }}>{item.cargo}</td>
                      <td style={{ textAlign: 'center' }}>
                        {item.diasPendientes > 0 ? (
                          <span
                            className="badge badge-pending"
                            style={{ fontSize: '0.8125rem', padding: '0.2rem 0.6rem' }}
                          >
                            <span className="badge-dot" />
                            {item.diasPendientes} {item.diasPendientes === 1 ? 'día' : 'días'}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>0</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {item.diasProgramados > 0 ? (
                          <span className="badge badge-scheduled" style={{ fontSize: '0.8rem' }}>
                            {item.diasProgramados}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>0</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {item.diasCompensados > 0 ? (
                          <span className="badge badge-compensated" style={{ fontSize: '0.8rem' }}>
                            {item.diasCompensados}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>0</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEmployeeCompensations(item.empleadoId);
                          }}
                          icon={<ChevronRight size={14} />}
                          iconPosition="right"
                        >
                          Administrar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick System Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.5rem', borderRadius: '8px' }}>
                <Calendar size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Regla Fundamental del Sistema</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Relación 1 a 1 de Compensaciones</span>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              Cada <strong>1 día trabajado</strong> genera estrictamente <strong>1 día pendiente</strong> y tiene exactamente <strong>1 fecha de compensación</strong>. No se admiten rangos ni compensaciones fraccionadas.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.5rem', borderRadius: '8px' }}>
                <UserCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Flujo de Estados</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Ciclo de vida operativo</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8125rem' }}>
              <span className="badge badge-pending">PENDIENTE</span>
              <span style={{ color: '#94a3b8' }}>➔</span>
              <span className="badge badge-scheduled">PROGRAMADO</span>
              <span style={{ color: '#94a3b8' }}>➔</span>
              <span className="badge badge-compensated">COMPENSADO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
