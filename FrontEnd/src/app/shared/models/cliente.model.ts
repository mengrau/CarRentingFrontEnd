/**
 * Modelo para la entidad Categoría
 */
export interface Cliente {
  id_cliente: string; // UUID
  id: string; // Alias for id_categoria for frontend compatibility
  nombre: string;
  email: string;
  activo: boolean; // Status field
  fecha_creacion: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear una nueva categoría
 */
export interface CreateClienteRequest {
  nombre: string;
  email: string;
}

/**
 * Modelo para actualizar una categoría
 */
export interface UpdateClienteRequest {
  nombre?: string;
  email?: string;
}

/**
 * Modelo para filtros de categorías
 */
export interface ClienteFilters {
  nombre?: string;
  activo?: boolean; // Status filter
}

/**
 * Modelo para respuesta paginada de categorías
 */
export interface ClienteListResponse {
  data: Cliente[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
