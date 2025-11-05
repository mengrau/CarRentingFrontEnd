import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'http://127.0.0.1:8000/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, { username, password }).pipe(
      tap((res) => {
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
