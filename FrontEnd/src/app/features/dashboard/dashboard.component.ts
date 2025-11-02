import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <h1>Dashboard</h1>
      <p>Bienvenido al dashboard. Aquí pondrás gráficos, KPIs y resúmenes.</p>
    </section>
  `,
})
export class DashboardComponent {}
