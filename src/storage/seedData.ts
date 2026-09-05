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

export const INITIAL_EMPLOYEES: Empleado[] = [
  {
    id: 'emp-01',
    codigo: '71246850',
    apellidosNombres: 'CUBAS ESTELA CARLOS RAUL',
    documentoIdentidad: '71246850',
    fechaIngreso: '2024-01-15',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADO',
    area: 'SISTEMAS / TI',
    cargo: 'ANALISTA DE INFRAESTRUCTURA TI',
    estado: 'ACTIVO',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: 'emp-02',
    codigo: '32859675',
    apellidosNombres: 'AMAYA CULQUI BRYAN BROCOLI',
    documentoIdentidad: '32859675',
    fechaIngreso: '2023-05-10',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADOS AGRÍCOLAS',
    area: 'MANTENIMIENTO',
    cargo: 'ASISTENTE DE MANTENIMIENTO',
    estado: 'ACTIVO',
    createdAt: '2023-05-10T08:00:00.000Z',
    updatedAt: '2023-05-10T08:00:00.000Z'
  },
  {
    id: 'emp-03',
    codigo: '45892014',
    apellidosNombres: 'MENDOZA VARGAS LUCIA FERNANDA',
    documentoIdentidad: '45892014',
    fechaIngreso: '2022-08-01',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADO',
    area: 'CALIDAD',
    cargo: 'SUPERVISORA DE CONTROL DE CALIDAD',
    estado: 'ACTIVO',
    createdAt: '2022-08-01T08:00:00.000Z',
    updatedAt: '2022-08-01T08:00:00.000Z'
  },
  {
    id: 'emp-04',
    codigo: '70123498',
    apellidosNombres: 'QUISPE MAMANI JORGE LUIS',
    documentoIdentidad: '70123498',
    fechaIngreso: '2023-11-20',
    fechaCese: null,
    tipoTrabajador: 'OBRERO AGRÍCOLA',
    area: 'PRODUCCIÓN',
    cargo: 'OPERARIO DE COSECHA Y RIEGO',
    estado: 'ACTIVO',
    createdAt: '2023-11-20T08:00:00.000Z',
    updatedAt: '2023-11-20T08:00:00.000Z'
  },
  {
    id: 'emp-05',
    codigo: '41987654',
    apellidosNombres: 'HERNANDEZ ROJAS MIGUEL ANGEL',
    documentoIdentidad: '41987654',
    fechaIngreso: '2024-03-01',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADO',
    area: 'LOGÍSTICA',
    cargo: 'COORDINADOR DE DESPACHOS',
    estado: 'ACTIVO',
    createdAt: '2024-03-01T08:00:00.000Z',
    updatedAt: '2024-03-01T08:00:00.000Z'
  },
  {
    id: 'emp-06',
    codigo: '47852196',
    apellidosNombres: 'SALAZAR FLORES CARMEN ROSA',
    documentoIdentidad: '47852196',
    fechaIngreso: '2023-02-15',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADO',
    area: 'PACKING / EMPAQUE',
    cargo: 'JEFA DE LÍNEA DE SELECCIÓN',
    estado: 'ACTIVO',
    createdAt: '2023-02-15T08:00:00.000Z',
    updatedAt: '2023-02-15T08:00:00.000Z'
  },
  {
    id: 'emp-07',
    codigo: '73948120',
    apellidosNombres: 'VALVERDE RIOS GONZALO ANDRES',
    documentoIdentidad: '73948120',
    fechaIngreso: '2024-04-10',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADO',
    area: 'RIEGO Y FERTIRRIEGO',
    cargo: 'TÉCNICO DE FERTIRRIEGO',
    estado: 'ACTIVO',
    createdAt: '2024-04-10T08:00:00.000Z',
    updatedAt: '2024-04-10T08:00:00.000Z'
  },
  {
    id: 'emp-08',
    codigo: '46129837',
    apellidosNombres: 'CORTEZ BAZAN KATHERINE PAOLA',
    documentoIdentidad: '46129837',
    fechaIngreso: '2023-09-01',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADO',
    area: 'RECURSOS HUMANOS',
    cargo: 'ASISTENTE DE BIENESTAR SOCIAL',
    estado: 'ACTIVO',
    createdAt: '2023-09-01T08:00:00.000Z',
    updatedAt: '2023-09-01T08:00:00.000Z'
  },
  {
    id: 'emp-09',
    codigo: '10485923',
    apellidosNombres: 'MORALES CHAVEZ CESAR AUGUSTO',
    documentoIdentidad: '10485923',
    fechaIngreso: '2022-04-18',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADO',
    area: 'SEGURIDAD INDUSTRIAL',
    cargo: 'SUPERVISOR SSOMA',
    estado: 'ACTIVO',
    createdAt: '2022-04-18T08:00:00.000Z',
    updatedAt: '2022-04-18T08:00:00.000Z'
  },
  {
    id: 'emp-10',
    codigo: '72615489',
    apellidosNombres: 'PAREDES GUERRERO JAVIER ENRIQUE',
    documentoIdentidad: '72615489',
    fechaIngreso: '2024-02-01',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADOS AGRÍCOLAS',
    area: 'SANIDAD VEGETAL',
    cargo: 'EVALUADOR DE PLAGAS',
    estado: 'ACTIVO',
    createdAt: '2024-02-01T08:00:00.000Z',
    updatedAt: '2024-02-01T08:00:00.000Z'
  },
  {
    id: 'emp-11',
    codigo: '44981256',
    apellidosNombres: 'GUZMAN CASTILLO DIANA MILAGROS',
    documentoIdentidad: '44981256',
    fechaIngreso: '2023-07-01',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADO',
    area: 'ADMINISTRACIÓN',
    cargo: 'ASISTENTE CONTABLE',
    estado: 'ACTIVO',
    createdAt: '2023-07-01T08:00:00.000Z',
    updatedAt: '2023-07-01T08:00:00.000Z'
  },
  {
    id: 'emp-12',
    codigo: '32904512',
    apellidosNombres: 'TAPIA BENITES HECTOR RAFAEL',
    documentoIdentidad: '32904512',
    fechaIngreso: '2022-11-15',
    fechaCese: null,
    tipoTrabajador: 'EMPLEADOS AGRÍCOLAS',
    area: 'OPERACIONES',
    cargo: 'SUPERVISOR DE CAMPO',
    estado: 'ACTIVO',
    createdAt: '2022-11-15T08:00:00.000Z',
    updatedAt: '2022-11-15T08:00:00.000Z'
  }
];

export const INITIAL_COMPENSATIONS: Compensacion[] = [
  // ── Empleado 1: CUBAS ESTELA CARLOS RAUL (7 días generados trabajados, todos PENDIENTES) ──
  {
    id: 'comp-001',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-01-01',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Guardia soporte técnico feriado Año Nuevo',
    motivoAnulacion: null,
    createdAt: '2026-01-01T18:00:00.000Z',
    updatedAt: '2026-01-01T18:00:00.000Z'
  },
  {
    id: 'comp-002',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-02-08',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Migración base de datos principal y servidores',
    motivoAnulacion: null,
    createdAt: '2026-02-08T18:00:00.000Z',
    updatedAt: '2026-02-08T18:00:00.000Z'
  },
  {
    id: 'comp-003',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-04-02',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Feriado Jueves Santo guardia soporte planta',
    motivoAnulacion: null,
    createdAt: '2026-04-02T18:00:00.000Z',
    updatedAt: '2026-04-02T18:00:00.000Z'
  },
  {
    id: 'comp-004',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-05-01',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Feriado Día del Trabajo guardia operativa TI',
    motivoAnulacion: null,
    createdAt: '2026-05-01T18:00:00.000Z',
    updatedAt: '2026-05-01T18:00:00.000Z'
  },
  {
    id: 'comp-005',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-06-29',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Feriado San Pedro y San Pablo atención incidencias red',
    motivoAnulacion: null,
    createdAt: '2026-06-29T18:00:00.000Z',
    updatedAt: '2026-06-29T18:00:00.000Z'
  },
  {
    id: 'comp-006',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-08-06',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Feriado Batalla de Junín guardia sistemas',
    motivoAnulacion: null,
    createdAt: '2026-08-06T18:00:00.000Z',
    updatedAt: '2026-08-06T18:00:00.000Z'
  },
  {
    id: 'comp-006b',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Guardia dominical cableado estructurado',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 2: AMAYA CULQUI BRYAN BROCOLI (6 registros: 2 Pendientes, 1 Programado, 3 Compensados) ──
  {
    id: 'comp-007',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-01-04',
    fechaCompensacion: '2026-01-09',
    estado: 'COMPENSADO',
    observacion: 'Reparación de bombas de agua en pozo 2',
    motivoAnulacion: null,
    createdAt: '2026-01-04T18:00:00.000Z',
    updatedAt: '2026-01-09T18:00:00.000Z'
  },
  {
    id: 'comp-008',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-02-15',
    fechaCompensacion: '2026-02-20',
    estado: 'COMPENSADO',
    observacion: 'Mantenimiento preventivo de calderas',
    motivoAnulacion: null,
    createdAt: '2026-02-15T18:00:00.000Z',
    updatedAt: '2026-02-20T18:00:00.000Z'
  },
  {
    id: 'comp-009',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-04-03',
    fechaCompensacion: '2026-04-20',
    estado: 'COMPENSADO',
    observacion: 'Feriado Viernes Santo mantenimiento compresores',
    motivoAnulacion: null,
    createdAt: '2026-04-03T18:00:00.000Z',
    updatedAt: '2026-04-20T18:00:00.000Z'
  },
  {
    id: 'comp-010',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-07-29',
    fechaCompensacion: '2026-09-02',
    estado: 'PROGRAMADO',
    observacion: 'Feriado 29 Julio Fiestas Patrias laborado',
    motivoAnulacion: null,
    createdAt: '2026-07-29T18:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'comp-011',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-08-09',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Emergencia de tubería matriz en empaque',
    motivoAnulacion: null,
    createdAt: '2026-08-09T18:00:00.000Z',
    updatedAt: '2026-08-09T18:00:00.000Z'
  },
  {
    id: 'comp-012',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Guardia preventiva maquinaria pesada',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 3: MENDOZA VARGAS LUCIA FERNANDA (6 registros: 3 Pendientes, 1 Programado, 2 Compensados) ──
  {
    id: 'comp-013',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-01-11',
    fechaCompensacion: '2026-01-19',
    estado: 'COMPENSADO',
    observacion: 'Inspección de lotes de exportación domingo',
    motivoAnulacion: null,
    createdAt: '2026-01-11T18:00:00.000Z',
    updatedAt: '2026-01-19T18:00:00.000Z'
  },
  {
    id: 'comp-014',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-04-02',
    fechaCompensacion: '2026-04-10',
    estado: 'COMPENSADO',
    observacion: 'Feriado Jueves Santo inspección embarque',
    motivoAnulacion: null,
    createdAt: '2026-04-02T18:00:00.000Z',
    updatedAt: '2026-04-10T18:00:00.000Z'
  },
  {
    id: 'comp-015',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-07-28',
    fechaCompensacion: '2026-09-08',
    estado: 'PROGRAMADO',
    observacion: 'Feriado Fiestas Patrias supervisión de despacho',
    motivoAnulacion: null,
    createdAt: '2026-07-28T18:00:00.000Z',
    updatedAt: '2026-08-05T10:00:00.000Z'
  },
  {
    id: 'comp-016',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-08-02',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Auditoría express calidad de fruto',
    motivoAnulacion: null,
    createdAt: '2026-08-02T18:00:00.000Z',
    updatedAt: '2026-08-02T18:00:00.000Z'
  },
  {
    id: 'comp-017',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-08-16',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Liberación de contenedor refrigerado domingo',
    motivoAnulacion: null,
    createdAt: '2026-08-16T18:00:00.000Z',
    updatedAt: '2026-08-16T18:00:00.000Z'
  },
  {
    id: 'comp-018',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Turno dominical control de recepción de materia prima',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 4: QUISPE MAMANI JORGE LUIS (6 registros: 2 Pendientes, 1 Programado, 3 Compensados) ──
  {
    id: 'comp-019',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-01-01',
    fechaCompensacion: '2026-01-08',
    estado: 'COMPENSADO',
    observacion: 'Riego tecnificado feriado Año Nuevo',
    motivoAnulacion: null,
    createdAt: '2026-01-01T18:00:00.000Z',
    updatedAt: '2026-01-08T18:00:00.000Z'
  },
  {
    id: 'comp-020',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-03-29',
    fechaCompensacion: '2026-04-06',
    estado: 'COMPENSADO',
    observacion: 'Cosecha pico de campaña domingo',
    motivoAnulacion: null,
    createdAt: '2026-03-29T18:00:00.000Z',
    updatedAt: '2026-04-06T18:00:00.000Z'
  },
  {
    id: 'comp-021',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-05-01',
    fechaCompensacion: '2026-05-11',
    estado: 'COMPENSADO',
    observacion: 'Día del Trabajo guardia en válvulas',
    motivoAnulacion: null,
    createdAt: '2026-05-01T18:00:00.000Z',
    updatedAt: '2026-05-11T18:00:00.000Z'
  },
  {
    id: 'comp-022',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-07-29',
    fechaCompensacion: '2026-09-15',
    estado: 'PROGRAMADO',
    observacion: 'Feriado 29 Julio laborado en campo',
    motivoAnulacion: null,
    createdAt: '2026-07-29T18:00:00.000Z',
    updatedAt: '2026-08-02T10:00:00.000Z'
  },
  {
    id: 'comp-023',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-08-09',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Turno dominical aplicación foliar',
    motivoAnulacion: null,
    createdAt: '2026-08-09T18:00:00.000Z',
    updatedAt: '2026-08-09T18:00:00.000Z'
  },
  {
    id: 'comp-024',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Apertura de compuertas canal principal',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 5: HERNANDEZ ROJAS MIGUEL ANGEL (6 registros: 1 Pendiente, 1 Programado, 3 Compensados, 1 Anulado) ──
  {
    id: 'comp-025',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-04-02',
    fechaCompensacion: '2026-04-14',
    estado: 'COMPENSADO',
    observacion: 'Jueves Santo despacho de carga al puerto',
    motivoAnulacion: null,
    createdAt: '2026-04-02T18:00:00.000Z',
    updatedAt: '2026-04-14T18:00:00.000Z'
  },
  {
    id: 'comp-026',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-05-01',
    fechaCompensacion: '2026-05-12',
    estado: 'COMPENSADO',
    observacion: 'Día del Trabajo guardia de almacén y despacho',
    motivoAnulacion: null,
    createdAt: '2026-05-01T18:00:00.000Z',
    updatedAt: '2026-05-12T18:00:00.000Z'
  },
  {
    id: 'comp-027',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-06-21',
    fechaCompensacion: null,
    estado: 'ANULADO',
    observacion: 'Registro con error de turno',
    motivoAnulacion: 'Error en digitación de fecha por usuario',
    createdAt: '2026-06-21T18:00:00.000Z',
    updatedAt: '2026-06-22T10:00:00.000Z'
  },
  {
    id: 'comp-028',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-07-28',
    fechaCompensacion: '2026-08-18',
    estado: 'COMPENSADO',
    observacion: 'Feriado Fiestas Patrias recepción de envases',
    motivoAnulacion: null,
    createdAt: '2026-07-28T18:00:00.000Z',
    updatedAt: '2026-08-18T18:00:00.000Z'
  },
  {
    id: 'comp-029',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-08-06',
    fechaCompensacion: '2026-09-10',
    estado: 'PROGRAMADO',
    observacion: 'Batalla de Junín coordinación de fletes',
    motivoAnulacion: null,
    createdAt: '2026-08-06T18:00:00.000Z',
    updatedAt: '2026-08-08T10:00:00.000Z'
  },
  {
    id: 'comp-030',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Guardia dominical descarga de fertilizantes',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 6: SALAZAR FLORES CARMEN ROSA (5 registros: 4 Pendientes, 1 Compensado) ──
  {
    id: 'comp-031',
    empleadoId: 'emp-06',
    fechaGenerada: '2026-05-01',
    fechaCompensacion: '2026-05-15',
    estado: 'COMPENSADO',
    observacion: 'Día del Trabajo supervisión turno noche empaque',
    motivoAnulacion: null,
    createdAt: '2026-05-01T18:00:00.000Z',
    updatedAt: '2026-05-15T18:00:00.000Z'
  },
  {
    id: 'comp-032',
    empleadoId: 'emp-06',
    fechaGenerada: '2026-07-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Feriado FAP clasificación de fruta premium',
    motivoAnulacion: null,
    createdAt: '2026-07-23T18:00:00.000Z',
    updatedAt: '2026-07-23T18:00:00.000Z'
  },
  {
    id: 'comp-033',
    empleadoId: 'emp-06',
    fechaGenerada: '2026-07-28',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Feriado 28 Julio turno intensivo selección',
    motivoAnulacion: null,
    createdAt: '2026-07-28T18:00:00.000Z',
    updatedAt: '2026-07-28T18:00:00.000Z'
  },
  {
    id: 'comp-034',
    empleadoId: 'emp-06',
    fechaGenerada: '2026-08-09',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Jornada dominical cierre de lote palta',
    motivoAnulacion: null,
    createdAt: '2026-08-09T18:00:00.000Z',
    updatedAt: '2026-08-09T18:00:00.000Z'
  },
  {
    id: 'comp-035',
    empleadoId: 'emp-06',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Supervisión calibrado de fajas transportadoras domingo',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 7: VALVERDE RIOS GONZALO ANDRES (5 registros: 1 Pendiente, 1 Programado, 3 Compensados) ──
  {
    id: 'comp-036',
    empleadoId: 'emp-07',
    fechaGenerada: '2026-04-03',
    fechaCompensacion: '2026-04-15',
    estado: 'COMPENSADO',
    observacion: 'Viernes Santo dosificación de nutrientes sector sur',
    motivoAnulacion: null,
    createdAt: '2026-04-03T18:00:00.000Z',
    updatedAt: '2026-04-15T18:00:00.000Z'
  },
  {
    id: 'comp-037',
    empleadoId: 'emp-07',
    fechaGenerada: '2026-05-10',
    fechaCompensacion: '2026-05-18',
    estado: 'COMPENSADO',
    observacion: 'Monitoreo de conductividad eléctrica domingo',
    motivoAnulacion: null,
    createdAt: '2026-05-10T18:00:00.000Z',
    updatedAt: '2026-05-18T18:00:00.000Z'
  },
  {
    id: 'comp-038',
    empleadoId: 'emp-07',
    fechaGenerada: '2026-06-07',
    fechaCompensacion: '2026-06-15',
    estado: 'COMPENSADO',
    observacion: 'Día de la Bandera calibración de inyectores',
    motivoAnulacion: null,
    createdAt: '2026-06-07T18:00:00.000Z',
    updatedAt: '2026-06-15T18:00:00.000Z'
  },
  {
    id: 'comp-039',
    empleadoId: 'emp-07',
    fechaGenerada: '2026-07-28',
    fechaCompensacion: '2026-09-07',
    estado: 'PROGRAMADO',
    observacion: 'Fiestas Patrias monitoreo de cabezal de riego',
    motivoAnulacion: null,
    createdAt: '2026-07-28T18:00:00.000Z',
    updatedAt: '2026-08-03T10:00:00.000Z'
  },
  {
    id: 'comp-040',
    empleadoId: 'emp-07',
    fechaGenerada: '2026-08-16',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Corrección de pH en solución madre domingo',
    motivoAnulacion: null,
    createdAt: '2026-08-16T18:00:00.000Z',
    updatedAt: '2026-08-16T18:00:00.000Z'
  },

  // ── Empleado 8: CORTEZ BAZAN KATHERINE PAOLA (5 registros: 2 Pendientes, 3 Compensados) ──
  {
    id: 'comp-041',
    empleadoId: 'emp-08',
    fechaGenerada: '2026-02-15',
    fechaCompensacion: '2026-02-23',
    estado: 'COMPENSADO',
    observacion: 'Atención de campaña médica dominical para personal',
    motivoAnulacion: null,
    createdAt: '2026-02-15T18:00:00.000Z',
    updatedAt: '2026-02-23T18:00:00.000Z'
  },
  {
    id: 'comp-042',
    empleadoId: 'emp-08',
    fechaGenerada: '2026-05-01',
    fechaCompensacion: '2026-05-08',
    estado: 'COMPENSADO',
    observacion: 'Día del Trabajo soporte a cuadrillas de guardia',
    motivoAnulacion: null,
    createdAt: '2026-05-01T18:00:00.000Z',
    updatedAt: '2026-05-08T18:00:00.000Z'
  },
  {
    id: 'comp-043',
    empleadoId: 'emp-08',
    fechaGenerada: '2026-06-29',
    fechaCompensacion: '2026-07-07',
    estado: 'COMPENSADO',
    observacion: 'San Pedro y San Pablo inducción masiva operarios',
    motivoAnulacion: null,
    createdAt: '2026-06-29T18:00:00.000Z',
    updatedAt: '2026-07-07T18:00:00.000Z'
  },
  {
    id: 'comp-044',
    empleadoId: 'emp-08',
    fechaGenerada: '2026-08-02',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Empadronamiento dominical comedor industrial',
    motivoAnulacion: null,
    createdAt: '2026-08-02T18:00:00.000Z',
    updatedAt: '2026-08-02T18:00:00.000Z'
  },
  {
    id: 'comp-045',
    empleadoId: 'emp-08',
    fechaGenerada: '2026-08-16',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Inspección de transporte de personal domingo',
    motivoAnulacion: null,
    createdAt: '2026-08-16T18:00:00.000Z',
    updatedAt: '2026-08-16T18:00:00.000Z'
  },

  // ── Empleado 9: MORALES CHAVEZ CESAR AUGUSTO (5 registros: 3 Pendientes, 1 Programado, 1 Compensado) ──
  {
    id: 'comp-046',
    empleadoId: 'emp-09',
    fechaGenerada: '2026-04-02',
    fechaCompensacion: '2026-04-17',
    estado: 'COMPENSADO',
    observacion: 'Jueves Santo inspección de seguridad en altura',
    motivoAnulacion: null,
    createdAt: '2026-04-02T18:00:00.000Z',
    updatedAt: '2026-04-17T18:00:00.000Z'
  },
  {
    id: 'comp-047',
    empleadoId: 'emp-09',
    fechaGenerada: '2026-07-28',
    fechaCompensacion: '2026-09-18',
    estado: 'PROGRAMADO',
    observacion: 'Fiestas Patrias plan de contingencia SSOMA',
    motivoAnulacion: null,
    createdAt: '2026-07-28T18:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'comp-048',
    empleadoId: 'emp-09',
    fechaGenerada: '2026-08-06',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Batalla de Junín simulacro de evacuación de planta',
    motivoAnulacion: null,
    createdAt: '2026-08-06T18:00:00.000Z',
    updatedAt: '2026-08-06T18:00:00.000Z'
  },
  {
    id: 'comp-049',
    empleadoId: 'emp-09',
    fechaGenerada: '2026-08-09',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Investigación de conato de incendio domingo',
    motivoAnulacion: null,
    createdAt: '2026-08-09T18:00:00.000Z',
    updatedAt: '2026-08-09T18:00:00.000Z'
  },
  {
    id: 'comp-050',
    empleadoId: 'emp-09',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Revisión de extintores y botiquines en campo',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 10: PAREDES GUERRERO JAVIER ENRIQUE (5 registros: 1 Pendiente, 4 Compensados) ──
  {
    id: 'comp-051',
    empleadoId: 'emp-10',
    fechaGenerada: '2026-01-25',
    fechaCompensacion: '2026-02-04',
    estado: 'COMPENSADO',
    observacion: 'Evaluación dominical de roya y trips en lote 5',
    motivoAnulacion: null,
    createdAt: '2026-01-25T18:00:00.000Z',
    updatedAt: '2026-02-04T18:00:00.000Z'
  },
  {
    id: 'comp-052',
    empleadoId: 'emp-10',
    fechaGenerada: '2026-03-15',
    fechaCompensacion: '2026-03-24',
    estado: 'COMPENSADO',
    observacion: 'Muestreo fitosanitario previo a floración',
    motivoAnulacion: null,
    createdAt: '2026-03-15T18:00:00.000Z',
    updatedAt: '2026-03-24T18:00:00.000Z'
  },
  {
    id: 'comp-053',
    empleadoId: 'emp-10',
    fechaGenerada: '2026-05-01',
    fechaCompensacion: '2026-05-14',
    estado: 'COMPENSADO',
    observacion: 'Día del Trabajo revisión de trampas de feromonas',
    motivoAnulacion: null,
    createdAt: '2026-05-01T18:00:00.000Z',
    updatedAt: '2026-05-14T18:00:00.000Z'
  },
  {
    id: 'comp-054',
    empleadoId: 'emp-10',
    fechaGenerada: '2026-06-29',
    fechaCompensacion: '2026-07-10',
    estado: 'COMPENSADO',
    observacion: 'San Pedro y San Pablo censo de arañita roja',
    motivoAnulacion: null,
    createdAt: '2026-06-29T18:00:00.000Z',
    updatedAt: '2026-07-10T18:00:00.000Z'
  },
  {
    id: 'comp-055',
    empleadoId: 'emp-10',
    fechaGenerada: '2026-08-16',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Monitoreo de oídio en brotes tiernos domingo',
    motivoAnulacion: null,
    createdAt: '2026-08-16T18:00:00.000Z',
    updatedAt: '2026-08-16T18:00:00.000Z'
  },

  // ── Empleado 11: GUZMAN CASTILLO DIANA MILAGROS (4 registros: 0 Pendientes, 4 Compensados) ──
  {
    id: 'comp-056',
    empleadoId: 'emp-11',
    fechaGenerada: '2026-01-01',
    fechaCompensacion: '2026-01-16',
    estado: 'COMPENSADO',
    observacion: 'Año Nuevo cierre de estados financieros anuales',
    motivoAnulacion: null,
    createdAt: '2026-01-01T18:00:00.000Z',
    updatedAt: '2026-01-16T18:00:00.000Z'
  },
  {
    id: 'comp-057',
    empleadoId: 'emp-11',
    fechaGenerada: '2026-03-29',
    fechaCompensacion: '2026-04-08',
    estado: 'COMPENSADO',
    observacion: 'Cierre contable trimestral de fin de semana',
    motivoAnulacion: null,
    createdAt: '2026-03-29T18:00:00.000Z',
    updatedAt: '2026-04-08T18:00:00.000Z'
  },
  {
    id: 'comp-058',
    empleadoId: 'emp-11',
    fechaGenerada: '2026-04-02',
    fechaCompensacion: '2026-04-22',
    estado: 'COMPENSADO',
    observacion: 'Jueves Santo cálculo de liquidaciones y CTS',
    motivoAnulacion: null,
    createdAt: '2026-04-02T18:00:00.000Z',
    updatedAt: '2026-04-22T18:00:00.000Z'
  },
  {
    id: 'comp-059',
    empleadoId: 'emp-11',
    fechaGenerada: '2026-06-29',
    fechaCompensacion: '2026-07-15',
    estado: 'COMPENSADO',
    observacion: 'San Pedro y San Pablo auditoría SUNAT preparación',
    motivoAnulacion: null,
    createdAt: '2026-06-29T18:00:00.000Z',
    updatedAt: '2026-07-15T18:00:00.000Z'
  },

  // ── Empleado 12: TAPIA BENITES HECTOR RAFAEL (5 registros: 2 Pendientes, 1 Programado, 2 Compensados) ──
  {
    id: 'comp-060',
    empleadoId: 'emp-12',
    fechaGenerada: '2026-02-08',
    fechaCompensacion: '2026-02-18',
    estado: 'COMPENSADO',
    observacion: 'Supervisión de cuadrilla de cosecha domingo',
    motivoAnulacion: null,
    createdAt: '2026-02-08T18:00:00.000Z',
    updatedAt: '2026-02-18T18:00:00.000Z'
  },
  {
    id: 'comp-061',
    empleadoId: 'emp-12',
    fechaGenerada: '2026-05-01',
    fechaCompensacion: '2026-05-19',
    estado: 'COMPENSADO',
    observacion: 'Día del Trabajo control de asistencia y rendimiento',
    motivoAnulacion: null,
    createdAt: '2026-05-01T18:00:00.000Z',
    updatedAt: '2026-05-19T18:00:00.000Z'
  },
  {
    id: 'comp-062',
    empleadoId: 'emp-12',
    fechaGenerada: '2026-07-29',
    fechaCompensacion: '2026-09-22',
    estado: 'PROGRAMADO',
    observacion: 'Fiestas Patrias despacho de fruta a planta',
    motivoAnulacion: null,
    createdAt: '2026-07-29T18:00:00.000Z',
    updatedAt: '2026-08-04T10:00:00.000Z'
  },
  {
    id: 'comp-063',
    empleadoId: 'emp-12',
    fechaGenerada: '2026-08-02',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Coordinación de corte de racimos domingo',
    motivoAnulacion: null,
    createdAt: '2026-08-02T18:00:00.000Z',
    updatedAt: '2026-08-02T18:00:00.000Z'
  },
  {
    id: 'comp-064',
    empleadoId: 'emp-12',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Relevo de capataces y reporte dominical de jornales',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  }
];

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
