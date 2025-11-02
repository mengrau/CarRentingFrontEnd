/**
 * Modelo para la entidad Empleado
 */
export interface Empleado {
  id_empleado: string; // UUID
  id: string; // Alias for id_empleado for frontend compatibility
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  id_usuario_creacion: string;
  id_usuario_edicion?: string;
  fecha_creacion: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear un nuevo empleado
 */
export interface CreateEmpleadoRequest {
  nombre: string;
  email: string;
  rol: string;
  activo?: boolean; // opcional, por defecto puede ser true en backend
  id_usuario_creacion: string;
}

/**
 * Modelo para actualizar un empleado
 */
export interface UpdateEmpleadoRequest {
  nombre?: string;
  email?: string;
  rol?: string;
  activo?: boolean;
  id_usuario_edicion: string;
}

/**
 * Modelo para filtros de empleados
 */
export interface EmpleadoFilters {
  nombre?: string;
  rol?: string;
  activo?: boolean;
}

/**
 * Modelo para respuesta paginada de empleados
 */
export interface EmpleadoListResponse {
  data: Empleado[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}