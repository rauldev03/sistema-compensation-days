import React, { useState, useEffect, useMemo } from 'react';
import {
  Printer,
  User,
  Building2,
  Sparkles,
  RotateCcw,
  Layers,
  ChevronDown,
  UserCheck,
  Settings,
  Users
} from 'lucide-react';
import { Empleado, Compensacion } from '../../types';
import { employeeService, compensationService, approverService } from '../../services';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { formatDateDisplay } from '../../utils/dateUtils';
import { ApproversManagementModal } from './ApproversManagementModal';
import './permissionPrint.css';

type SedeType =
  | 'FUNDO IV PALOS'
  | 'PLANTA IV PALOS'
  | 'PLANTA SECHIN FRESCO'
  | 'PLANTA SECHIN CONGELADO'
  | 'OFICINA CASMA'
  | 'OFICINA SECHIN'
  | 'OFICINA LIMA';

type MotivoType = 'SALUD' | 'PERSONAL' | 'CAPACITACION' | 'ESTUDIOS' | 'OTROS';

export const PermissionSheetView: React.FC = () => {
  const { selectedEmployeeIdForCompensations, refreshKey } = useApp();
  const { success } = useToast();

  const [approversRefreshKey, setApproversRefreshKey] = useState(0);
  const [isApproversModalOpen, setIsApproversModalOpen] = useState(false);

  const activeEmployees = useMemo(() => {
    return employeeService.getAll().filter((e) => e.estado === 'ACTIVO');
  }, [refreshKey]);

  const approvers = useMemo(() => {
    return approverService.getAll({ estado: 'ACTIVO' });
  }, [refreshKey, approversRefreshKey]);

  // Form State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedApproverId, setSelectedApproverId] = useState<string>('');
  const [fechaEmision, setFechaEmision] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sede, setSede] = useState<SedeType>('PLANTA SECHIN FRESCO');
  const [tipoDocumento, setTipoDocumento] = useState<string>('D.N.I.');
  const [numeroDocumento, setNumeroDocumento] = useState<string>('');
  const [apellidosNombres, setApellidosNombres] = useState<string>('');
  const [condicionLaboral, setCondicionLaboral] = useState<'OBRERO' | 'EMPLEADO'>('EMPLEADO');
  const [labor, setLabor] = useState<string>('');
  const [responsableInmediato, setResponsableInmediato] = useState<string>('JEFE DE ÁREA / SUPERVISOR');
  const [tiempoSolicitado, setTiempoSolicitado] = useState<string>('1 DÍA (JORNADA COMPLETA)');
  const [motivo, setMotivo] = useState<MotivoType>('OTROS');
  const [motivoOtroEspecifique, setMotivoOtroEspecifique] = useState<string>('COMPENSACIÓN DE DÍA TRABAJADO');
  const [aprobadoPor, setAprobadoPor] = useState<string>('Lic. María Elena Ramos Paredes');
  const [cargoAprobador, setCargoAprobador] = useState<string>('JEFE DE RECURSOS HUMANOS');
  const [inicia, setInicia] = useState<string>('');
  const [finaliza, setFinaliza] = useState<string>('');
  const [diaRetorno, setDiaRetorno] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [selectedCompIds, setSelectedCompIds] = useState<string[]>([]);

  // Selected Employee object
  const selectedEmployee: Empleado | undefined = useMemo(() => {
    return activeEmployees.find((e) => e.id === selectedEmployeeId);
  }, [selectedEmployeeId, activeEmployees]);

  // Compensations of selected employee
  const employeeCompensations: Compensacion[] = useMemo(() => {
    if (!selectedEmployeeId) return [];
    return compensationService.getByEmployee(selectedEmployeeId);
  }, [selectedEmployeeId, refreshKey]);

  // Preselect approver if available
  useEffect(() => {
    if (approvers.length > 0 && !selectedApproverId) {
      const first = approvers[0];
      setSelectedApproverId(first.id);
      setAprobadoPor(first.nombreCompleto);
      setCargoAprobador(first.cargo);
    }
  }, [approvers]);

  // Preselect employee from context or default
  useEffect(() => {
    if (selectedEmployeeIdForCompensations) {
      setSelectedEmployeeId(selectedEmployeeIdForCompensations);
    } else if (activeEmployees.length > 0 && !selectedEmployeeId) {
      setSelectedEmployeeId(activeEmployees[0].id);
    }
  }, [selectedEmployeeIdForCompensations, activeEmployees]);

  // When selected employee changes, update auto-filled fields
  useEffect(() => {
    if (selectedEmployee) {
      setApellidosNombres(selectedEmployee.apellidosNombres);
      setNumeroDocumento(selectedEmployee.documentoIdentidad);
      setTipoDocumento('D.N.I.');
      setLabor(selectedEmployee.cargo || selectedEmployee.area || '');
      setCondicionLaboral(selectedEmployee.tipoTrabajador === 'OBRERO' ? 'OBRERO' : 'EMPLEADO');
      setSelectedCompIds([]);

      // Auto-set observations if employee has compensations
      const compensations = compensationService.getByEmployee(selectedEmployee.id);
      const scheduledOrComp = compensations.find((c) => c.estado === 'PROGRAMADO' || c.estado === 'COMPENSADO');
      if (scheduledOrComp) {
        setObservaciones(
          `COMPENSACIÓN DE DÍA TRABAJADO (${formatDateDisplay(scheduledOrComp.fechaGenerada)}) POR DÍA DE DESCANSO (${formatDateDisplay(scheduledOrComp.fechaCompensacion)}). MOTIVO: ${scheduledOrComp.observacion || 'TURNO DE GUARDIA / FERIADO'}.`
        );
        if (scheduledOrComp.fechaCompensacion) {
          setInicia(scheduledOrComp.fechaCompensacion);
          setFinaliza(scheduledOrComp.fechaCompensacion);
        }
      } else {
        setObservaciones('');
      }
    }
  }, [selectedEmployeeId]);

  // Toggle selection of a compensation record to autofill observations
  const handleToggleCompensation = (comp: Compensacion) => {
    const isSelected = selectedCompIds.includes(comp.id);
    let newSelected: string[];
    if (isSelected) {
      newSelected = selectedCompIds.filter((id) => id !== comp.id);
    } else {
      newSelected = [...selectedCompIds, comp.id];
    }
    setSelectedCompIds(newSelected);

    if (newSelected.length === 0) {
      setObservaciones('');
      return;
    }

    const selectedComps = employeeCompensations.filter((c) => newSelected.includes(c.id));
    const lines = selectedComps.map((c, idx) => {
      const num = selectedComps.length > 1 ? `${idx + 1}. ` : '';
      const compDate = c.fechaCompensacion ? formatDateDisplay(c.fechaCompensacion) : 'POR ASIGNAR';
      return `${num}COMPENSACIÓN DE DÍA TRABAJADO (${formatDateDisplay(c.fechaGenerada)}) POR DÍA DE DESCANSO (${compDate})${c.observacion ? ' - ' + c.observacion : ''}.`;
    });

    setObservaciones(lines.join('\n'));

    const first = selectedComps[0];
    if (first && first.fechaCompensacion) {
      setInicia(first.fechaCompensacion);
      setFinaliza(first.fechaCompensacion);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetForm = () => {
    setFechaEmision(new Date().toISOString().split('T')[0]);
    setSede('PLANTA SECHIN FRESCO');
    setTiempoSolicitado('1 DÍA (JORNADA COMPLETA)');
    setMotivo('OTROS');
    setMotivoOtroEspecifique('COMPENSACIÓN DE DÍA TRABAJADO');
    if (approvers.length > 0) {
      setSelectedApproverId(approvers[0].id);
      setAprobadoPor(approvers[0].nombreCompleto);
      setCargoAprobador(approvers[0].cargo);
    }
    setInicia('');
    setFinaliza('');
    setDiaRetorno('');
    setObservaciones('');
    setSelectedCompIds([]);
    success('Formato restablecido.', 'Listo');
  };

  const sedesList: SedeType[] = [
    'FUNDO IV PALOS',
    'PLANTA IV PALOS',
    'PLANTA SECHIN FRESCO',
    'PLANTA SECHIN CONGELADO',
    'OFICINA CASMA',
    'OFICINA SECHIN',
    'OFICINA LIMA'
  ];

  return (
    <div className="permission-sheet-page">
      {/* Header bar */}
      <div className="flex items-center justify-between no-print" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            Hoja de Permiso del Personal (Formato Oficial Chavín)
          </h2>
          <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
            Código: AGCH-R-RH-770-02 • Generación e impresión directa sin modificar la base de datos
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsApproversModalOpen(true)}
            icon={<Users size={14} style={{ color: '#2563eb' }} />}
            title="Administrar la lista de jefes y gerentes autorizados para dar permisos"
          >
            Aprobadores de Permiso
          </Button>

          <Button variant="secondary" size="sm" onClick={handleResetForm} icon={<RotateCcw size={14} />}>
            Restablecer
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            icon={<Printer size={15} />}
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
              boxShadow: '0 2px 8px rgba(30, 64, 175, 0.3)'
            }}
          >
            🖨️ Imprimir Hoja de Permiso (A4)
          </Button>
        </div>
      </div>

      {/* Main Workspace: Controls Form (Left) & Live Printable Preview (Right) */}
      <div className="permission-workspace">
        {/* PANEL DE FORMULARIO / CONTROLES */}
        <div className="permission-controls-card no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <Layers size={16} style={{ color: '#2563eb' }} />
            <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>Datos para el Llenado Automático</strong>
          </div>

          {/* 1. Selector de Trabajador */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={13} style={{ color: '#2563eb' }} />
              1. Seleccionar Trabajador (Base de Datos):
            </label>
            <div style={{ position: 'relative' }}>
              <select
                className="form-input"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#1e40af',
                  background: '#eff6ff',
                  borderColor: '#93c5fd',
                  paddingRight: '2rem'
                }}
              >
                {activeEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.apellidosNombres} (DNI: {emp.documentoIdentidad} - {emp.area})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2563eb', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* 2. Sede */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building2 size={13} style={{ color: '#2563eb' }} />
              2. Sede Laboral:
            </label>
            <select
              className="form-input"
              value={sede}
              onChange={(e) => setSede(e.target.value as SedeType)}
              style={{ fontSize: '0.8rem' }}
            >
              {sedesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Labor y Responsable Inmediato */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
                Labor / Cargo:
              </label>
              <input
                type="text"
                className="form-input"
                value={labor}
                onChange={(e) => setLabor(e.target.value)}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
                Responsable Inmediato:
              </label>
              <input
                type="text"
                className="form-input"
                value={responsableInmediato}
                onChange={(e) => setResponsableInmediato(e.target.value)}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              />
            </div>
          </div>

          {/* 3. Selección rápida de días compensados del trabajador */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} style={{ color: '#d97706' }} />
              3. Días de Compensación para Observaciones:
            </label>
            {employeeCompensations.length === 0 ? (
              <div style={{ fontSize: '0.75rem', color: '#64748b', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                Este trabajador no tiene días registrados. Puede escribir las observaciones manualmente abajo.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '130px', overflowY: 'auto', background: '#f8fafc', padding: '0.4rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                {employeeCompensations.map((c) => {
                  const isChecked = selectedCompIds.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.725rem',
                        padding: '0.25rem 0.4rem',
                        borderRadius: '4px',
                        background: isChecked ? '#eff6ff' : '#ffffff',
                        border: isChecked ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCompensation(c)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>
                        <strong>Trabajado: {formatDateDisplay(c.fechaGenerada)}</strong> ➜{' '}
                        <span style={{ color: '#059669' }}>
                          Comp: {c.fechaCompensacion ? formatDateDisplay(c.fechaCompensacion) : 'Pendiente'}
                        </span>{' '}
                        ({c.estado})
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Observaciones */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.775rem' }}>
              4. Texto en Observaciones:
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Detalle de los días compensados, motivo de permiso, etc."
              style={{ fontSize: '0.775rem' }}
            />
          </div>

          {/* 5. Fechas y Horarios del Permiso */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
                Fecha de Emisión:
              </label>
              <input
                type="date"
                className="form-input"
                value={fechaEmision}
                onChange={(e) => setFechaEmision(e.target.value)}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
                Tiempo Solicitado:
              </label>
              <input
                type="text"
                className="form-input"
                value={tiempoSolicitado}
                onChange={(e) => setTiempoSolicitado(e.target.value)}
                placeholder="1 DÍA / 8 HORAS"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              />
            </div>
          </div>

          {/* Motivo */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
              Motivo del Permiso:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.3rem' }}>
              {(['SALUD', 'PERSONAL', 'CAPACITACION', 'ESTUDIOS', 'OTROS'] as MotivoType[]).map((m) => (
                <label
                  key={m}
                  style={{
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.2rem 0.35rem',
                    background: motivo === m ? '#eff6ff' : '#f8fafc',
                    border: motivo === m ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: motivo === m ? 700 : 500
                  }}
                >
                  <input
                    type="radio"
                    name="motivo"
                    checked={motivo === m}
                    onChange={() => setMotivo(m)}
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>

          {motivo === 'OTROS' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.725rem', fontWeight: 700 }}>
                Especifique Motivo Otros:
              </label>
              <input
                type="text"
                className="form-input"
                value={motivoOtroEspecifique}
                onChange={(e) => setMotivoOtroEspecifique(e.target.value)}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              />
            </div>
          )}

          {/* Fechas de inicio, fin y retorno */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                Inicia:
              </label>
              <input
                type="date"
                className="form-input"
                value={inicia}
                onChange={(e) => setInicia(e.target.value)}
                style={{ fontSize: '0.725rem', padding: '0.2rem 0.35rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                Finaliza:
              </label>
              <input
                type="date"
                className="form-input"
                value={finaliza}
                onChange={(e) => setFinaliza(e.target.value)}
                style={{ fontSize: '0.725rem', padding: '0.2rem 0.35rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                Día Retorno:
              </label>
              <input
                type="date"
                className="form-input"
                value={diaRetorno}
                onChange={(e) => setDiaRetorno(e.target.value)}
                style={{ fontSize: '0.725rem', padding: '0.2rem 0.35rem' }}
              />
            </div>
          </div>

          {/* 6. Sección de Aprobación por Jefatura / Gerencia */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: 0 }}>
                <UserCheck size={13} style={{ color: '#2563eb' }} />
                6. Aprobado Por (Lista Desplegable):
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsApproversModalOpen(true)}
                style={{
                  fontSize: '0.675rem',
                  color: '#2563eb',
                  padding: '0 0.35rem',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontWeight: 700
                }}
                title="Administrar la lista de jefaturas y gerencias autorizadas para dar permisos"
              >
                <Settings size={11} />
                <span>+ Configurar Aprobadores</span>
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <select
                className="form-input"
                value={selectedApproverId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedApproverId(val);
                  if (val && val !== 'manual') {
                    const found = approvers.find((a) => a.id === val);
                    if (found) {
                      setAprobadoPor(found.nombreCompleto);
                      setCargoAprobador(found.cargo);
                    }
                  }
                }}
                style={{
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  color: '#1e40af',
                  background: '#eff6ff',
                  borderColor: '#93c5fd',
                  paddingRight: '2rem'
                }}
              >
                <option value="">-- Seleccionar Aprobador de la Lista --</option>
                {approvers.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.nombreCompleto} — [{app.cargo}]
                  </option>
                ))}
                <option value="manual">✍️ Ingresar manualmente / Otro aprobador...</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#2563eb', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                Nombre del Aprobador:
              </label>
              <input
                type="text"
                className="form-input"
                value={aprobadoPor}
                onChange={(e) => {
                  setAprobadoPor(e.target.value);
                  setSelectedApproverId('manual');
                }}
                placeholder="Nombre del Jefe o Gerente"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                Cargo del Aprobador:
              </label>
              <input
                type="text"
                className="form-input"
                value={cargoAprobador}
                onChange={(e) => {
                  setCargoAprobador(e.target.value);
                  setSelectedApproverId('manual');
                }}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              />
            </div>
          </div>
        </div>

        {/* VISTA PREVIA DEL DOCUMENTO OFICIAL (PARA IMPRIMIR) */}
        <div className="permission-preview-wrapper">
          <div className="official-permission-doc" id="printable-permission-sheet">
            <table className="doc-table">
              <tbody>
                {/* 1. HEADER INSTITUCIONAL */}
                <tr>
                  {/* LOGO CHAVIN */}
                  <td className="doc-header-logo-cell" style={{ width: '22%', verticalAlign: 'middle' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div className="chavin-logo-title">
                        <span>Chav</span>
                        <span className="chavin-dot">í</span>
                        <span>n</span>
                      </div>
                      <div className="chavin-logo-subtitle">
                        Car. Carretera Casma - Huaraz<br />
                        Nro. S/N Monte Grande (Sector Sechín Alto)<br />
                        Ancash, Casma, Buena Vista Alta, Perú.
                      </div>
                    </div>
                  </td>

                  {/* TITULO DE LA HOJA */}
                  <td style={{ width: '54%', textAlign: 'center', verticalAlign: 'middle', padding: '6px' }}>
                    <div className="doc-title-main">
                      AGRICOLA Y GANADERA CHAVIN DE HUANTAR S.A.
                    </div>
                    <div className="doc-title-docname">
                      HOJA DE PERMISO DEL PERSONAL
                    </div>
                  </td>

                  {/* METADATA OFICIAL */}
                  <td style={{ width: '24%', padding: 0 }}>
                    <table className="doc-meta-table">
                      <tbody>
                        <tr>
                          <td><strong>Código:</strong> AGCH-R-RH-770-02</td>
                        </tr>
                        <tr>
                          <td><strong>Versión:</strong> 02</td>
                        </tr>
                        <tr>
                          <td><strong>Fecha Aprob.:</strong> 01/08/2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* 2. FECHA DE EMISION */}
                <tr>
                  <td colSpan={3} style={{ padding: '4px 8px', background: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                      <span className="doc-label" style={{ minWidth: '60px' }}>FECHA:</span>
                      <span className="doc-value">{formatDateDisplay(fechaEmision)}</span>
                    </div>
                  </td>
                </tr>

                {/* 3. SEDES */}
                <tr>
                  <td colSpan={3} style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '80px', fontWeight: 800, fontSize: '9px', background: '#fafafa' }}>
                            SEDE:
                          </td>
                          {sedesList.map((s) => (
                            <td key={s} style={{ fontSize: '7.5px', fontWeight: 800, padding: '3px 2px' }}>
                              {s}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td style={{ background: '#fafafa' }}></td>
                          {sedesList.map((s) => (
                            <td key={s} style={{ height: '18px', textAlign: 'center', fontSize: '11px', fontWeight: 900 }}>
                              {sede === s ? 'X' : ''}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* 4. DATOS DEL TRABAJADOR */}
                <tr>
                  <td colSpan={3} style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#fafafa', textAlign: 'center' }}>
                          <td style={{ width: '15%', fontSize: '8px', fontWeight: 800 }}>TIPO DOCUMENTO</td>
                          <td style={{ width: '18%', fontSize: '8px', fontWeight: 800 }}>NUMERO DOCUMENTO</td>
                          <td style={{ width: '47%', fontSize: '8px', fontWeight: 800 }}>APELLIDOS Y NOMBRES</td>
                          <td style={{ width: '20%', fontSize: '8px', fontWeight: 800 }}>CONDICION LABORAL</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '9.5px', height: '22px' }}>
                            {tipoDocumento}
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '10px' }}>
                            {numeroDocumento}
                          </td>
                          <td style={{ paddingLeft: '8px', fontWeight: 800, fontSize: '10px' }}>
                            {apellidosNombres || '-'}
                          </td>
                          <td style={{ padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                              <tbody>
                                <tr>
                                  <td style={{ border: 'none', borderBottom: '1px solid #000', fontSize: '7.5px', fontWeight: 800, padding: '2px' }}>
                                    OBRERO {condicionLaboral === 'OBRERO' ? ' [ X ]' : ' [   ]'}
                                  </td>
                                </tr>
                                <tr>
                                  <td style={{ border: 'none', fontSize: '7.5px', fontWeight: 800, padding: '2px' }}>
                                    EMPLEADO {condicionLaboral === 'EMPLEADO' ? ' [ X ]' : ' [   ]'}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* 5. LABOR Y RESPONSABLE INMEDIATO */}
                <tr>
                  <td colSpan={3} style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '15%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                            LABOR:
                          </td>
                          <td style={{ width: '35%', fontWeight: 700, fontSize: '9.5px' }}>
                            {labor || '-'}
                          </td>
                          <td style={{ width: '22%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                            RESPONSABLE INMEDIATO:
                          </td>
                          <td style={{ width: '28%', fontWeight: 700, fontSize: '9.5px' }}>
                            {responsableInmediato || '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* 6. TIEMPO SOLICITADO */}
                <tr>
                  <td colSpan={3} style={{ padding: '4px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="doc-label" style={{ minWidth: '130px' }}>TIEMPO SOLICITADO:</span>
                      <span className="doc-value" style={{ textTransform: 'uppercase' }}>{tiempoSolicitado || '-'}</span>
                    </div>
                  </td>
                </tr>

                {/* 7. MOTIVOS DEL PERMISO */}
                <tr>
                  <td colSpan={3} style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                      <thead>
                        <tr style={{ background: '#fafafa' }}>
                          <td style={{ width: '140px', fontWeight: 800, fontSize: '8.5px' }}>
                            PERMISO POR MOTIVOS DE:
                          </td>
                          <td style={{ width: '15%', fontSize: '8px', fontWeight: 800 }}>SALUD</td>
                          <td style={{ width: '15%', fontSize: '8px', fontWeight: 800 }}>PERSONAL</td>
                          <td style={{ width: '15%', fontSize: '8px', fontWeight: 800 }}>CAPACITACION</td>
                          <td style={{ width: '15%', fontSize: '8px', fontWeight: 800 }}>ESTUDIOS</td>
                          <td style={{ fontSize: '8px', fontWeight: 800 }}>OTROS (Especifique)</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ background: '#fafafa' }}></td>
                          <td style={{ height: '18px', fontWeight: 900, fontSize: '11px' }}>
                            {motivo === 'SALUD' ? 'X' : ''}
                          </td>
                          <td style={{ fontWeight: 900, fontSize: '11px' }}>
                            {motivo === 'PERSONAL' ? 'X' : ''}
                          </td>
                          <td style={{ fontWeight: 900, fontSize: '11px' }}>
                            {motivo === 'CAPACITACION' ? 'X' : ''}
                          </td>
                          <td style={{ fontWeight: 900, fontSize: '11px' }}>
                            {motivo === 'ESTUDIOS' ? 'X' : ''}
                          </td>
                          <td style={{ fontWeight: 700, fontSize: '9px', textAlign: 'left', paddingLeft: '6px' }}>
                            {motivo === 'OTROS' ? `[ X ] ${motivoOtroEspecifique || 'COMPENSACIÓN'}` : '[   ]'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* 8. APROBADO POR Y CARGO */}
                <tr>
                  <td colSpan={3} style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '15%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                            APROBADO POR:
                          </td>
                          <td style={{ width: '45%', fontWeight: 700, fontSize: '9.5px' }}>
                            {aprobadoPor || '-'}
                          </td>
                          <td style={{ width: '15%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                            CARGO:
                          </td>
                          <td style={{ width: '25%', fontWeight: 700, fontSize: '9.5px' }}>
                            {cargoAprobador || '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* 9. INICIA Y FINALIZA */}
                <tr>
                  <td colSpan={3} style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '15%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                            INICIA:
                          </td>
                          <td style={{ width: '35%', fontWeight: 700, fontSize: '9.5px' }}>
                            {inicia ? formatDateDisplay(inicia) : '-'}
                          </td>
                          <td style={{ width: '15%', fontWeight: 800, fontSize: '8.5px', background: '#fafafa' }}>
                            FINALIZA:
                          </td>
                          <td style={{ width: '35%', fontWeight: 700, fontSize: '9.5px' }}>
                            {finaliza ? formatDateDisplay(finaliza) : '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* 10. DIA DE RETORNO */}
                <tr>
                  <td colSpan={3} style={{ padding: '4px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="doc-label" style={{ minWidth: '130px' }}>DIA DE RETORNO:</span>
                      <span className="doc-value">{diaRetorno ? formatDateDisplay(diaRetorno) : '-'}</span>
                    </div>
                  </td>
                </tr>

                {/* 11. OBSERVACIONES */}
                <tr>
                  <td colSpan={3} style={{ padding: '4px 8px', minHeight: '65px', verticalAlign: 'top' }}>
                    <div className="doc-label" style={{ marginBottom: '2px' }}>OBSERVACIONES:</div>
                    <div
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 600,
                        color: '#000000',
                        lineHeight: 1.35,
                        minHeight: '42px',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {observaciones || '-'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 12. FIRMAS INFERIORES */}
            <div className="doc-signatures-container">
              <div className="doc-signature-box">
                <div className="doc-signature-line" />
                <div className="doc-signature-label">TRABAJADOR</div>
              </div>

              <div className="doc-signature-box">
                <div className="doc-signature-line" />
                <div className="doc-signature-label">JEFE DE AREA</div>
              </div>

              <div className="doc-signature-box">
                <div className="doc-signature-line" />
                <div className="doc-signature-label">JEFE DE RRHH</div>
              </div>

              <div className="doc-signature-box">
                <div className="doc-signature-line" />
                <div className="doc-signature-label">GERENCIA DE OPER.</div>
              </div>

              <div className="doc-signature-box">
                <div className="doc-signature-line" />
                <div className="doc-signature-label">GERENCIA GENERAL</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Gestión de Aprobadores de Permisos */}
      <ApproversManagementModal
        isOpen={isApproversModalOpen}
        onClose={() => setIsApproversModalOpen(false)}
        onApproversChange={() => setApproversRefreshKey((k) => k + 1)}
      />
    </div>
  );
};
