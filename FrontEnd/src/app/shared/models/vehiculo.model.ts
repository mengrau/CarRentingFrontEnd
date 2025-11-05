/**
 * Modelo para la entidad Vehiculo
 */
export interface Vehiculo {
  id_vehiculo: string; // UUID
  id: string; // Alias for id_categoria for frontend compatibility
  tipo_id: string;
  marca: string;
  modelo: string;
  placa: string;
  disponible: boolean; // Status field
  id_usuario_creacion: string;
  id_usuario_edicion: string;
  fecha_creacion: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear un nuevo vehiculo
 */
export interface CreateVehiculoRequest {
  marca: string;
  modelo: string;
  tipo_id: string;
  placa: string;
  disponible: boolean; // Status field
  id_usuario_creacion: string;
}

/**
 * Modelo para actualizar un vehiculo
 */
export interface UpdateVehiculoRequest {
  marca?: string;
  modelo?: string;
  tipo_id?: string;
  placa?: string;
  disponible?: boolean; // Status field
  id_usuario_edicion: string;
}

/**
 * Modelo para filtros de vehiculos
 */
export interface VehiculoFilters {
  id?: string;
  activo?: boolean; // Status filter
}

/**
 * Modelo para respuesta paginada de vehiculos
 */
export interface VehiculoListResponse {
  data: Vehiculo[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}