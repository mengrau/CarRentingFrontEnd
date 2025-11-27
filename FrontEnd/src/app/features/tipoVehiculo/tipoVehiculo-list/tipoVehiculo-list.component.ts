import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { TipoVehiculoService } from '../../../core/services/tipoVehiculo.service';
import { TipoVehiculo } from '../../../shared/models/tipoVehiculo.model';

@Component({
  selector: 'app-tipoVehiculo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipoVehiculo-list.component.html',
  styleUrls: ['./tipoVehiculo-list.component.scss'],
})
export class TipoVehiculoListComponent implements OnInit {
  tipoVehiculos: TipoVehiculo[] = [];
  tipoVehiculosFiltrados: TipoVehiculo[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  showCreateModal = false;
  showEditModal = false;
  editingTipoVehiculo: TipoVehiculo | null = null;

  tipoVehiculoFormCreate = {
    nombre: '',
    descripcion: '',
    activo: true,
    id_usuario_creacion: '',
  };

  tipoVehiculoFormEdit = {
    nombre: '',
    descripcion: '',
    activo: true,
    id_usuario_edicion: '',
  };

  filters = {
    nombre: '',
    activo: '',
  };

  constructor(private tipoVehiculoService: TipoVehiculoService) {}

  ngOnInit(): void {
    this.loadTipoVehiculos();
  }

  loadTipoVehiculos(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    const filtersToSend = {
      nombre: this.filters.nombre,
      activo: this.filters.activo === '' ? undefined : this.filters.activo === 'true',
    };

    this.tipoVehiculoService.getTipoVehiculos(pagination, filtersToSend).subscribe({
      next: (tipoVehiculos) => {
        console.log('Respuesta getTipoVehiculos:', tipoVehiculos);
        this.tipoVehiculos = tipoVehiculos;
        this.tipoVehiculosFiltrados = [...tipoVehiculos];
        this.totalPages = Math.ceil(tipoVehiculos.length / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar tipos de vehículo:', error);
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    const nombre = this.filters.nombre.toLowerCase();
    const activo = this.filters.activo;

    this.tipoVehiculosFiltrados = this.tipoVehiculos.filter((t) => {
      const matchNombre = (t as any).nombre.toLowerCase().includes(nombre);
      const matchActivo =
        activo === '' ? true : activo === 'true' ? (t as any).activo : !(t as any).activo;
      return matchNombre && matchActivo;
    });
  }

  clearFilters() {
    this.filters = { nombre: '', activo: '' };
    this.tipoVehiculosFiltrados = [...this.tipoVehiculos];
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTipoVehiculos();
    }
  }

  openCreateModal(): void {
    this.editingTipoVehiculo = null;
    this.tipoVehiculoFormCreate = {
      nombre: '',
      descripcion: '',
      activo: true,
      id_usuario_creacion: localStorage.getItem('user_id') ?? '',
    };
    this.showCreateModal = true;
  }

  openEditModal(tipoVehiculo: TipoVehiculo): void {
    this.editingTipoVehiculo = tipoVehiculo;
    this.tipoVehiculoFormEdit = {
      nombre: (tipoVehiculo as any).nombre ?? '',
      descripcion: (tipoVehiculo as any).descripcion ?? '',
      activo: (tipoVehiculo as any).activo ?? true,
      id_usuario_edicion: localStorage.getItem('user_id') ?? '',
    };
    this.showEditModal = true;
  }

  closeModalCreate(): void {
    this.showCreateModal = false;
    this.editingTipoVehiculo = null;
    this.tipoVehiculoFormCreate = {
      nombre: '',
      descripcion: '',
      activo: true,
      id_usuario_creacion: '',
    };
  }

  closeModalEdit(): void {
    this.showEditModal = false;
    this.editingTipoVehiculo = null;
    this.tipoVehiculoFormEdit = {
      nombre: '',
      descripcion: '',
      activo: true,
      id_usuario_edicion: '',
    };
  }

  createTipoVehiculo(): void {
    if (!this.tipoVehiculoFormCreate.nombre) {
      alert('Por favor complete los campos obligatorios (nombre)');
      return;
    }

    const newTipoVehiculo: any = {
      nombre: this.tipoVehiculoFormCreate.nombre,
      descripcion: this.tipoVehiculoFormCreate.descripcion,
      activo: this.tipoVehiculoFormCreate.activo,
      id_usuario_creacion: this.tipoVehiculoFormCreate.id_usuario_creacion,
    };

    this.tipoVehiculoService.createTipoVehiculo(newTipoVehiculo).subscribe({
      next: () => {
        this.loadTipoVehiculos();
        this.closeModalCreate();
      },
      error: (error) => {
        console.error('Error al crear tipoVehiculo:', error);
        alert('Error al crear el tipo de vehículo');
      },
    });
  }

  updateTipoVehiculo(): void {
    if (!this.editingTipoVehiculo) {
      alert('No hay tipo de vehículo seleccionado para editar');
      return;
    }

    if (!this.tipoVehiculoFormEdit.nombre) {
      alert('Por favor complete los campos obligatorios (nombre)');
      return;
    }

    const updateData: any = {
      nombre: this.tipoVehiculoFormEdit.nombre,
      descripcion: this.tipoVehiculoFormEdit.descripcion,
      activo: this.tipoVehiculoFormEdit.activo,
      id_usuario_edicion: this.tipoVehiculoFormEdit.id_usuario_edicion,
    };

    console.log('Payload que vamos a enviar (update):', updateData);

    this.tipoVehiculoService.updateTipoVehiculo(this.editingTipoVehiculo.id, updateData).subscribe({
      next: () => {
        this.loadTipoVehiculos();
        this.closeModalEdit();
      },
      error: (error) => {
        console.error('Error al actualizar tipoVehiculo:', error);
        alert('Error al actualizar el tipo de vehículo');
      },
    });
  }

  deleteTipoVehiculo(tipoVehiculo: TipoVehiculo): void {
    if (confirm(`¿Está seguro de eliminar el tipo de vehículo con ID "${tipoVehiculo.id}"?`)) {
      this.tipoVehiculoService.deleteTipoVehiculo(tipoVehiculo.id).subscribe({
        next: () => {
          this.loadTipoVehiculos();
        },
        error: (error) => {
          console.error('Error al eliminar el tipoVehiculo:', error);
        },
      });
    }
  }
}
