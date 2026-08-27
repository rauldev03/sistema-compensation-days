import React, { useState, useMemo } from 'react';
import {
  CalendarClock,
  Calendar,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { CompensacionConEmpleado, FilterOptions } from '../../types';
import { compensationService, employeeService } from '../../services';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchBar } from '../common/SearchBar';
import { Pagination } from '../common/Pagination';
import { RegisterPendingDayModal } from './RegisterPendingDayModal';
import { formatDateDisplay } from '../../utils/dateUtils';

export const GlobalCompensationList: React.FC = () => {
  const { openEmployeeCompensations, refreshKey, triggerRefresh } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('TODOS');
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedArea, setSelectedArea] = useState('TODOS');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const availableYears = useMemo(() => compensationService.getAvailableYears(), [refreshKey]);
  const distinctAreas = useMemo(() => employeeService.getDistinctAreas(), [refreshKey]);

  const compensations: CompensacionConEmpleado[] = useMemo(() => {
    const filters: FilterOptions = {
      search: searchTerm,
      estado: selectedEstado,
      year: selectedYear > 0 ? selectedYear : undefined,
      area: selectedArea
    };
    return compensationService.getAll(filters);
  }, [searchTerm, selectedEstado, selectedYear, selectedArea, refreshKey]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedEstado, selectedYear, selectedArea]);

  const totalCompensations = compensations.length;
  const totalPages = Math.max(1, Math.ceil(totalCompensations / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedCompensations = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * pageSize;
    return compensations.slice(startIdx, startIdx + pageSize);
  }, [compensations, safeCurrentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const formatDate = (dateStr?: string | null) => formatDateDisplay(dateStr);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Registro General de Compensaciones
          </h2>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
            {compensations.length} registro(s) {searchTerm || selectedEstado !== 'TODOS' || selectedYear > 0 || selectedArea !== 'TODOS' ? 'filtrado(s)' : 'históricos y activos'}
            {totalPages > 1 && ` • Página ${safeCurrentPage} de ${totalPages}`}
          </span>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsRegisterModalOpen(true)}
          icon={<PlusCircle size={18} />}
        >
          Registrar Día Trabajado
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="filter-bar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por DNI, Código o Trabajador..."
        />

        <select
          className="filter-select"
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
        >
          <option value="TODOS">Todos los Estados</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="PROGRAMADO">PROGRAMADO</option>
          <option value="COMPENSADO">COMPENSADO</option>
          <option value="ANULADO">ANULADO</option>
        </select>

        <select
          className="filter-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
        >
          <option value={0}>Todos los Años</option>
          {availableYears.map((yr) => (
            <option key={yr} value={yr}>
              Año {yr}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <option value="TODOS">Todas las Áreas</option>
          {distinctAreas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Global Table */}
      <div className="table-wrapper">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>Área</th>
                <th>Día Trabajado</th>
                <th>Estado</th>
                <th>Fecha Compensación</th>
                <th>Observación</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {compensations.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <CalendarClock className="empty-state-icon" />
                      <div className="empty-state-title">No se encontraron compensaciones</div>
                      <div className="empty-state-desc">
                        Ajuste los filtros o registre un nuevo día trabajado.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCompensations.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>
                        {c.empleado?.apellidosNombres || 'Desconocido'}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        DNI: {c.empleado?.documentoIdentidad}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          background: '#f1f5f9',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        {c.empleado?.area || '-'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Calendar size={14} style={{ color: '#2563eb' }} />
                        <strong style={{ color: '#0f172a' }}>
                          {formatDate(c.fechaGenerada)}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <Badge status={c.estado} />
                    </td>
                    <td>
                      {c.fechaCompensacion ? (
                        <strong style={{ color: '#047857' }}>
                          {formatDate(c.fechaCompensacion)}
                        </strong>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td style={{ maxWidth: '220px', fontSize: '0.85rem', color: '#475569' }}>
                      {c.observacion || '-'}
                      {c.motivoAnulacion && (
                        <div style={{ color: '#dc2626', fontSize: '0.75rem' }}>
                          Anulado: {c.motivoAnulacion}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEmployeeCompensations(c.empleadoId)}
                        icon={<ArrowRight size={14} />}
                        iconPosition="right"
                        title="Ir al panel individual del trabajador"
                      >
                        Gestionar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={safeCurrentPage}
          totalItems={totalCompensations}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 25, 50, 100, 250]}
          itemLabel="compensaciones"
        />
      </div>

      <RegisterPendingDayModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => triggerRefresh()}
      />
    </div>
  );
};
