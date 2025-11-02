import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Realiza una petición GET
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params: httpParams });
  }

  /**
   * Realiza una petición GET para obtener datos paginados
   */
  getPaginated<T>(endpoint: string, pagination: PaginationParams, filters?: any): Observable<T[]> {
    let httpParams = new HttpParams();

    // calcular skip correctamente:
    const page = pagination.page ?? 1; // por defecto 1 si viene undefined
    const limit = pagination.limit ?? 10; // por defecto 10
    // asume que page es 1-based. Si en tu app page es 0-based, usa page * limit
    const skip = Math.max(0, page - 1) * limit;

    httpParams = httpParams.set('skip', skip.toString());
    httpParams = httpParams.set('limit', limit.toString());

    if (pagination.sort) {
      httpParams = httpParams.set('sort', pagination.sort);
    }

    if (pagination.order) {
      httpParams = httpParams.set('order', pagination.order);
    }

    // Agregar filtros
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined) {
          httpParams = httpParams.set(key, filters[key].toString());
        }
      });
    }

    return this.http.get<T[]>(`${this.baseUrl}${endpoint}`, { params: httpParams });
  }

  /**
   * Realiza una petición POST
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    console.log('ApiService: Realizando POST a:', `${this.baseUrl}${endpoint}`);
    console.log('ApiService: Datos enviados:', data);
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Realiza una petición PUT
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Realiza una petición PATCH
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Realiza una petición DELETE
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
