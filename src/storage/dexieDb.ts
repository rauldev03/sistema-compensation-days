import Dexie, { type Table } from 'dexie';
import { Empleado, Feriado, Compensacion } from '../types';

export class ADPmodulDatabase extends Dexie {
  empleados!: Table<Empleado, string>;
  feriados!: Table<Feriado, string>;
  compensaciones!: Table<Compensacion, string>;

  constructor() {
    super('ADPmodulDB');
    this.version(1).stores({
      empleados: 'id, codigo, documentoIdentidad, apellidosNombres, area, cargo, estado, tipoTrabajador',
      feriados: 'id, fecha, estado',
      compensaciones: 'id, empleadoId, fechaGenerada, [empleadoId+fechaGenerada], estado, fechaCompensacion'
    });
  }
}

export const dexieDb = new ADPmodulDatabase();
