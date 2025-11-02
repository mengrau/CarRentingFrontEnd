import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'cliente',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cliente/cliente-list/cliente-list.component').then(
        (m) => m.ClienteListComponent,
      ),
  },
  {
    path: 'contrato',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/contrato/contrato-list/contrato-list.component').then(
        (m) => m.ContratoListComponent,
      ),
  },
  {
    path: 'empleado',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/empleado/empleado-list/empleado-list.component').then(
        (m) => m.EmpleadoListComponent,
      ),
  },
  { path: '**', redirectTo: 'login' },
];
