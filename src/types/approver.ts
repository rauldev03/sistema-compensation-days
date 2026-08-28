export interface AprobadorPermiso {
  id: string;
  nombreCompleto: string;
  cargo: string;
  area: string;
  documentoIdentidad?: string;
  estado: 'ACTIVO' | 'INACTIVO';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAprobadorDto {
  nombreCompleto: string;
  cargo: string;
  area: string;
  documentoIdentidad?: string;
}

export interface UpdateAprobadorDto {
  nombreCompleto?: string;
  cargo?: string;
  area?: string;
  documentoIdentidad?: string;
  estado?: 'ACTIVO' | 'INACTIVO';
}
