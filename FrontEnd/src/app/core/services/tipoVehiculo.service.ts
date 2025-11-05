import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TipoVehiculo,
  TipoVehiculoFilters,
  CreateTipoVehiculoRequest,
  UpdateTipoVehiculoRequest,
} from '../../shared/models/tipoVehiculo.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class TipoVehiculoService {
  private readonly endpoint = '/Tipos-de-Vehiculos';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todas las categorías con paginación
   */
  getTipoVehiculos(pagination: PaginationParams, filters?: TipoVehiculoFilters): Observable<TipoVehiculo[]> {
    return this.apiService.getPaginated<TipoVehiculo>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una categoría por ID
   */
  getTipoVehiculoById(id: string): Observable<TipoVehiculo> {
    return this.apiService.get<TipoVehiculo>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva categoría
   */
  createTipoVehiculo(TipoVehiculo: CreateTipoVehiculoRequest): Observable<TipoVehiculo> {
    return this.apiService.post<TipoVehiculo>(this.endpoint, TipoVehiculo);
  }

  /**
   * Actualiza una categoría existente
   */
  updateTipoVehiculo(id: string, TipoVehiculo: UpdateTipoVehiculoRequest): Observable<TipoVehiculo> {
    return this.apiService.put<TipoVehiculo>(`${this.endpoint}/${id}`, TipoVehiculo);
  }

  /**
   * Elimina una categoría
   */
  deleteTipoVehiculo(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene una categoría por nombre
   */
  getTipoVehiculoByNombre(nombre: string): Observable<TipoVehiculo> {
    return this.apiService.get<TipoVehiculo>(`${this.endpoint}/nombre/${nombre}`);
  }
}
