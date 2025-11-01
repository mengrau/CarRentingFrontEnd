import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'cliente',
    loadComponent: () =>
      import('./features/cliente/cliente-list/cliente-list.component').then(m => m.ClienteListComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
