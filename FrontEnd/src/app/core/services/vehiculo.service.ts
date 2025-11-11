import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Vehiculo,
  VehiculoFilters,
  CreateVehiculoRequest,
  UpdateVehiculoRequest,
} from '../../shared/models/vehiculo.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private readonly endpoint = '/Vehiculos';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todas las categorías con paginación
   */
  getVehiculos(pagination: PaginationParams, filters?: VehiculoFilters): Observable<Vehiculo[]> {
    return this.apiService.getPaginated<Vehiculo>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una categoría por ID
   */
  getVehiculoById(id: string): Observable<Vehiculo> {
    return this.apiService.get<Vehiculo>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva categoría
   */
  createVehiculo(Vehiculo: CreateVehiculoRequest): Observable<Vehiculo> {
    return this.apiService.post<Vehiculo>(this.endpoint, Vehiculo);
  }

  /**
   * Actualiza una categoría existente
   */
  updateVehiculo(id: string, Vehiculo: UpdateVehiculoRequest): Observable<Vehiculo> {
    return this.apiService.put<Vehiculo>(`${this.endpoint}/${id}`, Vehiculo);
  }

  /**
   * Elimina una categoría
   */
  deleteVehiculo(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene una categoría por nombre
   */
  getVehiculoByNombre(nombre: string): Observable<Vehiculo> {
    return this.apiService.get<Vehiculo>(`${this.endpoint}/nombre/${nombre}`);
  }
}
