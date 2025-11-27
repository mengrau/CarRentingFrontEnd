import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Cliente,
  ClienteFilters,
  CreateClienteRequest,
  UpdateClienteRequest,
} from '../../shared/models/cliente.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly endpoint = '/Clientes';

  constructor(private apiService: ApiService) {}

  getClientes(pagination: PaginationParams, filters?: ClienteFilters): Observable<Cliente[]> {
    return this.apiService.getPaginated<Cliente>(this.endpoint, pagination, filters);
  }

  getClienteById(id: string): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.endpoint}/${id}`);
  }

  createCliente(cliente: CreateClienteRequest): Observable<Cliente> {
    return this.apiService.post<Cliente>(this.endpoint, cliente);
  }

  updateCliente(id: string, cliente: UpdateClienteRequest): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.endpoint}/${id}`, cliente);
  }

  deleteCliente(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  getClienteByNombre(nombre: string): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.endpoint}/nombre/${nombre}`);
  }
}
