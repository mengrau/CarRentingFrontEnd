import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateTipoVehiculoRequest,
  TipoVehiculo,
  TipoVehiculoFilters,
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

  getTipoVehiculos(
    pagination: PaginationParams,
    filters?: TipoVehiculoFilters,
  ): Observable<TipoVehiculo[]> {
    return this.apiService.getPaginated<TipoVehiculo>(this.endpoint, pagination, filters);
  }

  getTipoVehiculoById(id: string): Observable<TipoVehiculo> {
    return this.apiService.get<TipoVehiculo>(`${this.endpoint}/${id}`);
  }

  createTipoVehiculo(TipoVehiculo: CreateTipoVehiculoRequest): Observable<TipoVehiculo> {
    return this.apiService.post<TipoVehiculo>(this.endpoint, TipoVehiculo);
  }

  updateTipoVehiculo(
    id: string,
    TipoVehiculo: UpdateTipoVehiculoRequest,
  ): Observable<TipoVehiculo> {
    return this.apiService.put<TipoVehiculo>(`${this.endpoint}/${id}`, TipoVehiculo);
  }

  deleteTipoVehiculo(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  getTipoVehiculoByNombre(nombre: string): Observable<TipoVehiculo> {
    return this.apiService.get<TipoVehiculo>(`${this.endpoint}/nombre/${nombre}`);
  }
}
