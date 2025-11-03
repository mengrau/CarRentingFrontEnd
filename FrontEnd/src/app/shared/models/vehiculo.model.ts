/**
 * Modelo para la entidad Categoría
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
 * Modelo para crear una nueva categoría
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
 * Modelo para actualizar una categoría
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
 * Modelo para filtros de categorías
 */
export interface VehiculoFilters {
  id?: string;
  activo?: boolean; // Status filter
}

/**
 * Modelo para respuesta paginada de categorías
 */
export interface VehiculoListResponse {
  data: Vehiculo[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}