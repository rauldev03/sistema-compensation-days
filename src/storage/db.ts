import Dexie from 'dexie';
import { Empleado, Feriado, Compensacion, AprobadorPermiso } from '../types';
import { INITIAL_HOLIDAYS_2026, INITIAL_EMPLOYEES, INITIAL_COMPENSATIONS, INITIAL_APPROVERS } from './seedData';
import { dexieDb } from './dexieDb';
import { parseDateString } from '../utils/dateUtils';

const CLEAN_WIPE_VERSION = 'v_adpmodul_seed_64_v5';

const STORAGE_KEYS = {
  EMPLOYEES: 'mf_empleados_v2',
  HOLIDAYS: 'mf_feriados_v2',
  COMPENSATIONS: 'mf_compensaciones_v2',
  APPROVERS: 'mf_aprobadores_v1',
  INITIALIZED: 'mf_db_initialized_v2',
  MIGRATED_TO_DEXIE: 'mf_migrated_to_dexie_v1',
  WIPED_FLAG: 'adpmodul_wiped_flag'
} as const;

type ChangeListener = () => void;

class DatabaseDriver {
  private listeners: Set<ChangeListener> = new Set();
  private employeesCache: Empleado[] = [];
  private holidaysCache: Feriado[] = [];
  private compensationsCache: Compensacion[] = [];
  private approversCache: AprobadorPermiso[] = [];
  private isLoaded: boolean = false;

  constructor() {
    this.initDatabase();
  }

  public isReady(): boolean {
    return this.isLoaded;
  }

  public subscribe(listener: ChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error executing db change listener:', err);
      }
    });
  }

  private sanitizeCompensations(list: Compensacion[]): Compensacion[] {
    return list.map((c) => ({
      ...c,
      fechaGenerada: parseDateString(c.fechaGenerada) || c.fechaGenerada,
      fechaCompensacion: c.fechaCompensacion ? (parseDateString(c.fechaCompensacion) || c.fechaCompensacion) : null
    }));
  }

  private sanitizeEmployees(list: Empleado[]): Empleado[] {
    return list.map((e) => ({
      ...e,
      fechaIngreso: parseDateString(e.fechaIngreso) || e.fechaIngreso,
      fechaCese: e.fechaCese ? (parseDateString(e.fechaCese) || e.fechaCese) : null
    }));
  }

  private sanitizeHolidays(list: Feriado[]): Feriado[] {
    return list.map((h) => ({
      ...h,
      fecha: parseDateString(h.fecha) || h.fecha
    }));
  }

  private async initDatabase(): Promise<void> {
    try {
      // 0. Auto-clean check: Populate initial dataset
      const isAlreadyWiped = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEYS.WIPED_FLAG) === CLEAN_WIPE_VERSION;
      if (!isAlreadyWiped) {
        // Delete old database if exists
        try {
          await Dexie.delete('MiniFlavioDB');
        } catch (_) {}

        // Wipe localStorage legacy keys
        try {
          localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
          localStorage.removeItem(STORAGE_KEYS.COMPENSATIONS);
          localStorage.removeItem(STORAGE_KEYS.HOLIDAYS);
          localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
          localStorage.removeItem(STORAGE_KEYS.MIGRATED_TO_DEXIE);
          localStorage.setItem(STORAGE_KEYS.WIPED_FLAG, CLEAN_WIPE_VERSION);
        } catch (_) {}

        // Populate with the 5 employees and 50 compensations
        this.employeesCache = [...INITIAL_EMPLOYEES];
        this.holidaysCache = [...INITIAL_HOLIDAYS_2026];
        this.compensationsCache = [...INITIAL_COMPENSATIONS];
        this.approversCache = [...INITIAL_APPROVERS];

        await this.persistAllToDexie(INITIAL_EMPLOYEES, INITIAL_HOLIDAYS_2026, INITIAL_COMPENSATIONS, INITIAL_APPROVERS);
        this.isLoaded = true;
        this.notify();
        return;
      }

      // 1. Check if Dexie already has records
      const empCount = await dexieDb.empleados.count();
      const compCount = await dexieDb.compensaciones.count();
      let rawApps: AprobadorPermiso[] = [];
      try {
        rawApps = await dexieDb.aprobadores.toArray();
      } catch (_) {}

      if (rawApps.length === 0) {
        rawApps = [...INITIAL_APPROVERS];
        try {
          await dexieDb.aprobadores.bulkPut(INITIAL_APPROVERS);
        } catch (_) {}
      }
      this.approversCache = rawApps;

      if (empCount > 0 || compCount > 0) {
        // Load directly from Dexie (IndexedDB) and sanitize any legacy date formats
        const rawEmps = await dexieDb.empleados.toArray();
        const rawHols = await dexieDb.feriados.toArray();
        const rawComps = await dexieDb.compensaciones.toArray();

        this.employeesCache = this.sanitizeEmployees(rawEmps);
        this.holidaysCache = this.sanitizeHolidays(rawHols.length > 0 ? rawHols : INITIAL_HOLIDAYS_2026);
        this.compensationsCache = this.sanitizeCompensations(rawComps);

        // If any date was updated by sanitization, persist back to Dexie
        this.persistAllToDexie(this.employeesCache, this.holidaysCache, this.compensationsCache, this.approversCache).catch(() => {});
      } else {
        // Fresh installation: load seed data into Dexie
        await this.persistAllToDexie(
          INITIAL_EMPLOYEES,
          INITIAL_HOLIDAYS_2026,
          INITIAL_COMPENSATIONS,
          INITIAL_APPROVERS
        );
        this.employeesCache = [...INITIAL_EMPLOYEES];
        this.holidaysCache = [...INITIAL_HOLIDAYS_2026];
        this.compensationsCache = [...INITIAL_COMPENSATIONS];
        this.approversCache = [...INITIAL_APPROVERS];
      }

      this.isLoaded = true;
      this.notify();
    } catch (e) {
      console.warn('Dexie IndexedDB initialization error, fallback to memory cache:', e);
      // Fallback to seed data in memory
      if (this.employeesCache.length === 0) {
        this.employeesCache = [...INITIAL_EMPLOYEES];
        this.holidaysCache = [...INITIAL_HOLIDAYS_2026];
        this.compensationsCache = [...INITIAL_COMPENSATIONS];
        this.approversCache = [...INITIAL_APPROVERS];
      }
      this.isLoaded = true;
      this.notify();
    }
  }

  private async persistAllToDexie(
    emps: Empleado[],
    hols: Feriado[],
    comps: Compensacion[],
    apps: AprobadorPermiso[] = this.approversCache
  ): Promise<void> {
    try {
      await dexieDb.transaction('rw', dexieDb.empleados, dexieDb.feriados, dexieDb.compensaciones, dexieDb.aprobadores, async () => {
        await dexieDb.empleados.clear();
        await dexieDb.empleados.bulkPut(emps);

        await dexieDb.feriados.clear();
        await dexieDb.feriados.bulkPut(hols);

        await dexieDb.compensaciones.clear();
        await dexieDb.compensaciones.bulkPut(comps);

        await dexieDb.aprobadores.clear();
        await dexieDb.aprobadores.bulkPut(apps.length > 0 ? apps : INITIAL_APPROVERS);
      });
    } catch (err) {
      console.error('Error in persistAllToDexie:', err);
    }
  }

  public async loadSampleData(): Promise<void> {
    try {
      this.employeesCache = [...INITIAL_EMPLOYEES];
      this.holidaysCache = [...INITIAL_HOLIDAYS_2026];
      this.compensationsCache = [...INITIAL_COMPENSATIONS];

      await this.persistAllToDexie(
        INITIAL_EMPLOYEES,
        INITIAL_HOLIDAYS_2026,
        INITIAL_COMPENSATIONS
      );
      this.notify();
    } catch (e) {
      console.error('Error loading sample data:', e);
      this.notify();
    }
  }

  public async resetToDefaults(): Promise<void> {
    try {
      this.employeesCache = [...INITIAL_EMPLOYEES];
      this.holidaysCache = [...INITIAL_HOLIDAYS_2026];
      this.compensationsCache = [...INITIAL_COMPENSATIONS];

      await this.persistAllToDexie(
        INITIAL_EMPLOYEES,
        INITIAL_HOLIDAYS_2026,
        INITIAL_COMPENSATIONS
      );

      try {
        localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
        localStorage.removeItem(STORAGE_KEYS.COMPENSATIONS);
        localStorage.removeItem(STORAGE_KEYS.HOLIDAYS);
        localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
        localStorage.removeItem(STORAGE_KEYS.MIGRATED_TO_DEXIE);
      } catch (_) {}

      this.notify();
    } catch (e) {
      console.error('Error resetting database to defaults:', e);
      this.notify();
    }
  }

  public async clearAllData(keepHolidays = true): Promise<void> {
    try {
      this.employeesCache = [];
      this.compensationsCache = [];
      if (!keepHolidays) {
        this.holidaysCache = [];
      } else {
        this.holidaysCache = [...INITIAL_HOLIDAYS_2026];
      }

      await this.persistAllToDexie(
        [],
        this.holidaysCache,
        []
      );

      try {
        localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
        localStorage.removeItem(STORAGE_KEYS.COMPENSATIONS);
        if (!keepHolidays) {
          localStorage.removeItem(STORAGE_KEYS.HOLIDAYS);
        }
      } catch (_) {}

      this.notify();
    } catch (e) {
      console.error('Error clearing data:', e);
      this.notify();
    }
  }

  // --- Empleados ---
  public getEmployees(): Empleado[] {
    return this.employeesCache;
  }

  public saveEmployees(employees: Empleado[]): void {
    this.employeesCache = employees;
    this.notify();

    // Async persist to Dexie (IndexedDB)
    dexieDb.empleados.clear()
      .then(() => dexieDb.empleados.bulkPut(employees))
      .catch((err) => console.error('Error saving employees to Dexie:', err));
  }

  // --- Feriados ---
  public getHolidays(): Feriado[] {
    return this.holidaysCache;
  }

  public saveHolidays(holidays: Feriado[]): void {
    this.holidaysCache = holidays;
    this.notify();

    // Async persist to Dexie (IndexedDB)
    dexieDb.feriados.clear()
      .then(() => dexieDb.feriados.bulkPut(holidays))
      .catch((err) => console.error('Error saving holidays to Dexie:', err));
  }

  // --- Compensaciones ---
  public getCompensations(): Compensacion[] {
    return this.compensationsCache;
  }

  public saveCompensations(compensations: Compensacion[]): void {
    this.compensationsCache = compensations;
    this.notify();

    // Async persist to Dexie (IndexedDB)
    dexieDb.compensaciones.clear()
      .then(() => dexieDb.compensaciones.bulkPut(compensations))
      .catch((err) => console.error('Error saving compensations to Dexie:', err));
  }

  // --- Aprobadores de Permisos ---
  public getApprovers(): AprobadorPermiso[] {
    return this.approversCache.length > 0 ? this.approversCache : INITIAL_APPROVERS;
  }

  public saveApprovers(approvers: AprobadorPermiso[]): void {
    this.approversCache = approvers;
    this.notify();

    // Async persist to Dexie (IndexedDB)
    dexieDb.aprobadores.clear()
      .then(() => dexieDb.aprobadores.bulkPut(approvers))
      .catch((err) => console.error('Error saving approvers to Dexie:', err));
  }

  // --- Respaldo y Restauración Masiva ---
  public exportBackup(): string {
    return JSON.stringify(
      {
        version: '2.0',
        engine: 'Dexie (IndexedDB)',
        exportedAt: new Date().toISOString(),
        employees: this.getEmployees(),
        holidays: this.getHolidays(),
        compensations: this.getCompensations()
      },
      null,
      2
    );
  }

  public importBackup(jsonString: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (
        !Array.isArray(data.employees) ||
        !Array.isArray(data.holidays) ||
        !Array.isArray(data.compensations)
      ) {
        return {
          success: false,
          error: 'El archivo JSON no tiene la estructura requerida (employees, holidays, compensations).'
        };
      }

      this.employeesCache = data.employees;
      this.holidaysCache = data.holidays;
      this.compensationsCache = data.compensations;

      this.persistAllToDexie(data.employees, data.holidays, data.compensations)
        .then(() => this.notify())
        .catch((err) => console.error('Error importing backup to Dexie:', err));

      this.notify();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: 'Formato JSON inválido: ' + (e?.message || '') };
    }
  }
}

export const db = new DatabaseDriver();
