import React, { useState, useMemo } from 'react';
import {
  Database, Upload, Download, CheckCircle2, Table,
  FileSpreadsheet, Info, AlertTriangle, XCircle, Eye, Trash2
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { db } from '../../storage';
import { employeeService, compensationService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import { CreateEmpleadoDto } from '../../types';
import { employeeRepository, compensationRepository } from '../../storage';
import { parseDateString, formatDateDisplay } from '../../utils/dateUtils';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Types for the preview table
// ─────────────────────────────────────────────────────────────────────────────
type PreviewStatus = 'ok' | 'duplicate' | 'not_found' | 'invalid_date' | 'empty';

interface CompPreviewRow {
  rowNum: number;
  rawDni: string;
  fechaGenerada: string;    // YYYY-MM-DD or empty
  fechaGeneradaRaw: string; // as pasted
  observacion: string;
  status: PreviewStatus;
  statusMsg: string;
  empleadoNombre?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Parse the raw textarea text into preview rows (live, no side effects)
// ─────────────────────────────────────────────────────────────────────────────
const parseCompensationPreview = (
  text: string,
  employees: ReturnType<typeof employeeRepository.getAll>,
  existingCompensations: ReturnType<typeof compensationRepository.getAll>
): CompPreviewRow[] => {
  if (!text.trim()) return [];

  const lines = text.trim().split(/\r?\n/);
  const rows: CompPreviewRow[] = [];
  // Track pairs seen in this batch to catch intra-batch duplicates
  const seenPairs = new Set<string>();

  let rowNum = 0;

  lines.forEach((line) => {
    if (!line.trim() || line.startsWith('#')) return;

    // Skip header rows
    const lower = line.toLowerCase();
    if (
      lower.includes('apellidos y nombres') ||
      lower.includes('nro. documento') ||
      lower.includes('fecha generada') ||
      lower.includes('fecha trabajada') ||
      lower.includes('horas extras') ||
      (lower.includes('código') && lower.includes('cargo'))
    ) return;

    rowNum++;

    // Split columns
    const raw = line.includes('\t') ? line.split('\t') : line.split(/[,;]/);
    const cols = raw.map((c) => c.trim().replace(/^['\"`]+|['\"`]+$/g, ''));

    if (cols.length === 0 || !cols[0]) return;

    let rawDni = '';
    let fechaGeneradaRaw = '';
    let observacion = '';

    if (cols.length >= 11) {
      // FORMAT A: 22-column report
      rawDni = cols[0];
      fechaGeneradaRaw = cols[10];
      const horasExtras = cols[21] || '';
      const cargo = cols[5] || '';
      observacion = cargo
        ? `${cargo}${horasExtras ? ` | HE: ${horasExtras}h` : ''}`
        : horasExtras ? `Horas extras: ${horasExtras}h` : '';
    } else if (cols.length >= 2) {
      // FORMAT B: simple
      rawDni = cols[0];
      fechaGeneradaRaw = cols[1];
      observacion = cols[3] || '';
    } else {
      rows.push({
        rowNum,
        rawDni: cols[0] || '',
        fechaGenerada: '',
        fechaGeneradaRaw: '',
        observacion: '',
        status: 'invalid_date',
        statusMsg: 'Faltan columnas (se requiere DNI y Fecha).'
      });
      return;
    }

    // Empty DNI
    if (!rawDni) {
      rows.push({
        rowNum,
        rawDni: '',
        fechaGenerada: '',
        fechaGeneradaRaw,
        observacion,
        status: 'empty',
        statusMsg: 'DNI / Código vacío.'
      });
      return;
    }

    // Parse date
    const fechaGenerada = parseDateString(fechaGeneradaRaw);
    if (!fechaGenerada) {
      rows.push({
        rowNum,
        rawDni,
        fechaGenerada: '',
        fechaGeneradaRaw,
        observacion,
        status: 'invalid_date',
        statusMsg: `Fecha "${fechaGeneradaRaw}" no reconocida. Use DD/MM/YYYY.`
      });
      return;
    }

    // Find employee
    const idTerm = rawDni.trim().toUpperCase();
    const emp = employees.find(
      (e) => e.codigo.toUpperCase() === idTerm || e.documentoIdentidad === idTerm
    );

    if (!emp) {
      rows.push({
        rowNum,
        rawDni,
        fechaGenerada,
        fechaGeneradaRaw,
        observacion,
        status: 'not_found',
        statusMsg: `DNI/Código "${rawDni}" no está registrado en el sistema.`
      });
      return;
    }

    // Check duplicate in DB (excluding ANULADO)
    const dbDuplicate = existingCompensations.find(
      (c) =>
        c.empleadoId === emp.id &&
        c.fechaGenerada === fechaGenerada &&
        c.estado !== 'ANULADO'
    );

    // Check intra-batch duplicate
    const pairKey = `${emp.id}__${fechaGenerada}`;
    const batchDuplicate = seenPairs.has(pairKey);

    if (dbDuplicate || batchDuplicate) {
      rows.push({
        rowNum,
        rawDni,
        fechaGenerada,
        fechaGeneradaRaw,
        observacion,
        status: 'duplicate',
        statusMsg: dbDuplicate
          ? `${emp.apellidosNombres} ya tiene el día ${formatDateDisplay(fechaGenerada)} registrado (${dbDuplicate.estado}).`
          : `Fila duplicada dentro de los datos pegados.`,
        empleadoNombre: emp.apellidosNombres
      });
      return;
    }

    seenPairs.add(pairKey);
    rows.push({
      rowNum,
      rawDni,
      fechaGenerada,
      fechaGeneradaRaw,
      observacion,
      status: 'ok',
      statusMsg: 'Listo para importar',
      empleadoNombre: emp.apellidosNombres
    });
  });

  return rows;
};

// ─────────────────────────────────────────────────────────────────────────────
// Status badge component
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ row: CompPreviewRow }> = ({ row }) => {
  const styles: Record<PreviewStatus, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
    ok:           { bg: '#f0fdf4', color: '#16a34a', icon: <CheckCircle2 size={12} />, label: '✓ Listo' },
    duplicate:    { bg: '#fffbeb', color: '#b45309', icon: <AlertTriangle size={12} />, label: '⚠ Duplicado' },
    not_found:    { bg: '#fef2f2', color: '#dc2626', icon: <XCircle size={12} />, label: '✗ DNI no existe' },
    invalid_date: { bg: '#fef2f2', color: '#dc2626', icon: <XCircle size={12} />, label: '✗ Fecha inválida' },
    empty:        { bg: '#f8fafc', color: '#64748b', icon: <XCircle size={12} />, label: '✗ Vacío' },
  };
  const s = styles[row.status];
  return (
    <span
      title={row.statusMsg}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '3px',
        background: s.bg, color: s.color,
        padding: '2px 7px', borderRadius: '12px',
        fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap',
        cursor: 'help'
      }}
    >
      {s.icon} {s.label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Modal Component
// ─────────────────────────────────────────────────────────────────────────────
export const DataManagementModal: React.FC<DataManagementModalProps> = ({ isOpen, onClose }) => {
  const { success, error } = useToast();
  const { triggerRefresh } = useApp();

  const [activeTab, setActiveTab] = useState<'employees' | 'compensations' | 'backup'>('employees');

  // Employee CSV / Excel input
  const [employeeText, setEmployeeText] = useState('');
  const [employeeResults, setEmployeeResults] = useState<{ imported: number; errors: string[] } | null>(null);

  // Compensation CSV input
  const [compensationText, setCompensationText] = useState('');
  const [compensationResults, setCompensationResults] = useState<{ imported: number; errors: string[] } | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // ── Sample data ──────────────────────────────────────────────────────────
  const sampleEmployeeExcel = `10000001\tPEREZ ROJAS JUAN CARLOS\t10000001\t15/01/2026\tADMINISTRACIÓN\tCONTABILIDAD\tASISTENTE CONTABLE\tACTIVO\t
10000002\tGARCIA LOPEZ MARIA ELENA\t10000002\t01/02/2026\tOPERACIONES\tPLANTA\tOPERARIO DE PRODUCCION\tACTIVO\t`;

  const sampleCompensationExcel = `10000001\t01/05/2026\t\tGuardia feriado Día del Trabajo
10000002\t29/06/2026\t15/07/2026\tCompensación programada San Pedro`;

  // ── Live preview (memoized — recalculates only when text changes) ─────────
  const previewRows = useMemo(() => {
    if (!compensationText.trim() || activeTab !== 'compensations') return [];
    const employees = employeeRepository.getAll();
    const existing = compensationRepository.getAll();
    return parseCompensationPreview(compensationText, employees, existing);
  }, [compensationText, activeTab, compensationResults]); // re-run after import too

  const previewStats = useMemo(() => {
    const ok = previewRows.filter((r) => r.status === 'ok').length;
    const dup = previewRows.filter((r) => r.status === 'duplicate').length;
    const notFound = previewRows.filter((r) => r.status === 'not_found').length;
    const invalid = previewRows.filter((r) => r.status === 'invalid_date' || r.status === 'empty').length;
    return { ok, dup, notFound, invalid, total: previewRows.length };
  }, [previewRows]);

  // ── Parse and import employees ───────────────────────────────────────────
  const handleImportEmployees = () => {
    if (!employeeText.trim()) {
      error('Pegue o escriba las filas de empleados desde su Excel.');
      return;
    }

    const lines = employeeText.trim().split(/\r?\n/);
    const parsed: CreateEmpleadoDto[] = [];
    const parseErrors: string[] = [];

    lines.forEach((line, idx) => {
      if (!line.trim() || line.startsWith('#')) return;

      // Skip header line if user copied column names
      const lower = line.toLowerCase();
      if (
        lower.includes('apellidos') ||
        lower.includes('doc ident') ||
        lower.includes('fecha ingr') ||
        lower.includes('estado trabajador') ||
        (lower.includes('codigo') && lower.includes('area'))
      ) {
        return;
      }

      // Split by tab (if copied from Excel) or comma/semicolon
      const isTab = line.includes('\t');
      const cols = isTab
        ? line.split('\t').map((c) => c.trim().replace(/^['\"`]+|['\"`]+$/g, ''))
        : line.split(/[,;]/).map((c) => c.trim().replace(/^['\"`]+|['\"`]+$/g, ''));

      if (cols.length < 3) {
        parseErrors.push(`Fila #${idx + 1}: Faltan columnas mínimas requeridas (Código, Nombres, Documento).`);
        return;
      }

      const codigo = cols[0] || '';
      const apellidosNombres = cols[1] || '';
      const documentoIdentidad = cols[2] || cols[0];
      const fechaIngreso = parseDateString(cols[3]) || new Date().toISOString().split('T')[0];
      const tipoTrabajador = cols[4] || 'EMPLEADOS AGRÍCOLAS';
      const area = cols[5] || 'GENERAL';
      const cargo = cols[6] || 'OPERADOR';
      const rawEstado = (cols[7] || '').toUpperCase();
      const estado: 'ACTIVO' | 'CESADO' = rawEstado.includes('CESAD') ? 'CESADO' : 'ACTIVO';
      const fechaCese = estado === 'CESADO' && cols[8] ? parseDateString(cols[8]) : null;

      parsed.push({
        codigo,
        apellidosNombres,
        documentoIdentidad,
        fechaIngreso,
        fechaCese,
        tipoTrabajador,
        area,
        cargo,
        estado
      });
    });

    if (parsed.length === 0) {
      error('No se pudo procesar ninguna fila válida.');
      return;
    }

    const res = employeeService.bulkCreate(parsed);
    setEmployeeResults({
      imported: res.importedCount,
      errors: [...parseErrors, ...res.errors]
    });

    if (res.importedCount > 0) {
      success(`Se importaron ${res.importedCount} empleado(s) correctamente.`);
      triggerRefresh();
    }
  };

  // ── Parse and import compensations ───────────────────────────────────────
  const handleImportCompensations = () => {
    if (!compensationText.trim()) {
      error('Pegue los datos de compensación para importar.');
      return;
    }

    // Use already-previewed rows to avoid re-parsing
    const toImport = previewRows.filter((r) => r.status === 'ok');

    if (toImport.length === 0) {
      const hasErrors = previewRows.some(
        (r) => r.status === 'not_found' || r.status === 'invalid_date' || r.status === 'empty'
      );
      const hasDups = previewRows.some((r) => r.status === 'duplicate');

      if (hasErrors && !hasDups) {
        error('No hay registros válidos para importar. Revisa los errores en la tabla de previsualización.');
      } else if (hasDups && !hasErrors) {
        error('Todos los registros ya están registrados (duplicados). No hay nada nuevo que importar.');
      } else {
        error('No hay registros nuevos válidos para importar. Revisa la tabla de previsualización.');
      }
      return;
    }

    // Re-run bulkCreate with only valid rows
    const lines = compensationText.trim().split(/\r?\n/);
    const items: {
      identificadorTrabajador: string;
      fechaGenerada: string;
      fechaCompensacion?: string | null;
      observacion?: string;
    }[] = [];
    const parseErrors: string[] = [];

    lines.forEach((line, idx) => {
      if (!line.trim() || line.startsWith('#')) return;

      const lower = line.toLowerCase();
      if (
        lower.includes('apellidos y nombres') ||
        lower.includes('nro. documento') ||
        lower.includes('fecha generada') ||
        lower.includes('fecha trabajada') ||
        lower.includes('horas extras') ||
        (lower.includes('código') && lower.includes('cargo'))
      ) {
        return;
      }

      const raw = line.includes('\t') ? line.split('\t') : line.split(/[,;]/);
      const cols = raw.map((c) => c.trim().replace(/^['\"`]+|['\"`]+$/g, ''));

      if (cols.length === 0 || !cols[0]) return;

      let identificadorTrabajador = '';
      let fechaGenerada = '';
      let observacion = '';

      if (cols.length >= 11) {
        identificadorTrabajador = cols[0];
        fechaGenerada = parseDateString(cols[10]);
        const horasExtras = cols[21] || '';
        const cargo = cols[5] || '';
        observacion = cargo
          ? `${cargo}${horasExtras ? ` | HE: ${horasExtras}h` : ''}`
          : horasExtras
          ? `Horas extras: ${horasExtras}h`
          : '';
      } else {
        if (cols.length < 2) {
          parseErrors.push(`Fila #${idx + 1}: Faltan datos (se requiere DNI/Código y Fecha trabajada).`);
          return;
        }
        identificadorTrabajador = cols[0];
        fechaGenerada = parseDateString(cols[1]);
        observacion = cols[3] || '';
      }

      if (!identificadorTrabajador) {
        parseErrors.push(`Fila #${idx + 1}: DNI/Código vacío.`);
        return;
      }

      if (!fechaGenerada) {
        parseErrors.push(`Fila #${idx + 1} (${identificadorTrabajador}): Fecha no reconocida.`);
        return;
      }

      items.push({
        identificadorTrabajador,
        fechaGenerada,
        fechaCompensacion: null,
        observacion
      });
    });

    if (items.length === 0) {
      error('No se encontraron registros válidos.');
      return;
    }

    const res = compensationService.bulkCreate(items);
    setCompensationResults({
      imported: res.importedCount,
      errors: [...parseErrors, ...res.errors]
    });

    if (res.importedCount > 0) {
      success(`Se importaron ${res.importedCount} día(s) de compensación exitosamente.`);
      triggerRefresh();
    } else if (res.errors.length > 0) {
      error(`No se pudo importar ningún registro. Revise los errores en la tabla.`);
    }
  };

  // ── File Upload Handlers ─────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'emp' | 'comp') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        if (target === 'emp') setEmployeeText(text);
        else setCompensationText(text);
      }
    };
    reader.readAsText(file);
  };

  // ── Export JSON Backup ───────────────────────────────────────────────────
  const handleExportBackup = () => {
    const json = db.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `backup_sistema_compensaciones_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success('Copia de seguridad descargada exitosamente en formato JSON.', 'Backup');
  };

  // ── Import JSON Backup ───────────────────────────────────────────────────
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      const res = db.importBackup(content);
      if (res.success) {
        success('Copia de seguridad restaurada correctamente.', 'Restauración Exitosa');
        triggerRefresh();
        onClose();
      } else {
        error(res.error || 'Error al restaurar copia de seguridad.');
      }
    };
    reader.readAsText(file);
  };

  // ── Clear Database ───────────────────────────────────────────────────────
  const handleClearDatabase = () => {
    if (
      window.confirm(
        '¿Está seguro de que desea limpiar toda la base de datos? Se eliminarán todos los empleados y compensaciones cargadas. (Se conservarán los feriados oficiales 2026).'
      )
    ) {
      db.clearAllData(true);
      success('Base de datos limpiada correctamente. Se eliminaron todos los empleados y compensaciones.', 'Data Limpiada');
      triggerRefresh();
      onClose();
    }
  };

  // ── Load Sample Demo Data ──────────────────────────────────────────────────
  const handleLoadSampleData = async () => {
    if (
      window.confirm(
        '¿Desea cargar la data de prueba con 5 trabajadores y 50 días de compensación registrados en 2026?'
      )
    ) {
      await db.loadSampleData();
      success('Se cargaron 5 empleados y 50 registros de compensación exitosamente.', 'Data Demo Cargada');
      triggerRefresh();
      onClose();
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={22} style={{ color: '#2563eb' }} />
          <span>Gestión de Datos y Carga Masiva (Excel / Backup)</span>
        </div>
      }
      footer={
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'employees' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('employees')}
          >
            <FileSpreadsheet size={15} />
            Plantilla Empleados (Excel)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'compensations' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('compensations')}
          >
            <Table size={15} />
            Días de Compensación (Excel)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'backup' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('backup')}
          >
            <Download size={15} />
            Copia de Seguridad (Backup)
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: EMPLOYEES BULK IMPORT                                       */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'employees' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.875rem 1rem', fontSize: '0.825rem', color: '#166534' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Info size={16} />
                <span>Compatible 100% con tu Plantilla de Excel:</span>
              </div>
              <p style={{ margin: 0 }}>
                Puedes seleccionar y copiar las filas de tu Excel (con o sin encabezado) y pegarlas aquí directamente. El sistema detecta automáticamente fechas como <code>DD/MM/YYYY</code> (ej. <code>15/09/2025</code>) y columnas separadas por tabulaciones.
              </p>
              <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
                <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', background: '#ffffff', border: '1px solid #cbd5e1' }}>
                  <thead style={{ background: '#ea580c', color: '#ffffff' }}>
                    <tr>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>1. Codigo</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>2. APELLIDOS Y NOMBRES</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>3. Doc Ident.</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>4. Fecha Ingr.</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>5. Tipo Trab.</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>6. Area</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>7. Cargo</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>8. ESTADO TRABAJADOR</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>9. FECHA CESE</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label className="form-label">Pegar filas copiadas de Excel o CSV:</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <label className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer' }}>
                    <Upload size={13} />
                    <span>Cargar archivo .CSV / .TXT</span>
                    <input type="file" accept=".csv,.txt" onChange={(e) => handleFileUpload(e, 'emp')} style={{ display: 'none' }} />
                  </label>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', color: '#ea580c' }}
                    onClick={() => setEmployeeText(sampleEmployeeExcel)}
                  >
                    Ver ejemplo de tu plantilla
                  </button>
                </div>
              </div>
              <textarea
                className="form-textarea"
                rows={7}
                style={{ fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'pre' }}
                placeholder="Pegue aquí las filas copiadas directamente de su Excel (Ctrl + V)..."
                value={employeeText}
                onChange={(e) => setEmployeeText(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button variant="primary" onClick={handleImportEmployees} icon={<Upload size={16} />}>
                Procesar y Cargar Empleados
              </Button>
            </div>

            {employeeResults && (
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: employeeResults.imported > 0 ? '#059669' : '#dc2626' }}>
                  <CheckCircle2 size={18} />
                  <span>Resultado: {employeeResults.imported} empleado(s) importados correctamente.</span>
                </div>
                {employeeResults.errors.length > 0 && (
                  <div style={{ marginTop: '0.5rem', maxHeight: '140px', overflowY: 'auto' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b91c1c' }}>Advertencias / Errores:</span>
                    <ul style={{ fontSize: '0.75rem', color: '#dc2626', paddingLeft: '1.25rem' }}>
                      {employeeResults.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: COMPENSATIONS BULK IMPORT                                  */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'compensations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Info box */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.875rem 1rem', fontSize: '0.825rem', color: '#1e40af' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Info size={16} />
                <span>Compatible con el Reporte de Compensación Laboral (22 columnas)</span>
              </div>
              <p style={{ margin: '0 0 0.5rem' }}>
                Copia y pega las filas directamente desde tu reporte. El encabezado es ignorado automáticamente. Los DNI con espacios se limpian solos.
              </p>
              {/* Column mapping table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.7rem', borderCollapse: 'collapse', background: '#ffffff', border: '1px solid #bfdbfe' }}>
                  <thead style={{ background: '#2563eb', color: '#ffffff' }}>
                    <tr>
                      <th style={{ padding: '3px 6px', border: '1px solid #bfdbfe' }}>Col 1</th>
                      <th style={{ padding: '3px 6px', border: '1px solid #bfdbfe' }}>Col 2</th>
                      <th style={{ padding: '3px 6px', border: '1px solid #bfdbfe' }}>Col 6</th>
                      <th style={{ padding: '3px 6px', border: '1px solid #bfdbfe' }}>Col 11</th>
                      <th style={{ padding: '3px 6px', border: '1px solid #bfdbfe' }}>Col 22</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: '#eff6ff' }}>
                      <td style={{ padding: '3px 6px', border: '1px solid #bfdbfe', fontWeight: 600, color: '#1e3a8a' }}>✅ Código (DNI)</td>
                      <td style={{ padding: '3px 6px', border: '1px solid #bfdbfe', color: '#64748b' }}>Apellidos y Nombres</td>
                      <td style={{ padding: '3px 6px', border: '1px solid #bfdbfe', color: '#64748b' }}>✅ Cargo</td>
                      <td style={{ padding: '3px 6px', border: '1px solid #bfdbfe', fontWeight: 600, color: '#1e3a8a' }}>✅ Fecha</td>
                      <td style={{ padding: '3px 6px', border: '1px solid #bfdbfe', color: '#64748b' }}>Horas Extras</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 6px', border: '1px solid #bfdbfe', fontSize: '0.65rem', color: '#374151' }} colSpan={5}>
                        Las columnas marcadas con ✅ se usan. El resto se ignora. También acepta formato simple: <code>DNI [Tab] DD/MM/YYYY</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Textarea */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label className="form-label">Pegar filas del Reporte de Excel:</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', color: '#64748b' }}
                    onClick={() => setShowPreview((v) => !v)}
                  >
                    <Eye size={13} />
                    {showPreview ? 'Ocultar' : 'Mostrar'} previsualización
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', color: '#2563eb' }}
                    onClick={() => setCompensationText(sampleCompensationExcel)}
                  >
                    Cargar texto de ejemplo
                  </button>
                </div>
              </div>
              <textarea
                className="form-textarea"
                rows={5}
                style={{ fontFamily: 'monospace', fontSize: '0.75rem', whiteSpace: 'pre' }}
                placeholder={"Pega aquí las filas del reporte (con o sin encabezado):\n76691593\tABAD AGUILAR, YUMAR ABEL\t76691593\tMASCULINO\t079\tINSPECTOR...\t\t\tCA3\tPLANTA SECHIN\t23/07/2026\tPRESENTE\t2.00\t07:02:30\t19:16:41\t\t\t\t\t12.23\t8.00\t4.23"}
                value={compensationText}
                onChange={(e) => { setCompensationText(e.target.value); setCompensationResults(null); }}
              />
            </div>

            {/* ── PREVIEW TABLE ──────────────────────────────────────────────── */}
            {showPreview && previewRows.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Stats bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={14} /> Previsualización ({previewStats.total} fila{previewStats.total !== 1 ? 's' : ''})
                  </span>
                  {previewStats.ok > 0 && (
                    <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '0.72rem' }}>
                      ✓ {previewStats.ok} listas
                    </span>
                  )}
                  {previewStats.dup > 0 && (
                    <span style={{ background: '#fffbeb', color: '#b45309', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '0.72rem' }}>
                      ⚠ {previewStats.dup} duplicada{previewStats.dup !== 1 ? 's' : ''}
                    </span>
                  )}
                  {previewStats.notFound > 0 && (
                    <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '0.72rem' }}>
                      ✗ {previewStats.notFound} DNI no encontrado{previewStats.notFound !== 1 ? 's' : ''}
                    </span>
                  )}
                  {previewStats.invalid > 0 && (
                    <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '0.72rem' }}>
                      ✗ {previewStats.invalid} fecha inválida
                    </span>
                  )}
                </div>

                {/* Hint for not-found */}
                {previewStats.notFound > 0 && (
                  <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px',
                    padding: '0.5rem 0.75rem', fontSize: '0.78rem', color: '#b91c1c',
                    display: 'flex', alignItems: 'flex-start', gap: '0.4rem'
                  }}>
                    <AlertTriangle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>
                      <strong>{previewStats.notFound} fila{previewStats.notFound !== 1 ? 's' : ''}</strong> tiene{previewStats.notFound !== 1 ? 'n' : ''} un DNI/Código que <strong>no está registrado</strong> en el sistema.
                      Para importarlas primero debes registrar al trabajador en la pestaña <em>"Plantilla Empleados (Excel)"</em> o desde el módulo de Trabajadores.
                    </span>
                  </div>
                )}

                {/* Hint for duplicates */}
                {previewStats.dup > 0 && (
                  <div style={{
                    background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px',
                    padding: '0.5rem 0.75rem', fontSize: '0.78rem', color: '#92400e',
                    display: 'flex', alignItems: 'flex-start', gap: '0.4rem'
                  }}>
                    <AlertTriangle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>
                      <strong>{previewStats.dup} fila{previewStats.dup !== 1 ? 's' : ''} duplicada{previewStats.dup !== 1 ? 's' : ''}</strong>: ese trabajador ya tiene ese día registrado. Solo se importarán las {previewStats.ok} filas marcadas en verde.
                    </span>
                  </div>
                )}

                {/* Preview table */}
                <div style={{ overflowX: 'auto', maxHeight: '260px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead style={{ position: 'sticky', top: 0, background: '#1e293b', color: '#ffffff', zIndex: 1 }}>
                      <tr>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>#</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>DNI / Código</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Trabajador encontrado</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Fecha trabajada</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Observación</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => {
                        const rowBg = row.status === 'ok'
                          ? (i % 2 === 0 ? '#f0fdf4' : '#dcfce7')
                          : row.status === 'duplicate'
                          ? (i % 2 === 0 ? '#fffbeb' : '#fef3c7')
                          : (i % 2 === 0 ? '#fef2f2' : '#fee2e2');

                        return (
                          <tr key={i} style={{ background: rowBg }}>
                            <td style={{ padding: '5px 10px', color: '#64748b', fontWeight: 600 }}>{row.rowNum}</td>
                            <td style={{ padding: '5px 10px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                              {row.rawDni || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>(vacío)</span>}
                            </td>
                            <td style={{ padding: '5px 10px', color: row.empleadoNombre ? '#1e293b' : '#ef4444' }}>
                              {row.empleadoNombre
                                ? <span style={{ fontWeight: 600 }}>{row.empleadoNombre}</span>
                                : <span style={{ fontStyle: 'italic', color: '#ef4444' }}>No encontrado</span>
                              }
                            </td>
                            <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: row.fechaGenerada ? '#1e293b' : '#ef4444' }}>
                              {row.fechaGenerada
                                ? formatDateDisplay(row.fechaGenerada)
                                : <span style={{ color: '#ef4444', fontStyle: 'italic' }}>{row.fechaGeneradaRaw || '(vacío)'}</span>
                              }
                            </td>
                            <td style={{ padding: '5px 10px', color: '#475569', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                              title={row.observacion}>
                              {row.observacion || <span style={{ color: '#94a3b8' }}>—</span>}
                            </td>
                            <td style={{ padding: '5px 10px' }}>
                              <StatusBadge row={row} />
                              {row.status !== 'ok' && (
                                <div style={{ fontSize: '0.67rem', color: '#64748b', marginTop: '2px', maxWidth: '200px' }}>
                                  {row.statusMsg}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
              {previewStats.ok > 0 && (
                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                  {previewStats.ok} fila{previewStats.ok !== 1 ? 's' : ''} listas para importar
                </span>
              )}
              <Button
                variant="primary"
                onClick={handleImportCompensations}
                icon={<Upload size={16} />}
                disabled={previewRows.length > 0 && previewStats.ok === 0}
              >
                Procesar y Cargar Compensaciones
              </Button>
            </div>

            {/* Results panel */}
            {compensationResults && (
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: compensationResults.imported > 0 ? '#059669' : '#dc2626' }}>
                  <CheckCircle2 size={18} />
                  <span>Resultado: {compensationResults.imported} registro(s) importados correctamente.</span>
                </div>
                {compensationResults.errors.length > 0 && (
                  <div style={{ marginTop: '0.5rem', maxHeight: '140px', overflowY: 'auto' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b91c1c' }}>Advertencias / Errores:</span>
                    <ul style={{ fontSize: '0.75rem', color: '#dc2626', paddingLeft: '1.25rem' }}>
                      {compensationResults.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: BACKUP & RESTORE                                            */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'backup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                📥 Descargar Copia de Seguridad Completa
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                Guarda un archivo <code>.json</code> con todos tus empleados, feriados y compensaciones registradas para tener respaldo permanente o llevarlo a otra computadora.
              </p>
              <Button variant="primary" onClick={handleExportBackup} icon={<Download size={16} />}>
                Descargar Archivo JSON de Respaldo
              </Button>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                📤 Restaurar Copia de Seguridad
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                Carga un archivo de respaldo JSON generado previamente para recuperar toda tu información de inmediato.
              </p>
              <label className="btn btn-secondary" style={{ display: 'inline-flex', cursor: 'pointer' }}>
                <Upload size={16} />
                <span>Seleccionar archivo JSON...</span>
                <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
              </label>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#166534', marginBottom: '0.25rem' }}>
                🚀 Cargar Data Demo (5 Empleados y 50 Compensaciones 2026)
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#14532d', marginBottom: '1rem' }}>
                Carga un conjunto completo de 5 trabajadores de diferentes áreas (TI, Mantenimiento, Calidad, Producción, Logística) y 50 días de compensación generados a lo largo del 2026 en diferentes estados (Pendientes, Programados, Compensados).
              </p>
              <Button variant="success" onClick={handleLoadSampleData} icon={<CheckCircle2 size={16} />}>
                Cargar 5 Empleados y 50 Registros de Prueba
              </Button>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.25rem' }}>
                🗑️ Limpiar / Vaciar Base de Datos
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#7f1d1d', marginBottom: '1rem' }}>
                Elimina todos los empleados y compensaciones registradas en el sistema. Los feriados oficiales del 2026 se conservarán.
              </p>
              <Button variant="danger" onClick={handleClearDatabase} icon={<Trash2 size={16} />}>
                Limpiar Todos los Datos
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
