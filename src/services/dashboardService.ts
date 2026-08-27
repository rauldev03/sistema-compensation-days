import { DashboardMetrics } from '../types';
import { employeeRepository, compensationRepository } from '../storage';

export class DashboardService {
  public getMetrics(): DashboardMetrics {
    const employees = employeeRepository.getAll();
    const compensations = compensationRepository.getAll();

    // 1. Trabajadores activos
    const trabajadoresActivos = employees.filter((e) => e.estado === 'ACTIVO').length;

    // 2. Total días pendientes
    const totalDiasPendientes = compensations.filter((c) => c.estado === 'PENDIENTE').length;

    // 3. Compensaciones programadas
    const compensacionesProgramadas = compensations.filter(
      (c) => c.estado === 'PROGRAMADO'
    ).length;

    // 4. Compensaciones realizadas
    const compensacionesRealizadas = compensations.filter(
      (c) => c.estado === 'COMPENSADO'
    ).length;

    // 5. Trabajadores con más días pendientes
    const employeePendingCounts = employees.map((emp) => {
      const empComps = compensations.filter((c) => c.empleadoId === emp.id);
      const pendientes = empComps.filter((c) => c.estado === 'PENDIENTE').length;
      const programados = empComps.filter((c) => c.estado === 'PROGRAMADO').length;
      const compensados = empComps.filter((c) => c.estado === 'COMPENSADO').length;

      return {
        empleadoId: emp.id,
        codigo: emp.codigo,
        nombre: emp.apellidosNombres,
        documento: emp.documentoIdentidad,
        area: emp.area,
        cargo: emp.cargo,
        diasPendientes: pendientes,
        diasProgramados: programados,
        diasCompensados: compensados,
        totalGenerados: empComps.length
      };
    });

    // Ordenar descendente por días pendientes y filtrar los que tengan al menos 1 día pendiente o mostrar top activos
    const topTrabajadoresPendientes = employeePendingCounts
      .sort((a, b) => {
        if (b.diasPendientes !== a.diasPendientes) {
          return b.diasPendientes - a.diasPendientes;
        }
        return b.totalGenerados - a.totalGenerados;
      })
      .slice(0, 10);

    return {
      trabajadoresActivos,
      totalDiasPendientes,
      compensacionesProgramadas,
      compensacionesRealizadas,
      topTrabajadoresPendientes
    };
  }
}

export const dashboardService = new DashboardService();
