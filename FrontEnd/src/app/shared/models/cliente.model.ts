/**
 * Modelo para la entidad Cliente
 */
export interface Cliente {
  id_cliente: string; // UUID
  id: string; // Alias for id_categoria for frontend compatibility
  nombre: string;
  email: string;
  telefono: string;
  activo: boolean; // Status field
  id_usuario_creacion: string;
  id_usuario_edicion: string;
  fecha_creacion: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear un nuevo cliente
 */
export interface CreateClienteRequest {
  nombre: string;
  email: string;
  telefono: string;
  id_usuario_creacion: string;
}

/**
 * Modelo para actualizar una cliente
 */
export interface UpdateClienteRequest {
  nombre?: string;
  email?: string;
  telefono?: string;
  id_usuario_edicion: string;
}

/**
 * Modelo para filtros de clientes
 */
export interface ClienteFilters {
  nombre?: string;
  activo?: boolean; // Status filter
}

/**
 * Modelo para respuesta paginada de clientes
 */
export interface ClienteListResponse {
  data: Cliente[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
