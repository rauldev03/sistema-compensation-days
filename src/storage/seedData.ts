import { Empleado, Feriado, Compensacion } from '../types';

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
  }
];

export const INITIAL_COMPENSATIONS: Compensacion[] = [
  // ── Empleado 1: CUBAS ESTELA CARLOS RAUL (10 registros) ──
  {
    id: 'comp-001',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-01-01',
    fechaCompensacion: '2026-01-12',
    estado: 'COMPENSADO',
    observacion: 'Guardia soporte técnico feriado Año Nuevo',
    motivoAnulacion: null,
    createdAt: '2026-01-01T18:00:00.000Z',
    updatedAt: '2026-01-12T18:00:00.000Z'
  },
  {
    id: 'comp-002',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-01-18',
    fechaCompensacion: '2026-01-26',
    estado: 'COMPENSADO',
    observacion: 'Mantenimiento preventivo servidores',
    motivoAnulacion: null,
    createdAt: '2026-01-18T18:00:00.000Z',
    updatedAt: '2026-01-26T18:00:00.000Z'
  },
  {
    id: 'comp-003',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-02-08',
    fechaCompensacion: '2026-02-16',
    estado: 'COMPENSADO',
    observacion: 'Migración base de datos principal',
    motivoAnulacion: null,
    createdAt: '2026-02-08T18:00:00.000Z',
    updatedAt: '2026-02-16T18:00:00.000Z'
  },
  {
    id: 'comp-004',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-03-15',
    fechaCompensacion: '2026-03-23',
    estado: 'COMPENSADO',
    observacion: 'Guardia dominical soporte infraestructura',
    motivoAnulacion: null,
    createdAt: '2026-03-15T18:00:00.000Z',
    updatedAt: '2026-03-23T18:00:00.000Z'
  },
  {
    id: 'comp-005',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-04-02',
    fechaCompensacion: '2026-04-13',
    estado: 'COMPENSADO',
    observacion: 'Feriado Jueves Santo laborado',
    motivoAnulacion: null,
    createdAt: '2026-04-02T18:00:00.000Z',
    updatedAt: '2026-04-13T18:00:00.000Z'
  },
  {
    id: 'comp-006',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-05-01',
    fechaCompensacion: '2026-05-18',
    estado: 'COMPENSADO',
    observacion: 'Turno de guardia Feriado 1 de Mayo',
    motivoAnulacion: null,
    createdAt: '2026-05-01T18:00:00.000Z',
    updatedAt: '2026-05-18T18:00:00.000Z'
  },
  {
    id: 'comp-007',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-06-29',
    fechaCompensacion: '2026-07-06',
    estado: 'COMPENSADO',
    observacion: 'Atención incidencias enlaces de red',
    motivoAnulacion: null,
    createdAt: '2026-06-29T18:00:00.000Z',
    updatedAt: '2026-07-06T18:00:00.000Z'
  },
  {
    id: 'comp-008',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-07-28',
    fechaCompensacion: '2026-08-14',
    estado: 'COMPENSADO',
    observacion: 'Feriado Fiestas Patrias laborado',
    motivoAnulacion: null,
    createdAt: '2026-07-28T18:00:00.000Z',
    updatedAt: '2026-08-14T18:00:00.000Z'
  },
  {
    id: 'comp-009',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-08-06',
    fechaCompensacion: '2026-09-04',
    estado: 'PROGRAMADO',
    observacion: 'Feriado Batalla de Junín - compensación programada',
    motivoAnulacion: null,
    createdAt: '2026-08-06T18:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z'
  },
  {
    id: 'comp-010',
    empleadoId: 'emp-01',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Guardia dominical cableado estructurado',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 2: AMAYA CULQUI BRYAN BROCOLI (10 registros) ──
  {
    id: 'comp-011',
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
    id: 'comp-012',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-01-25',
    fechaCompensacion: '2026-02-02',
    estado: 'COMPENSADO',
    observacion: 'Revisión y cambio de aceite grupo electrógeno',
    motivoAnulacion: null,
    createdAt: '2026-01-25T18:00:00.000Z',
    updatedAt: '2026-02-02T18:00:00.000Z'
  },
  {
    id: 'comp-013',
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
    id: 'comp-014',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-03-08',
    fechaCompensacion: '2026-03-16',
    estado: 'COMPENSADO',
    observacion: 'Guardia mantenimiento eléctrico sector norte',
    motivoAnulacion: null,
    createdAt: '2026-03-08T18:00:00.000Z',
    updatedAt: '2026-03-16T18:00:00.000Z'
  },
  {
    id: 'comp-015',
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
    id: 'comp-016',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-05-17',
    fechaCompensacion: '2026-05-25',
    estado: 'COMPENSADO',
    observacion: 'Reparación tablero de distribución',
    motivoAnulacion: null,
    createdAt: '2026-05-17T18:00:00.000Z',
    updatedAt: '2026-05-25T18:00:00.000Z'
  },
  {
    id: 'comp-017',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-06-07',
    fechaCompensacion: '2026-06-19',
    estado: 'COMPENSADO',
    observacion: 'Feriado Día de la Bandera guardia técnica',
    motivoAnulacion: null,
    createdAt: '2026-06-07T18:00:00.000Z',
    updatedAt: '2026-06-19T18:00:00.000Z'
  },
  {
    id: 'comp-018',
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
    id: 'comp-019',
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
    id: 'comp-020',
    empleadoId: 'emp-02',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Guardia preventiva maquinaria pesada',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 3: MENDOZA VARGAS LUCIA FERNANDA (10 registros) ──
  {
    id: 'comp-021',
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
    id: 'comp-022',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-02-01',
    fechaCompensacion: '2026-02-09',
    estado: 'COMPENSADO',
    observacion: 'Control de microbiología en túneles de frío',
    motivoAnulacion: null,
    createdAt: '2026-02-01T18:00:00.000Z',
    updatedAt: '2026-02-09T18:00:00.000Z'
  },
  {
    id: 'comp-023',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-03-01',
    fechaCompensacion: '2026-03-09',
    estado: 'COMPENSADO',
    observacion: 'Auditoría interna HACCP de fin de semana',
    motivoAnulacion: null,
    createdAt: '2026-03-01T18:00:00.000Z',
    updatedAt: '2026-03-09T18:00:00.000Z'
  },
  {
    id: 'comp-024',
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
    id: 'comp-025',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-05-01',
    fechaCompensacion: '2026-05-11',
    estado: 'COMPENSADO',
    observacion: 'Feriado 1 de Mayo control empaque arándanos',
    motivoAnulacion: null,
    createdAt: '2026-05-01T18:00:00.000Z',
    updatedAt: '2026-05-11T18:00:00.000Z'
  },
  {
    id: 'comp-026',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-06-14',
    fechaCompensacion: '2026-06-22',
    estado: 'COMPENSADO',
    observacion: 'Validación de parámetros térmicos en cámara 4',
    motivoAnulacion: null,
    createdAt: '2026-06-14T18:00:00.000Z',
    updatedAt: '2026-06-22T18:00:00.000Z'
  },
  {
    id: 'comp-027',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-07-23',
    fechaCompensacion: '2026-07-31',
    estado: 'COMPENSADO',
    observacion: 'Feriado FAP muestreo aleatorio de calidad',
    motivoAnulacion: null,
    createdAt: '2026-07-23T18:00:00.000Z',
    updatedAt: '2026-07-31T18:00:00.000Z'
  },
  {
    id: 'comp-028',
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
    id: 'comp-029',
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
    id: 'comp-030',
    empleadoId: 'emp-03',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Turno dominical control de recepción de materia prima',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 4: QUISPE MAMANI JORGE LUIS (10 registros) ──
  {
    id: 'comp-031',
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
    id: 'comp-032',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-01-18',
    fechaCompensacion: '2026-01-23',
    estado: 'COMPENSADO',
    observacion: 'Jornada dominical fertilización lote 12',
    motivoAnulacion: null,
    createdAt: '2026-01-18T18:00:00.000Z',
    updatedAt: '2026-01-23T18:00:00.000Z'
  },
  {
    id: 'comp-033',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-02-22',
    fechaCompensacion: '2026-03-02',
    estado: 'COMPENSADO',
    observacion: 'Monitoreo de humedad en campo',
    motivoAnulacion: null,
    createdAt: '2026-02-22T18:00:00.000Z',
    updatedAt: '2026-03-02T18:00:00.000Z'
  },
  {
    id: 'comp-034',
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
    id: 'comp-035',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-04-03',
    fechaCompensacion: '2026-04-17',
    estado: 'COMPENSADO',
    observacion: 'Viernes Santo turno de riego por goteo',
    motivoAnulacion: null,
    createdAt: '2026-04-03T18:00:00.000Z',
    updatedAt: '2026-04-17T18:00:00.000Z'
  },
  {
    id: 'comp-036',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-05-24',
    fechaCompensacion: '2026-06-01',
    estado: 'COMPENSADO',
    observacion: 'Poda y deshierbe dominical sector A',
    motivoAnulacion: null,
    createdAt: '2026-05-24T18:00:00.000Z',
    updatedAt: '2026-06-01T18:00:00.000Z'
  },
  {
    id: 'comp-037',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-06-29',
    fechaCompensacion: '2026-07-03',
    estado: 'COMPENSADO',
    observacion: 'Feriado San Pedro y San Pablo cuadrilla de cosecha',
    motivoAnulacion: null,
    createdAt: '2026-06-29T18:00:00.000Z',
    updatedAt: '2026-07-03T18:00:00.000Z'
  },
  {
    id: 'comp-038',
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
    id: 'comp-039',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-08-02',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Turno dominical aplicación foliar',
    motivoAnulacion: null,
    createdAt: '2026-08-02T18:00:00.000Z',
    updatedAt: '2026-08-02T18:00:00.000Z'
  },
  {
    id: 'comp-040',
    empleadoId: 'emp-04',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Apertura de compuertas canal principal',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },

  // ── Empleado 5: HERNANDEZ ROJAS MIGUEL ANGEL (10 registros) ──
  {
    id: 'comp-041',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-03-22',
    fechaCompensacion: '2026-03-30',
    estado: 'COMPENSADO',
    observacion: 'Recepción de insumos importados domingo',
    motivoAnulacion: null,
    createdAt: '2026-03-22T18:00:00.000Z',
    updatedAt: '2026-03-30T18:00:00.000Z'
  },
  {
    id: 'comp-042',
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
    id: 'comp-043',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-04-26',
    fechaCompensacion: '2026-05-04',
    estado: 'COMPENSADO',
    observacion: 'Inventario cíclico almacén central',
    motivoAnulacion: null,
    createdAt: '2026-04-26T18:00:00.000Z',
    updatedAt: '2026-05-04T18:00:00.000Z'
  },
  {
    id: 'comp-044',
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
    id: 'comp-045',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-05-31',
    fechaCompensacion: '2026-06-08',
    estado: 'COMPENSADO',
    observacion: 'Cierre de mes despachos aéreo y marítimo',
    motivoAnulacion: null,
    createdAt: '2026-05-31T18:00:00.000Z',
    updatedAt: '2026-06-08T18:00:00.000Z'
  },
  {
    id: 'comp-046',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-06-21',
    fechaCompensacion: null,
    estado: 'ANULADO',
    observacion: 'Registro duplicado de prueba',
    motivoAnulacion: 'Error en digitación de fecha por usuario',
    createdAt: '2026-06-21T18:00:00.000Z',
    updatedAt: '2026-06-22T10:00:00.000Z'
  },
  {
    id: 'comp-047',
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
    id: 'comp-048',
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
    id: 'comp-049',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-08-16',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Despacho urgente a cliente mayorista domingo',
    motivoAnulacion: null,
    createdAt: '2026-08-16T18:00:00.000Z',
    updatedAt: '2026-08-16T18:00:00.000Z'
  },
  {
    id: 'comp-050',
    empleadoId: 'emp-05',
    fechaGenerada: '2026-08-23',
    fechaCompensacion: null,
    estado: 'PENDIENTE',
    observacion: 'Guardia dominical descarga de fertilizantes',
    motivoAnulacion: null,
    createdAt: '2026-08-23T18:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  }
];
