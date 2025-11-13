import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { VehiculoService } from '../../core/services/vehiculo.service';

Chart.register(...registerables); // 👈 Necesario para que funcionen las escalas y tipos

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // 👈 Ya no usamos NgChartsModule
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // --- Datos numéricos ---
  clientes = 0;
  vehiculos = 0;
  contratos = 0;
  disponibles = 0;
  noDisponibles = 0;

  // Referencias para los gráficos
  barChart: any;
  pieChart: any;

  constructor(
    private dashboardService: DashboardService,
    private vehiculoService: VehiculoService
  ) {}

  ngOnInit(): void {
    this.cargarDatosDashboard();
    this.cargarDisponibilidadVehiculos();
  }

  cargarDatosDashboard(): void {
    this.dashboardService.getResumen().subscribe({
      next: (data) => {
        this.clientes = data.clientes;
        this.vehiculos = data.vehiculos;
        this.contratos = data.contratos;
        this.crearGraficoBarras();
      },
      error: (err) => console.error('Error al cargar el dashboard:', err),
    });
  }

  cargarDisponibilidadVehiculos(): void {
    const pagination = { page: 1, limit: 1000 };

    this.vehiculoService.getVehiculos(pagination).subscribe({
      next: (vehiculos) => {
        this.disponibles = vehiculos.filter((v) => v.disponible).length;
        this.noDisponibles = vehiculos.filter((v) => !v.disponible).length;
        this.crearGraficoCircular();
      },
      error: (error) => console.error('Error al cargar vehículos:', error),
    });
  }

  crearGraficoBarras(): void {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    if (this.barChart) this.barChart.destroy();

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Clientes', 'Vehículos', 'Contratos'],
        datasets: [
          {
            label: 'Totales',
            data: [this.clientes, this.vehiculos, this.contratos],
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  crearGraficoCircular(): void {
  const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
  if (this.pieChart) this.pieChart.destroy();

  this.pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Disponibles', 'No disponibles'],
      datasets: [
        {
          data: [this.disponibles, this.noDisponibles],
          backgroundColor: ['#4CAF50', '#E53935'],
          hoverBackgroundColor: ['#66BB6A', '#EF5350'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: 'Vehículos', // 👈 Aquí va el título
          font: {
            size: 18,
            weight: 'bold',
          },
          padding: {
            top: 10,
            bottom: 20,
          },
        },
      },
    },
  });
}

}










