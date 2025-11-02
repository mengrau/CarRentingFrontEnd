import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Empleado,
  EmpleadoFilters,
  CreateEmpleadoRequest,
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

  /**
   * Obtiene todas las categorías con paginación
   */
  getEmpleados(pagination: PaginationParams, filters?: EmpleadoFilters): Observable<Empleado[]> {
    return this.apiService.getPaginated<Empleado>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una categoría por ID
   */
  getEmpleadoById(id: string): Observable<Empleado> {
    return this.apiService.get<Empleado>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva categoría
   */
  createEmpleado(Empleado: CreateEmpleadoRequest): Observable<Empleado> {
    return this.apiService.post<Empleado>(this.endpoint, Empleado);
  }

  /**
   * Actualiza una categoría existente
   */
  updateEmpleado(id: string, Empleado: UpdateEmpleadoRequest): Observable<Empleado> {
    return this.apiService.put<Empleado>(`${this.endpoint}/${id}`, Empleado);
  }

  /**
   * Elimina una categoría
   */
  deleteEmpleado(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene una categoría por nombre
   */
  getEmpleadoByNombre(nombre: string): Observable<Empleado> {
    return this.apiService.get<Empleado>(`${this.endpoint}/nombre/${nombre}`);
  }
}
