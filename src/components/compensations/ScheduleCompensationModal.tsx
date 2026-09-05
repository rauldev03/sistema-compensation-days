import React, { useState, useEffect } from 'react';
import { CalendarCheck, Save } from 'lucide-react';
import { Compensacion, ProgramarCompensacionDto, Empleado } from '../../types';
import { compensationService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ScheduleCompensationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: Compensacion) => void;
  compensation: Compensacion | null;
  employee?: Empleado | null;
}

export const ScheduleCompensationModal: React.FC<ScheduleCompensationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  compensation,
  employee
}) => {
  const { success, error } = useToast();

  const [fechaCompensacion, setFechaCompensacion] = useState('');
  const [observacion, setObservacion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (compensation) {
      setFechaCompensacion(compensation.fechaCompensacion || '');
      setObservacion(compensation.observacion || '');
      setErrorMessage('');
    }
  }, [compensation, isOpen]);

  if (!compensation) return null;

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaCompensacion) {
      setErrorMessage('Debe seleccionar la fecha en que será compensado.');
      return;
    }

    if (fechaCompensacion === compensation.fechaGenerada) {
      setErrorMessage(
        `El día generado trabajado (${formatDate(compensation.fechaGenerada)}) no puede ser igual a la fecha de compensación. Debe seleccionar una fecha de descanso diferente.`
      );
      return;
    }

    const employeeComps = compensationService.getByEmployee(compensation.empleadoId);
    const duplicate = employeeComps.find(
      (c) => c.id !== compensation.id && c.fechaCompensacion === fechaCompensacion && c.estado !== 'ANULADO'
    );
    if (duplicate) {
      setErrorMessage(
        `El trabajador ya tiene una compensación asignada para el ${formatDate(fechaCompensacion)} (${duplicate.estado}). No se pueden registrar dos compensaciones en la misma fecha para el mismo trabajador.`
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const dto: ProgramarCompensacionDto = {
      fechaCompensacion,
      observacion: observacion.trim()
    };

    const res = compensationService.scheduleCompensation(compensation.id, dto);
    setIsSubmitting(false);

    if (res.success && res.data) {
      success(
        `Compensación programada para el ${formatDate(fechaCompensacion)} exitosamente.`,
        'Compensación Programada'
      );
      onSuccess(res.data);
      onClose();
    } else {
      setErrorMessage(res.error || 'Error al programar la compensación.');
      error(res.error || 'Error al programar la compensación.');
    }
  };

  const isEditing = compensation.estado === 'PROGRAMADO';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarCheck size={22} style={{ color: '#2563eb' }} />
          <span>{isEditing ? 'Modificar Fecha de Compensación' : 'Registrar Fecha de Compensación'}</span>
        </div>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            icon={<Save size={16} />}
          >
            {isEditing ? 'Actualizar Programación' : 'Registrar Compensación'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Info Box */}
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '10px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem'
          }}
        >
          {employee && (
            <div style={{ fontSize: '0.875rem', color: '#1e3a8a', fontWeight: 600 }}>
              Trabajador: <span style={{ color: '#0f172a' }}>{employee.apellidosNombres}</span>
            </div>
          )}
          <div style={{ fontSize: '0.925rem', color: '#1e3a8a' }}>
            <strong>Día trabajado / pendiente:</strong>{' '}
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1d4ed8' }}>
              {formatDate(compensation.fechaGenerada)}
            </span>
          </div>
          {compensation.observacion && (
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
              <strong>Detalle de origen:</strong> {compensation.observacion}
            </div>
          )}
        </div>

        {/* Date Input */}
        <Input
          type="date"
          label="Fecha en que será compensado"
          required
          value={fechaCompensacion}
          onChange={(e) => {
            const val = e.target.value;
            setFechaCompensacion(val);
            if (!val) {
              setErrorMessage('');
            } else if (val === compensation.fechaGenerada) {
              setErrorMessage(
                `El día generado trabajado (${formatDate(compensation.fechaGenerada)}) no puede ser igual a la fecha de compensación.`
              );
            } else {
              const employeeComps = compensationService.getByEmployee(compensation.empleadoId);
              const duplicate = employeeComps.find(
                (c) => c.id !== compensation.id && c.fechaCompensacion === val && c.estado !== 'ANULADO'
              );
              if (duplicate) {
                setErrorMessage(
                  `El trabajador ya tiene una compensación asignada para el ${formatDate(val)} (${duplicate.estado}).`
                );
              } else {
                setErrorMessage('');
              }
            }
          }}
          error={errorMessage}
          helper="El registro pasará al estado PROGRAMADO y quedará listo para ejecutarse."
        />

        {/* Observación Input */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            Observación de compensación <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span>
          </label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="Ej. Compensará turno coordinado con supervisión..."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
