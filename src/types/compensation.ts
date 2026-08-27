import { Empleado } from './employee';

export type EstadoCompensacion = 'PENDIENTE' | 'PROGRAMADO' | 'COMPENSADO' | 'ANULADO';

export interface Compensacion {
  id: string;
  empleadoId: string;
  fechaGenerada: string; // Formato YYYY-MM-DD (Día trabajado)
  fechaCompensacion: string | null; // Formato YYYY-MM-DD (Fecha en que se compensará/compensó)
  estado: EstadoCompensacion;
  observacion: string;
  motivoAnulacion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompensacionConEmpleado extends Compensacion {
  empleado?: Empleado;
}

export interface ResumenCompensacionesEmpleado {
  totalGenerados: number;
  pendientes: number;
  programados: number;
  compensados: number;
  anulados: number;
}

export interface CreateCompensacionDto {
  empleadoId: string;
  fechaGenerada: string;
  observacion?: string;
}

export interface ProgramarCompensacionDto {
  fechaCompensacion: string;
  observacion?: string;
}

export interface AnularCompensacionDto {
  motivoAnulacion: string;
}

export interface DashboardMetrics {
  trabajadoresActivos: number;
  totalDiasPendientes: number;
  compensacionesProgramadas: number;
  compensacionesRealizadas: number;
  topTrabajadoresPendientes: {
    empleadoId: string;
    codigo: string;
    nombre: string;
    documento: string;
    area: string;
    cargo: string;
    diasPendientes: number;
    diasProgramados: number;
    diasCompensados: number;
    totalGenerados: number;
  }[];
}
