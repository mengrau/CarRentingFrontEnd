import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente, ClienteFilters, CreateClienteRequest, UpdateClienteRequest } from '../../shared/models/cliente.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly endpoint = '/clientes';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todas las categorías con paginación
   */
  getClientes(pagination: PaginationParams, filters?: ClienteFilters): Observable<Cliente[]> {
    return this.apiService.getPaginated<Cliente>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una categoría por ID
   */
  getClienteById(id: string): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva categoría
   */
  createCliente(cliente: CreateClienteRequest): Observable<Cliente> {
    return this.apiService.post<Cliente>(this.endpoint, cliente);
  }

  /**
   * Actualiza una categoría existente
   */
  updateCliente(id: string, cliente: UpdateClienteRequest): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.endpoint}/${id}`, cliente);
  }

  /**
   * Elimina una categoría
   */
  deleteCliente(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene una categoría por nombre
   */
  getClienteByNombre(nombre: string): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.endpoint}/nombre/${nombre}`);
  }
}
