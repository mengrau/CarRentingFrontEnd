import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { VehiculoService } from '../../../core/services/vehiculo.service';
import { Vehiculo } from '../../../shared/models/vehiculo.model';

@Component({
  selector: 'app-vehiculo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculo-list.component.html',
  styleUrls: ['./vehiculo-list.component.scss'],
})
export class VehiculoListComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  vehiculosFiltrados: Vehiculo[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  // Modal properties
  showCreateModal = false;
  showEditModal = false;
  editingVehiculo: Vehiculo | null = null;

  vehiculoFormCreate = {
    marca: '',
    modelo: '',
    tipo_id: '',
    placa: '',
    disponible: true,
    id_usuario_creacion: '',
  };

  vehiculoFormEdit = {
    marca: '',
    modelo: '',
    tipo_id: '',
    placa: '',
    disponible: true,
    id_usuario_edicion: '',
  };

  filters = {
    id: '',
    disponible: '',
  };

  constructor(private vehiculoService: VehiculoService) {}

  ngOnInit(): void {
    this.loadVehiculos();
  }

  loadVehiculos(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    const filtersToSend = {
      id: this.filters.id,
      disponible: this.filters.disponible === '' ? undefined : this.filters.disponible === 'true',
    };

    this.vehiculoService.getVehiculos(pagination, filtersToSend).subscribe({
      next: (vehiculos) => {
        this.vehiculos = vehiculos;
        this.vehiculosFiltrados = [...vehiculos];
        this.totalPages = Math.ceil(vehiculos.length / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar vehículos:', error);
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    const idFilter = this.filters.id.toLowerCase();
    const disponibleFilter = this.filters.disponible;

    this.vehiculosFiltrados = this.vehiculos.filter((v) => {
      const matchId = v.id.toLowerCase().includes(idFilter);
      const matchDisponible =
        disponibleFilter === ''
          ? true
          : disponibleFilter === 'true'
          ? v.disponible
          : !v.disponible;
      return matchId && matchDisponible;
    });
  }

  clearFilters(): void {
    this.filters = { id: '', disponible: '' };
    this.vehiculosFiltrados = [...this.vehiculos];
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadVehiculos();
    }
  }

  openCreateModal(): void {
    this.editingVehiculo = null;
    this.vehiculoFormCreate = {
      marca: '',
      modelo: '',
      tipo_id: '',
      placa: '',
      disponible: true,
      id_usuario_creacion: localStorage.getItem('user_id') ?? '',
    };
    this.showCreateModal = true;
  }

  openEditModal(vehiculo: Vehiculo): void {
    this.editingVehiculo = vehiculo;
    this.vehiculoFormEdit = {
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      tipo_id: vehiculo.tipo_id,
      placa: vehiculo.placa,
      disponible: vehiculo.disponible,
      id_usuario_edicion: localStorage.getItem('user_id') ?? '',
    };
    this.showEditModal = true;
  }

  closeModalCreate(): void {
    this.showCreateModal = false;
    this.editingVehiculo = null;
    this.vehiculoFormCreate = {
      marca: '',
      modelo: '',
      tipo_id: '',
      placa: '',
      disponible: true,
      id_usuario_creacion: '',
    };
  }

  closeModalEdit(): void {
    this.showEditModal = false;
    this.editingVehiculo = null;
    this.vehiculoFormEdit = {
      marca: '',
      modelo: '',
      tipo_id: '',
      placa: '',
      disponible: true,
      id_usuario_edicion: '',
    };
  }

  createVehiculo(): void {
    if (!this.vehiculoFormCreate.marca.trim() || !this.vehiculoFormCreate.modelo.trim()) {
      alert('Marca y modelo son requeridos');
      return;
    }

    const newVehiculo = {
      marca: this.vehiculoFormCreate.marca,
      modelo: this.vehiculoFormCreate.modelo,
      tipo_id: this.vehiculoFormCreate.tipo_id,
      placa: this.vehiculoFormCreate.placa,
      disponible: this.vehiculoFormCreate.disponible,
      id_usuario_creacion: this.vehiculoFormCreate.id_usuario_creacion,
    };

    this.vehiculoService.createVehiculo(newVehiculo).subscribe({
      next: () => {
        this.loadVehiculos();
        this.closeModalCreate();
      },
      error: (error) => {
        console.error('Error al crear vehículo:', error);
        alert('Error al crear el vehículo');
      },
    });
  }

  updateVehiculo(): void {
    if (!this.editingVehiculo) {
      alert('No hay vehículo seleccionado para editar');
      return;
    }

    const updateData = {
      marca: this.vehiculoFormEdit.marca,
      modelo: this.vehiculoFormEdit.modelo,
      tipo_id: this.vehiculoFormEdit.tipo_id,
      placa: this.vehiculoFormEdit.placa,
      disponible: this.vehiculoFormEdit.disponible,
      id_usuario_edicion: this.vehiculoFormEdit.id_usuario_edicion,
    };

    console.log('Payload que vamos a enviar (update):', updateData);

    this.vehiculoService.updateVehiculo(this.editingVehiculo.id, updateData).subscribe({
      next: () => {
        this.loadVehiculos();
        this.closeModalEdit();
      },
      error: (error) => {
        console.error('Error al actualizar vehículo:', error);
        alert('Error al actualizar el vehículo');
      },
    });
  }

  deleteVehiculo(vehiculo: Vehiculo): void {
    if (confirm(`¿Está seguro de eliminar el vehículo con placa "${vehiculo.placa}"?`)) {
      this.vehiculoService.deleteVehiculo(vehiculo.id).subscribe({
        next: () => {
          this.loadVehiculos();
        },
        error: (error) => {
          console.error('Error al eliminar vehículo:', error);
        },
      });
    }
  }
}
