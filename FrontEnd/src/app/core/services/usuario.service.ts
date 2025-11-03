import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Usuario,
  UsuarioFilters,
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
} from '../../shared/models/usuario.models';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly endpoint = '/Usuarios';

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene todas las categorías con paginación
   */
  getUsuarios(pagination: PaginationParams, filters?: UsuarioFilters): Observable<Usuario[]> {
    return this.apiService.getPaginated<Usuario>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una categoría por ID
   */
  getUsuarioById(id: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva categoría
   */
  createUsuario(Usuario: CreateUsuarioRequest): Observable<Usuario> {
    return this.apiService.post<Usuario>(this.endpoint, Usuario);
  }

  /**
   * Actualiza una categoría existente
   */
  updateUsuario(id: string, Usuario: UpdateUsuarioRequest): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, Usuario);
  }

  /**
   * Elimina una categoría
   */
  deleteUsuario(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene una categoría por nombre
   */
  getUsuarioByNombre(username: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/nombre/${username}`);
  }
}