/**
 * Modelo para la entidad TipoVehiculo
 */
export interface TipoVehiculo {
  id_tipoVehiculo: string; // UUID
  id: string; // Alias for id_tipoVehiculo for frontend compatibility
  nombre: string;
  descripcion: string;
  activo: boolean;
  id_usuario_creacion: string;
  id_usuario_edicion?: string;
  fecha_creacion: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear un nuevo tipoVehiculo
 */
export interface CreateTipoVehiculoRequest {
  nombre: string;
  descripcion: string;
  activo: boolean;
  id_usuario_creacion: string;
}

/**
 * Modelo para actualizar un tipoVehiculo
 */
export interface UpdateTipoVehiculoRequest {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
  id_usuario_edicion: string;
}

/**
 * Modelo para filtros de tipoVehiculos
 */
export interface TipoVehiculoFilters {
  nombre?: string;
}

/**
 * Modelo para respuesta paginada de tipoVehiculos
 */
export interface TipoVehiculoListResponse {
  data: TipoVehiculo[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}