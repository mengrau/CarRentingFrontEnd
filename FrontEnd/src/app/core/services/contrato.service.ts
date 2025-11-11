import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Contrato,
  ContratoFilters,
  CreateContratoRequest,
  UpdateContratoRequest,
} from '../../shared/models/contrato.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ContratoService {
  private readonly endpoint = '/Contratos';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todas las categorías con paginación
   */
  getContratos(pagination: PaginationParams, filters?: ContratoFilters): Observable<Contrato[]> {
    return this.apiService.getPaginated<Contrato>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una categoría por ID
   */
  getContratoById(id: string): Observable<Contrato> {
    return this.apiService.get<Contrato>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva categoría
   */
  createContrato(Contrato: CreateContratoRequest): Observable<Contrato> {
    return this.apiService.post<Contrato>(this.endpoint, Contrato);
  }

  /**
   * Actualiza una categoría existente
   */
  updateContrato(id: string, Contrato: UpdateContratoRequest): Observable<Contrato> {
    return this.apiService.put<Contrato>(`${this.endpoint}/${id}`, Contrato);
  }

  /**
   * Elimina una categoría
   */
  deleteContrato(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene una categoría por nombre
   */
  getContratoByNombre(nombre: string): Observable<Contrato> {
    return this.apiService.get<Contrato>(`${this.endpoint}/nombre/${nombre}`);
  }
}
