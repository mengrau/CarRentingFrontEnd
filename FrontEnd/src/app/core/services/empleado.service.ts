import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateEmpleadoRequest,
  Empleado,
  EmpleadoFilters,
  UpdateEmpleadoRequest,
} from '../../shared/models/empleado.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private readonly endpoint = '/Empleados';

  constructor(private apiService: ApiService) {}

  getEmpleados(pagination: PaginationParams, filters?: EmpleadoFilters): Observable<Empleado[]> {
    return this.apiService.getPaginated<Empleado>(this.endpoint, pagination, filters);
  }

  getEmpleadoById(id: string): Observable<Empleado> {
    return this.apiService.get<Empleado>(`${this.endpoint}/${id}`);
  }

  createEmpleado(Empleado: CreateEmpleadoRequest): Observable<Empleado> {
    return this.apiService.post<Empleado>(this.endpoint, Empleado);
  }

  updateEmpleado(id: string, Empleado: UpdateEmpleadoRequest): Observable<Empleado> {
    return this.apiService.put<Empleado>(`${this.endpoint}/${id}`, Empleado);
  }

  deleteEmpleado(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  getEmpleadoByNombre(nombre: string): Observable<Empleado> {
    return this.apiService.get<Empleado>(`${this.endpoint}/nombre/${nombre}`);
  }
}
