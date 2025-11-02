/**
 * Modelo para la entidad Categoría
 */
export interface Contrato {
  id_contrato: string; // UUID
  id: string; // Alias for id_categoria for frontend compatibility
  cliente_id: string;
  vehiculo_id: string;
  empleado_id: string;
  fecha_inicio: string;
  fecha_fin?: string;
  activo: boolean; // Status field
  id_usuario_creacion: string;
  id_usuario_edicion?: string;
  fecha_creacion: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear una nueva categoría
 */
export interface CreateContratoRequest {
  cliente_id: string;
  vehiculo_id: string;
  empleado_id: string;
  fecha_inicio: string;
  fecha_fin?: string;
  id_usuario_creacion: string;
}

/**
 * Modelo para actualizar una categoría
 */
export interface UpdateContratoRequest {
  cliente_id?: string;
  vehiculo_id?: string;
  empleado_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  id_usuario_edicion: string;
}

/**
 * Modelo para filtros de categorías
 */
export interface ContratoFilters {
  nombre?: string;
  activo?: boolean; // Status filter
}

/**
 * Modelo para respuesta paginada de categorías
 */
export interface ContratoListResponse {
  data: Contrato[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
