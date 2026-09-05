import { Empleado, Feriado, Compensacion, AprobadorPermiso } from '../types';

export const INITIAL_HOLIDAYS_2026: Feriado[] = [
  {
    id: 'fer-2026-01',
    fecha: '2026-01-01',
    descripcion: 'Año Nuevo',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-02',
    fecha: '2026-04-02',
    descripcion: 'Jueves Santo',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-03',
    fecha: '2026-04-03',
    descripcion: 'Viernes Santo',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-04',
    fecha: '2026-05-01',
    descripcion: 'Día del Trabajo',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-05',
    fecha: '2026-06-07',
    descripcion: 'Batalla de Arica y Día de la Bandera',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-06',
    fecha: '2026-06-29',
    descripcion: 'San Pedro y San Pablo',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-07',
    fecha: '2026-07-23',
    descripcion: 'Día de la Fuerza Aérea del Perú',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-08',
    fecha: '2026-07-28',
    descripcion: 'Fiestas Patrias',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-09',
    fecha: '2026-07-29',
    descripcion: 'Fiestas Patrias',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-10',
    fecha: '2026-08-06',
    descripcion: 'Batalla de Junín',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-11',
    fecha: '2026-08-30',
    descripcion: 'Santa Rosa de Lima',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-12',
    fecha: '2026-10-08',
    descripcion: 'Combate de Angamos',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-13',
    fecha: '2026-11-01',
    descripcion: 'Día de Todos los Santos',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-14',
    fecha: '2026-12-08',
    descripcion: 'Inmaculada Concepción',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-15',
    fecha: '2026-12-09',
    descripcion: 'Batalla de Ayacucho',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'fer-2026-16',
    fecha: '2026-12-25',
    descripcion: 'Navidad',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

// Arreglo vacío de empleados iniciales: El sistema arranca 100% limpio sin empleados de prueba
export const INITIAL_EMPLOYEES: Empleado[] = [];

// Arreglo vacío de compensaciones iniciales: El sistema arranca 100% limpio sin compensaciones de prueba
export const INITIAL_COMPENSATIONS: Compensacion[] = [];

export const INITIAL_APPROVERS: AprobadorPermiso[] = [
  {
    id: 'app-001',
    nombreCompleto: 'Lic. María Elena Ramos Paredes',
    cargo: 'JEFE DE RECURSOS HUMANOS',
    area: 'RECURSOS HUMANOS',
    documentoIdentidad: '41209845',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'app-002',
    nombreCompleto: 'Ing. Roberto Chang Morales',
    cargo: 'GERENTE DE OPERACIONES',
    area: 'OPERACIONES',
    documentoIdentidad: '10982341',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'app-003',
    nombreCompleto: 'Ing. Víctor Hugo Alva Sánchez',
    cargo: 'JEFE DE PLANTA SECHÍN',
    area: 'PRODUCCIÓN',
    documentoIdentidad: '43901234',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'app-004',
    nombreCompleto: 'Ing. Manuel Benites Paredes',
    cargo: 'JEFE DE FUNDO IV PALOS',
    area: 'CAMPO / AGRÍCOLA',
    documentoIdentidad: '32890123',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'app-005',
    nombreCompleto: 'Ing. Fernando Castillo Prado',
    cargo: 'GERENTE GENERAL',
    area: 'GERENCIA GENERAL',
    documentoIdentidad: '08761234',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-01-01T08:00:00.000Z'
  },
  {
    id: 'app-006',
    nombreCompleto: 'Sr. David Huamán Espinoza',
    cargo: 'SUPERVISOR DE MANTENIMIENTO',
    area: 'MANTENIMIENTO',
    documentoIdentidad: '45678901',
    estado: 'ACTIVO',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-01-01T08:00:00.000Z'
  }
];
