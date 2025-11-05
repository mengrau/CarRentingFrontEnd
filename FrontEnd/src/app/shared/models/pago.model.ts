/**
 * Modelo para la entidad Pago
 */
export interface Pago {
  id_pago: string; // UUID
  id: string; // Alias for id_pago for frontend compatibility
  contrato_id: string;
  monto: number;
  fecha_pago: string;
  id_usuario_creacion: string;
  id_usuario_edicion?: string;
  fecha_creacion: string;
  fecha_edicion?: string;
}

/**
 * Modelo para crear un nuevo pago
 */
export interface CreatePagoRequest {
  contrato_id: string;
  monto: number;
  rol: string;
  fecha_pago: string; 
  id_usuario_creacion: string;
}

/**
 * Modelo para actualizar un pago
 */
export interface UpdatePagoRequest {
  monto?: number;
  fecha_pago?: string;
  id_usuario_edicion: string;
}

/**
 * Modelo para filtros de pagos
 */
export interface PagoFilters {
  id?: string;
}

/**
 * Modelo para respuesta paginada de pagos
 */
export interface PagoListResponse {
  data: Pago[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}