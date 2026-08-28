import React, { useState, useMemo } from 'react';
import {
  CalendarClock,
  Calendar,
  ArrowRight,
  PlusCircle,
  Edit2,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import { CompensacionConEmpleado, FilterOptions } from '../../types';
import { compensationService, employeeService } from '../../services';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchBar } from '../common/SearchBar';
import { Pagination } from '../common/Pagination';
import { RegisterPendingDayModal } from './RegisterPendingDayModal';
import { EditCompensationModal } from './EditCompensationModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { formatDateDisplay } from '../../utils/dateUtils';
import { exportGlobalCompensationsToExcel } from '../../utils/excelExport';

export const GlobalCompensationList: React.FC = () => {
  const { openEmployeeCompensations, refreshKey, triggerRefresh } = useApp();
  const { success, error } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('TODOS');
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedArea, setSelectedArea] = useState('TODOS');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [compensationToEdit, setCompensationToEdit] = useState<CompensacionConEmpleado | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [compensationToDelete, setCompensationToDelete] = useState<CompensacionConEmpleado | null>(null);

  const handleOpenEditModal = (comp: CompensacionConEmpleado) => {
    setCompensationToEdit(comp);
    setIsEditModalOpen(true);
  };

  const handlePromptDelete = (comp: CompensacionConEmpleado) => {
    setCompensationToDelete(comp);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!compensationToDelete) return;
    const res = compensationService.delete(compensationToDelete.id);
    if (res.success) {
      success('Registro de compensación eliminado exitosamente.', 'Registro Eliminado');
      triggerRefresh();
    } else {
      error(res.error || 'Error al eliminar registro.');
    }
  };

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

  const handleExportExcel = () => {
    if (compensations.length === 0) {
      return;
    }

    exportGlobalCompensationsToExcel(compensations, 'Reporte_Compensaciones');

    success(
      `Se descargó el archivo Excel (.xlsx) con ${compensations.length} registro(s).`,
      'Excel Generado con Éxito'
    );
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            Registro General de Compensaciones
          </h2>
          <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
            {compensations.length} registro(s) {searchTerm || selectedEstado !== 'TODOS' || selectedYear > 0 || selectedArea !== 'TODOS' ? 'filtrado(s)' : 'históricos y activos'}
            {totalPages > 1 && ` • Pág. ${safeCurrentPage}/${totalPages}`}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportExcel}
            disabled={compensations.length === 0}
            icon={<FileSpreadsheet size={14} style={{ color: '#16a34a' }} />}
            title="Descargar lista en formato Microsoft Excel (.xlsx)"
          >
            Exportar Excel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRegisterModalOpen(true)}
            icon={<PlusCircle size={15} />}
          >
            Registrar Día Trabajado
          </Button>
        </div>
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
                      <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>
                        {c.empleado?.apellidosNombres || 'Desconocido'}
                      </strong>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                        DNI: {c.empleado?.documentoIdentidad}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          background: '#f1f5f9',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}
                      >
                        {c.empleado?.area || '-'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} style={{ color: '#2563eb' }} />
                        <strong style={{ color: '#0f172a', fontSize: '0.825rem' }}>
                          {formatDate(c.fechaGenerada)}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <Badge status={c.estado} />
                    </td>
                    <td>
                      {c.fechaCompensacion ? (
                        <strong style={{ color: '#047857', fontSize: '0.825rem' }}>
                          {formatDate(c.fechaCompensacion)}
                        </strong>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>-</span>
                      )}
                    </td>
                    <td style={{ maxWidth: '200px', fontSize: '0.8rem', color: '#475569' }}>
                      {c.observacion || '-'}
                      {c.motivoAnulacion && (
                        <div style={{ color: '#dc2626', fontSize: '0.7rem' }}>
                          Anulado: {c.motivoAnulacion}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.3rem', alignItems: 'center' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEditModal(c)}
                          icon={<Edit2 size={13} />}
                          title="Modificar compensación"
                        >
                          Editar
                        </Button>

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => handlePromptDelete(c)}
                          title="Eliminar registro permanentemente"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={13} />
                        </button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEmployeeCompensations(c.empleadoId)}
                          icon={<ArrowRight size={13} />}
                          iconPosition="right"
                          title="Ir al panel individual del trabajador"
                        >
                          Ver Ficha
                        </Button>
                      </div>
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

      {/* Modal: Editar Compensación */}
      <EditCompensationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        compensation={compensationToEdit}
        employee={compensationToEdit?.empleado}
        onSuccess={() => triggerRefresh()}
      />

      {/* Confirm Modal: Eliminar */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar registro de compensación?"
        message={`¿Está seguro de eliminar permanentemente la compensación de ${compensationToDelete?.empleado?.apellidosNombres} (${formatDate(compensationToDelete?.fechaGenerada)})?`}
        confirmText="Eliminar Definitivamente"
        variant="danger"
      />

      <RegisterPendingDayModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => triggerRefresh()}
      />
    </div>
  );
};
