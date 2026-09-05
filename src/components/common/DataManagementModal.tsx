import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
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
import { CreateEmpleadoDto, EstadoCompensacion } from '../../types';
import { employeeRepository, compensationRepository } from '../../storage';
import { parseDateString, formatDateDisplay } from '../../utils/dateUtils';

export type DataManagementMode = 'all' | 'employees' | 'compensations' | 'backup';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: DataManagementMode;
  defaultTab?: 'employees' | 'compensations' | 'backup';
}

// ─────────────────────────────────────────────────────────────────────────────
// Types for the preview table
// ─────────────────────────────────────────────────────────────────────────────
type PreviewStatus = 'ok' | 'duplicate' | 'not_found' | 'invalid_date' | 'empty';

interface CompPreviewRow {
  rowNum: number;
  rawDni: string;
  empleadoNombre?: string;
  fechaGenerada: string;    // YYYY-MM-DD
  fechaGeneradaRaw: string; // original
  estado: EstadoCompensacion;
  fechaCompensada: string | null; // YYYY-MM-DD
  fechaCompensadaRaw: string;     // original
  observacion: string;
  status: PreviewStatus;
  statusMsg: string;
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
      lower.includes('fecha compensada') ||
      (lower.includes('dni') && lower.includes('fecha')) ||
      (lower.includes('fecha') && lower.includes('estado'))
    ) return;

    rowNum++;

    // Split columns (tab-separated from Excel or comma/semicolon)
    const raw = line.includes('\t') ? line.split('\t') : line.split(/[,;]/);
    const cols = raw.map((c) => c.trim().replace(/^['\"`]+|['\"`]+$/g, ''));

    if (cols.length === 0 || !cols[0]) return;

    let rawDni = '';
    let nombrePasted = '';
    let fechaGeneradaRaw = '';
    let estadoRaw = 'PENDIENTE';
    let fechaCompensadaRaw = '';
    let observacion = '';

    if (cols.length >= 4) {
      // Estructura Oficial de 5 columnas:
      // Col 0: DNI
      // Col 1: Apellidos y Nombres
      // Col 2: Fecha (Fecha generada)
      // Col 3: ESTADO (COMPENSADO, PENDIENTE, etc.)
      // Col 4: Fecha Compensada (si existe)
      rawDni = cols[0];
      nombrePasted = cols[1];
      fechaGeneradaRaw = cols[2];
      estadoRaw = cols[3] || 'PENDIENTE';
      fechaCompensadaRaw = cols[4] || '';
      observacion = cols[5] || '';
    } else if (cols.length === 3) {
      rawDni = cols[0];
      nombrePasted = cols[1];
      fechaGeneradaRaw = cols[2];
      estadoRaw = 'PENDIENTE';
    } else if (cols.length === 2) {
      rawDni = cols[0];
      fechaGeneradaRaw = cols[1];
      estadoRaw = 'PENDIENTE';
    } else {
      rows.push({
        rowNum,
        rawDni: cols[0] || '',
        fechaGenerada: '',
        fechaGeneradaRaw: '',
        estado: 'PENDIENTE',
        fechaCompensada: null,
        fechaCompensadaRaw: '',
        observacion: '',
        status: 'empty',
        statusMsg: 'Faltan columnas (se requiere al menos DNI y Fecha).'
      });
      return;
    }

    // Empty DNI
    if (!rawDni) {
      rows.push({
        rowNum,
        rawDni: '',
        fechaGenerada: '',
        fechaGeneradaRaw: '',
        estado: 'PENDIENTE',
        fechaCompensada: null,
        fechaCompensadaRaw: '',
        observacion,
        status: 'empty',
        statusMsg: 'DNI / Código vacío.'
      });
      return;
    }

    // Normalizar Estado
    let estado: EstadoCompensacion = 'PENDIENTE';
    const estUpper = estadoRaw.trim().toUpperCase();
    if (estUpper.includes('COMPENSAD')) {
      estado = 'COMPENSADO';
    } else if (estUpper.includes('PROGRAMAD')) {
      estado = 'PROGRAMADO';
    } else if (estUpper.includes('ANULAD')) {
      estado = 'ANULADO';
    } else {
      estado = 'PENDIENTE';
    }

    // Parse fecha trabajada (fecha generada)
    const fechaGenerada = parseDateString(fechaGeneradaRaw);
    if (!fechaGenerada) {
      rows.push({
        rowNum,
        rawDni,
        empleadoNombre: nombrePasted || undefined,
        fechaGenerada: '',
        fechaGeneradaRaw,
        estado,
        fechaCompensada: null,
        fechaCompensadaRaw,
        observacion,
        status: 'invalid_date',
        statusMsg: `Fecha trabajada "${fechaGeneradaRaw}" no válida. Use DD/MM/AAAA.`
      });
      return;
    }

    // Parse fecha compensada (si fue proporcionada)
    let fechaCompensada: string | null = null;
    if (fechaCompensadaRaw && fechaCompensadaRaw.trim()) {
      fechaCompensada = parseDateString(fechaCompensadaRaw);
      if (!fechaCompensada) {
        rows.push({
          rowNum,
          rawDni,
          empleadoNombre: nombrePasted || undefined,
          fechaGenerada,
          fechaGeneradaRaw,
          estado,
          fechaCompensada: null,
          fechaCompensadaRaw,
          observacion,
          status: 'invalid_date',
          statusMsg: `Fecha compensada "${fechaCompensadaRaw}" no válida. Use DD/MM/AAAA.`
        });
        return;
      }
    }

    // Buscar empleado por DNI o código
    const idTerm = rawDni.trim().toUpperCase();
    let emp = employees.find(
      (e) => e.codigo.toUpperCase() === idTerm || e.documentoIdentidad === idTerm
    );

    // Fallback: buscar por nombre si el DNI difiere ligeramente
    if (!emp && nombrePasted) {
      const cleanName = nombrePasted.trim().toUpperCase();
      emp = employees.find((e) => e.apellidosNombres.toUpperCase() === cleanName);
    }

    if (!emp) {
      rows.push({
        rowNum,
        rawDni,
        empleadoNombre: nombrePasted || undefined,
        fechaGenerada,
        fechaGeneradaRaw,
        estado,
        fechaCompensada,
        fechaCompensadaRaw,
        observacion,
        status: 'not_found',
        statusMsg: `Trabajador DNI "${rawDni}" no está registrado en el sistema.`
      });
      return;
    }

    // Validar duplicado en base de datos
    const dbDuplicate = existingCompensations.find(
      (c) =>
        c.empleadoId === emp.id &&
        c.fechaGenerada === fechaGenerada &&
        c.estado !== 'ANULADO'
    );

    // Validar duplicado en el mismo lote pegado
    const pairKey = `${emp.id}__${fechaGenerada}`;
    const batchDuplicate = seenPairs.has(pairKey);

    if (dbDuplicate || batchDuplicate) {
      rows.push({
        rowNum,
        rawDni,
        empleadoNombre: emp.apellidosNombres,
        fechaGenerada,
        fechaGeneradaRaw,
        estado,
        fechaCompensada,
        fechaCompensadaRaw,
        observacion,
        status: 'duplicate',
        statusMsg: dbDuplicate
          ? `${emp.apellidosNombres} ya tiene el día ${formatDateDisplay(fechaGenerada)} registrado (${dbDuplicate.estado}).`
          : `Fila duplicada en el archivo.`,
      });
      return;
    }

    seenPairs.add(pairKey);
    rows.push({
      rowNum,
      rawDni,
      empleadoNombre: emp.apellidosNombres,
      fechaGenerada,
      fechaGeneradaRaw,
      estado,
      fechaCompensada,
      fechaCompensadaRaw,
      observacion,
      status: 'ok',
      statusMsg: 'Listo para importar'
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
export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  mode = 'all',
  defaultTab
}) => {
  const { success, error } = useToast();
  const { triggerRefresh } = useApp();

  const getInitialTab = (): 'employees' | 'compensations' | 'backup' => {
    if (mode && mode !== 'all') return mode;
    return defaultTab || 'employees';
  };

  const [activeTab, setActiveTab] = useState<'employees' | 'compensations' | 'backup'>(getInitialTab);

  React.useEffect(() => {
    if (isOpen) {
      if (mode && mode !== 'all') {
        setActiveTab(mode);
      } else if (defaultTab) {
        setActiveTab(defaultTab);
      }
    }
  }, [isOpen, mode, defaultTab]);

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

  const sampleCompensationExcel = `DNI\tApellidos y Nombres\tFecha\tESTADO\tFecha Compensada
46356926\tISLA SANTAMARIA RODRIGO RAYMUNDO\t26/04/2026\tCOMPENSADO\t18/05/2026
46356926\tISLA SANTAMARIA RODRIGO RAYMUNDO\t29/06/2026\tPENDIENTE\t
42935726\tVALDEZ ZACARIAS JULIO ARMANDO\t07/05/2023\tCOMPENSADO\t04/04/2026
42935726\tVALDEZ ZACARIAS JULIO ARMANDO\t29/06/2023\tPENDIENTE\t`;

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
      error('Pegue o cargue los datos de compensación para importar.');
      return;
    }

    // Usar directamente las filas validadas en la previsualización
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

    const items = toImport.map((row) => ({
      identificadorTrabajador: row.rawDni,
      fechaGenerada: row.fechaGenerada,
      estado: row.estado,
      fechaCompensacion: row.fechaCompensada || null,
      observacion: row.observacion || ''
    }));

    const res = compensationService.bulkCreate(items);
    setCompensationResults({
      imported: res.importedCount,
      errors: res.errors
    });

    if (res.importedCount > 0) {
      success(`Se importaron ${res.importedCount} día(s) de compensación exitosamente.`);
      triggerRefresh();
    } else if (res.errors.length > 0) {
      error(`No se pudo importar ningún registro. Revise los errores en la tabla.`);
    }
  };

  // ── File Upload Handlers (soporta .xlsx, .xls, .csv, .txt) ───────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'emp' | 'comp') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const tsv = XLSX.utils.sheet_to_csv(worksheet, { FS: '\t' });
          if (target === 'emp') setEmployeeText(tsv);
          else setCompensationText(tsv);
          success(`Archivo Excel "${file.name}" cargado correctamente.`);
        } catch (err: any) {
          error('Error al procesar archivo Excel: ' + (err?.message || 'formato no reconocido'));
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          if (target === 'emp') setEmployeeText(text);
          else setCompensationText(text);
        }
      };
      reader.readAsText(file);
    }
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



  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        mode === 'employees' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet size={22} style={{ color: '#ea580c' }} />
            <span>Carga Masiva de Empleados (Excel / CSV)</span>
          </div>
        ) : mode === 'compensations' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Table size={22} style={{ color: '#2563eb' }} />
            <span>Carga Masiva de Días de Compensación (Excel)</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={22} style={{ color: '#2563eb' }} />
            <span>Gestión de Datos y Carga Masiva (Excel / Backup)</span>
          </div>
        )
      }
      footer={
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Navigation Tabs (solo visibles en modo general 'all') */}
        {mode === 'all' && (
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
        )}

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
                  <label className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', color: '#ea580c', cursor: 'pointer' }}>
                    <Upload size={13} />
                    <span>Subir archivo Excel (.xlsx) o CSV</span>
                    <input type="file" accept=".xlsx,.xls,.csv,.txt" onChange={(e) => handleFileUpload(e, 'emp')} style={{ display: 'none' }} />
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
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.875rem 1rem', fontSize: '0.825rem', color: '#166534' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <Info size={16} />
                <span>Estructura de Carga de Compensaciones (5 Columnas)</span>
              </div>
              <p style={{ margin: '0 0 0.5rem', color: '#374151' }}>
                Sube tu archivo Excel <code>.xlsx</code> directamente o copia y pega las filas desde tu hoja de cálculo. El sistema detecta e ignora el encabezado automáticamente:
              </p>
              {/* Column mapping table matching user's Excel */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.72rem', borderCollapse: 'collapse', background: '#ffffff', border: '1px solid #cbd5e1' }}>
                  <thead style={{ background: '#0f766e', color: '#ffffff' }}>
                    <tr>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Col A (1)</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Col B (2)</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Col C (3)</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Col D (4)</th>
                      <th style={{ padding: '4px 8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Col E (5)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: '#f1f5f9', fontWeight: 700, color: '#0f172a' }}>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>DNI</td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Apellidos y Nombres</td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Fecha</td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>ESTADO</td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>Fecha Compensada</td>
                    </tr>
                    <tr style={{ background: '#ffffff', color: '#334155' }}>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: 600 }}>46356926</td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>ISLA SANTAMARIA RODRIGO RAYMUNDO</td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>26/04/2026</td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.68rem' }}>COMPENSADO</span>
                      </td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>18/05/2026</td>
                    </tr>
                    <tr style={{ background: '#f8fafc', color: '#334155' }}>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: 600 }}>46356926</td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>ISLA SANTAMARIA RODRIGO RAYMUNDO</td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>29/06/2026</td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1' }}>
                        <span style={{ background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.68rem' }}>PENDIENTE</span>
                      </td>
                      <td style={{ padding: '4px 8px', border: '1px solid #cbd5e1', color: '#94a3b8', fontStyle: 'italic' }}>(vacío)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Textarea */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label className="form-label">Pegar filas del Excel o subir archivo:</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', color: '#0f766e', cursor: 'pointer' }}>
                    <Upload size={13} />
                    <span>Subir archivo Excel (.xlsx)</span>
                    <input type="file" accept=".xlsx,.xls,.csv,.txt" onChange={(e) => handleFileUpload(e, 'comp')} style={{ display: 'none' }} />
                  </label>
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
                placeholder={"Pega aquí las filas de tu Excel (con o sin encabezado):\n46356926\tISLA SANTAMARIA RODRIGO RAYMUNDO\t26/04/2026\tCOMPENSADO\t18/05/2026\n46356926\tISLA SANTAMARIA RODRIGO RAYMUNDO\t29/06/2026\tPENDIENTE\t\n42935726\tVALDEZ ZACARIAS JULIO ARMANDO\t07/05/2023\tCOMPENSADO\t04/04/2026"}
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
                <div style={{ overflowX: 'auto', maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', minWidth: '650px' }}>
                    <thead style={{ position: 'sticky', top: 0, background: '#1e293b', color: '#ffffff', zIndex: 1 }}>
                      <tr>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>#</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>DNI</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Trabajador</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Fecha Trabajada</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Estado Excel</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Fecha Compensada</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>Validación</th>
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
                                : <span style={{ fontStyle: 'italic', color: '#ef4444' }}>No registrado</span>
                              }
                            </td>
                            <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: row.fechaGenerada ? '#1e293b' : '#ef4444' }}>
                              {row.fechaGenerada
                                ? formatDateDisplay(row.fechaGenerada)
                                : <span style={{ color: '#ef4444', fontStyle: 'italic' }}>{row.fechaGeneradaRaw || '(vacío)'}</span>
                              }
                            </td>
                            <td style={{ padding: '5px 10px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                background: row.estado === 'COMPENSADO' ? '#dcfce7' : row.estado === 'PROGRAMADO' ? '#dbeafe' : '#fef3c7',
                                color: row.estado === 'COMPENSADO' ? '#15803d' : row.estado === 'PROGRAMADO' ? '#1d4ed8' : '#b45309'
                              }}>
                                {row.estado}
                              </span>
                            </td>
                            <td style={{ padding: '5px 10px', fontFamily: 'monospace' }}>
                              {row.fechaCompensada ? (
                                <span style={{ color: '#0f172a', fontWeight: 600 }}>
                                  {formatDateDisplay(row.fechaCompensada)}
                                </span>
                              ) : row.fechaCompensadaRaw ? (
                                <span style={{ color: '#ef4444', fontStyle: 'italic' }}>{row.fechaCompensadaRaw}</span>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>—</span>
                              )}
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
