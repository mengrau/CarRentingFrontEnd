import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // opcional: sólo si usas routerLink en el template
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // <-- aquí
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  submit() {
    this.error = null;
    this.loading = true;

    this.auth.login(this.username, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        // Guarda el token en localStorage
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user_id', response.user_id);
        // Redirige al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        // Muestra el error que devuelva el backend
        this.error = err.error?.detail || 'Credenciales inválidas';
      },
    });
  }
}
