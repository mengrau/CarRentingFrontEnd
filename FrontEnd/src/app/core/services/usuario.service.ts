import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
  Usuario,
  UsuarioFilters,
} from '../../shared/models/usuario.models';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly endpoint = '/Usuarios';

  constructor(private apiService: ApiService) {}

  getUsuarios(pagination: PaginationParams, filters?: UsuarioFilters): Observable<Usuario[]> {
    return this.apiService.getPaginated<Usuario>(this.endpoint, pagination, filters);
  }

  getUsuarioById(id: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id}`);
  }

  createUsuario(Usuario: CreateUsuarioRequest): Observable<Usuario> {
    return this.apiService.post<Usuario>(this.endpoint, Usuario);
  }

  updateUsuario(id: string, Usuario: UpdateUsuarioRequest): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, Usuario);
  }

  deleteUsuario(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  getUsuarioByNombre(username: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/nombre/${username}`);
  }
}
