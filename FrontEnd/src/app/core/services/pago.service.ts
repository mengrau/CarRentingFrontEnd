import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Pago,
  PagoFilters,
  CreatePagoRequest,
  UpdatePagoRequest,
} from '../../shared/models/pago.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private readonly endpoint = '/Pagos';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todas las categorías con paginación
   */
  getPagos(pagination: PaginationParams, filters?: PagoFilters): Observable<Pago[]> {
    return this.apiService.getPaginated<Pago>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una categoría por ID
   */
  getPagoById(id: string): Observable<Pago> {
    return this.apiService.get<Pago>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva categoría
   */
  createPago(Pago: CreatePagoRequest): Observable<Pago> {
    return this.apiService.post<Pago>(this.endpoint, Pago);
  }

  /**
   * Actualiza una categoría existente
   */
  updatePago(id: string, Pago: UpdatePagoRequest): Observable<Pago> {
    return this.apiService.put<Pago>(`${this.endpoint}/${id}`, Pago);
  }

  /**
   * Elimina una categoría
   */
  deletePago(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene una categoría por nombre
   */
  getPagoByNombre(nombre: string): Observable<Pago> {
    return this.apiService.get<Pago>(`${this.endpoint}/nombre/${nombre}`);
  }
}
