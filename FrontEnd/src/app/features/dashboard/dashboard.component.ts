import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { VehiculoService } from '../../core/services/vehiculo.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  clientes = 0;
  vehiculos = 0;
  contratos = 0;
  disponibles = 0;
  noDisponibles = 0;

  private barChart: Chart | null = null;
  private pieChart: Chart | null = null;

  @ViewChild('barCanvas', { static: false }) barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas', { static: false }) pieCanvas!: ElementRef<HTMLCanvasElement>;

  // flags para coordinar datos + vista
  private resumenLoaded = false;
  private vehiculosLoaded = false;
  private viewInitialized = false;

  loadingResumen = false;
  loadingVehiculos = false;

  constructor(
    private dashboardService: DashboardService,
    private vehiculoService: VehiculoService
  ) {}

  ngOnInit(): void {
    this.cargarDatosDashboard();
    this.cargarDisponibilidadVehiculos();
  }

  ngAfterViewInit(): void {
    // La vista (y los canvas) ya existen
    this.viewInitialized = true;

    // Si los datos ya llegaron antes del AfterViewInit, crear los charts ahora
    if (this.resumenLoaded) this.crearGraficoBarras();
    if (this.vehiculosLoaded) this.crearGraficoCircular();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private destroyCharts(): void {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }
  }

  cargarDatosDashboard(): void {
    this.loadingResumen = true;
    this.dashboardService.getResumen().subscribe({
      next: (data) => {
        this.clientes = data.clientes ?? 0;
        this.vehiculos = data.vehiculos ?? 0;
        this.contratos = data.contratos ?? 0;

        this.resumenLoaded = true;
        this.loadingResumen = false;

        // crear gráfico solo si el canvas ya existe
        if (this.viewInitialized) {
          this.crearGraficoBarras();
        }
      },
      error: (err) => {
        console.error('Error al cargar el dashboard:', err);
        this.loadingResumen = false;
      },
    });
  }

  cargarDisponibilidadVehiculos(): void {
    this.loadingVehiculos = true;
    const pagination = { page: 1, limit: 1000 };

    this.vehiculoService.getVehiculos(pagination).subscribe({
      next: (vehiculos) => {
        this.disponibles = vehiculos.filter((v) => v.disponible).length;
        this.noDisponibles = vehiculos.filter((v) => !v.disponible).length;

        this.vehiculosLoaded = true;
        this.loadingVehiculos = false;

        if (this.viewInitialized) {
          this.crearGraficoCircular();
        }
      },
      error: (error) => {
        console.error('Error al cargar vehículos:', error);
        this.loadingVehiculos = false;
      },
    });
  }

  private formatNumber(value: number | string): string {
    const num = Number(value ?? 0);
    return num.toLocaleString();
  }

  crearGraficoBarras(): void {
    // defensivo: asegúrate que el canvas exista y que tengamos datos
    if (!this.barCanvas || !this.resumenLoaded) return;

    // destruir si ya existe
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }

    const canvas = this.barCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Clientes', 'Vehículos', 'Contratos'],
        datasets: [
          {
            label: 'Totales',
            data: [this.clientes, this.vehiculos, this.contratos],
            backgroundColor: [
              'rgba(66,165,245,0.85)',
              'rgba(102,187,106,0.85)',
              'rgba(255,167,38,0.85)',
            ],
            borderColor: [
              'rgba(66,165,245,1)',
              'rgba(102,187,106,1)',
              'rgba(255,167,38,1)',
            ],
            borderWidth: 1,
            borderRadius: 6,
            barThickness: 36,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 8,
            },
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const v = context.parsed?.y ?? context.parsed ?? 0;
                return `${context.dataset.label ?? ''}: ${this.formatNumber(v)}`;
              },
            },
          },
          title: {
            display: true,
            text: 'Resumen general',
            padding: { top: 6, bottom: 10 },
            font: { size: 16 }, // sin weight problemático
          },
        },
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: any) => this.formatNumber(value),
            },
            title: {
              display: true,
              text: 'Cantidad',
            },
            grid: {
              color: 'rgba(0,0,0,0.05)',
            },
          },
        },
      },
    });
  }

  crearGraficoCircular(): void {
    if (!this.pieCanvas || !this.vehiculosLoaded) return;

    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }

    const canvas = this.pieCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Disponibles', 'No disponibles'],
        datasets: [
          {
            label: 'Disponibilidad',
            data: [this.disponibles, this.noDisponibles],
            backgroundColor: ['#4CAF50', '#E53935'],
            hoverOffset: 8,
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 12,
            },
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const v = context.parsed ?? 0;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0) || 1;
                const percent = ((v / total) * 100).toFixed(1);
                return `${context.label}: ${this.formatNumber(v)} (${percent}%)`;
              },
            },
          },
          title: {
            display: true,
            text: 'Disponibilidad de vehículos',
            padding: { top: 6, bottom: 10 },
            font: { size: 16 },
          },
        },
      },
    });
  }
}
