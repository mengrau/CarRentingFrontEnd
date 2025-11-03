/**
 * Modelo para la entidad Categoría
 */
export interface Usuario {
  id_usuario: string; // UUID
  id: string; // Alias for id_categoria for frontend compatibility
  username: string;
  password: string;
  rol: 'admin';
  estado: boolean; // Status field
  id_usuario_creacion: string;
  id_usuario_edicion: string;
  fecha_creacion: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear una nueva categoría
 */
export interface CreateUsuarioRequest {
  username: string;
  rol: 'admin';
  estado: true;
  password: string;
  id_usuario_creacion: string;
}

/**
 * Modelo para actualizar una categoría
 */
export interface UpdateUsuarioRequest {
  username?: string;
  password: string;
  rol?: 'admin';
  estado?: true;
  id_usuario_edicion: string;
}

/**
 * Modelo para filtros de categorías
 */
export interface UsuarioFilters {
  username?: string;
}

/**
 * Modelo para respuesta paginada de categorías
 */
export interface UsuarioListResponse {
  data: Usuario[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
