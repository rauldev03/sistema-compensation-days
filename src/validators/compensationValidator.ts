import { Compensacion, CreateCompensacionDto, ProgramarCompensacionDto } from '../types';
import { ValidationResult } from './employeeValidator';

export class CompensationValidator {
  /**
   * Valida la creación de un nuevo día trabajado generador de compensación
   */
  static validateCreate(
    dto: CreateCompensacionDto,
    existingCompensations: Compensacion[] = []
  ): ValidationResult {
    const errors: Record<string, string> = {};

    // 1. Empleado obligatorio
    if (!dto.empleadoId || dto.empleadoId.trim() === '') {
      errors.empleadoId = 'Debe seleccionar un trabajador.';
    }

    // 2. Fecha generada obligatoria y válida
    if (!dto.fechaGenerada) {
      errors.fechaGenerada = 'La fecha trabajada que genera compensación es obligatoria.';
    } else {
      const parsedDate = new Date(dto.fechaGenerada);
      if (isNaN(parsedDate.getTime())) {
        errors.fechaGenerada = 'La fecha generada no tiene un formato válido.';
      }
    }

    // 3. Regla Fundamental: No permitir duplicar el mismo día generado para el mismo empleado
    // (A menos que el registro anterior esté ANULADO)
    if (dto.empleadoId && dto.fechaGenerada && Object.keys(errors).length === 0) {
      const duplicateActive = existingCompensations.find(
        (c) =>
          c.empleadoId === dto.empleadoId &&
          c.fechaGenerada === dto.fechaGenerada &&
          c.estado !== 'ANULADO'
      );

      if (duplicateActive) {
        errors.fechaGenerada = `El trabajador ya tiene registrado un día de compensación para la fecha ${dto.fechaGenerada} con estado ${duplicateActive.estado}. No se permite duplicar días activos.`;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Valida la asignación o edición de una fecha de compensación (Paso a PROGRAMADO)
   */
  static validateSchedule(
    dto: ProgramarCompensacionDto,
    compensation: Compensacion
  ): ValidationResult {
    const errors: Record<string, string> = {};

    // 1. No permitir compensar un registro ANULADO
    if (compensation.estado === 'ANULADO') {
      errors.general = 'No se puede programar ni compensar un registro que ha sido ANULADO.';
      return { isValid: false, errors };
    }

    // 2. No permitir si ya está COMPENSADO (salvo que la regla permita edición antes de cerrar)
    if (compensation.estado === 'COMPENSADO') {
      errors.general = 'Este día ya ha sido efectivamente COMPENSADO y no puede ser reprogramado directamente.';
      return { isValid: false, errors };
    }

    // 3. Fecha de compensación obligatoria y válida
    if (!dto.fechaCompensacion || dto.fechaCompensacion.trim() === '') {
      errors.fechaCompensacion = 'Debe indicar la fecha en que será compensado.';
    } else {
      const parsedDate = new Date(dto.fechaCompensacion);
      if (isNaN(parsedDate.getTime())) {
        errors.fechaCompensacion = 'La fecha de compensación no es válida.';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Valida la transición a COMPENSADO
   */
  static validateMarkAsCompensated(compensation: Compensacion): ValidationResult {
    const errors: Record<string, string> = {};

    if (compensation.estado === 'ANULADO') {
      errors.general = 'Un registro ANULADO no puede marcarse como compensado.';
    } else if (compensation.estado === 'PENDIENTE') {
      errors.general = 'Primero debe programar una fecha de compensación antes de marcarlo como compensado.';
    } else if (!compensation.fechaCompensacion) {
      errors.general = 'No existe una fecha de compensación asignada.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
