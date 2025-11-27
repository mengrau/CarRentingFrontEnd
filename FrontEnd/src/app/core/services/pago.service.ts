import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreatePagoRequest,
  Pago,
  PagoFilters,
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

  getPagos(pagination: PaginationParams, filters?: PagoFilters): Observable<Pago[]> {
    return this.apiService.getPaginated<Pago>(this.endpoint, pagination, filters);
  }

  getPagoById(id: string): Observable<Pago> {
    return this.apiService.get<Pago>(`${this.endpoint}/${id}`);
  }

  createPago(Pago: CreatePagoRequest): Observable<Pago> {
    return this.apiService.post<Pago>(this.endpoint, Pago);
  }

  updatePago(id: string, Pago: UpdatePagoRequest): Observable<Pago> {
    return this.apiService.put<Pago>(`${this.endpoint}/${id}`, Pago);
  }

  deletePago(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  getPagoByNombre(nombre: string): Observable<Pago> {
    return this.apiService.get<Pago>(`${this.endpoint}/nombre/${nombre}`);
  }
}
