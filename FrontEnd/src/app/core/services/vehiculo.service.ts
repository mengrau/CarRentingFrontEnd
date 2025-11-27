import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateVehiculoRequest,
  UpdateVehiculoRequest,
  Vehiculo,
  VehiculoFilters,
} from '../../shared/models/vehiculo.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private readonly endpoint = '/Vehiculos';

  constructor(private apiService: ApiService) {}

  getVehiculos(pagination: PaginationParams, filters?: VehiculoFilters): Observable<Vehiculo[]> {
    return this.apiService.getPaginated<Vehiculo>(this.endpoint, pagination, filters);
  }

  getVehiculoById(id: string): Observable<Vehiculo> {
    return this.apiService.get<Vehiculo>(`${this.endpoint}/${id}`);
  }

  createVehiculo(Vehiculo: CreateVehiculoRequest): Observable<Vehiculo> {
    return this.apiService.post<Vehiculo>(this.endpoint, Vehiculo);
  }

  updateVehiculo(id: string, Vehiculo: UpdateVehiculoRequest): Observable<Vehiculo> {
    return this.apiService.put<Vehiculo>(`${this.endpoint}/${id}`, Vehiculo);
  }

  deleteVehiculo(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  getVehiculoByNombre(nombre: string): Observable<Vehiculo> {
    return this.apiService.get<Vehiculo>(`${this.endpoint}/nombre/${nombre}`);
  }
}
