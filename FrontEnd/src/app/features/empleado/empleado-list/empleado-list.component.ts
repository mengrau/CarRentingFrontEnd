import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { EmpleadoService } from '../../../core/services/empleado.service';
import { Empleado } from '../../../shared/models/empleado.model';

@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleado-list.component.html',
  styleUrls: ['./empleado-list.component.scss'],
})
export class EmpleadoListComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  // Modal properties
  showCreateModal = false;
  showEditModal = false;
  editingEmpleado: Empleado | null = null;

  // Formularios de creación y edición (campos de Empleado)
  empleadoFormCreate = {
    nombre: '',
    email: '',
    rol: '',
    activo: true,
    id_usuario_creacion: '',
  };

  empleadoFormEdit = {
    nombre: '',
    email: '',
    rol: '',
    activo: true,
    id_usuario_edicion: '',
  };

  // filtros por nombre y activo (no por id)
  filters = {
    nombre: '',
    activo: '',
  };

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.loadEmpleados();
  }

  loadEmpleados(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    // Conversión del filtro (nombre + activo)
    const filtersToSend = {
      nombre: this.filters.nombre,
      activo: this.filters.activo === '' ? undefined : this.filters.activo === 'true',
    };

    this.empleadoService.getEmpleados(pagination, filtersToSend).subscribe({
      next: (empleados) => {
        this.empleados = empleados;
        this.empleadosFiltrados = [...empleados];
        this.totalPages = Math.ceil(empleados.length / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    const query = (this.filters.nombre ?? '').toLowerCase().trim();
    const activo = this.filters.activo;

    this.empleadosFiltrados = this.empleados.filter((e) => {
      const nombre = (e.nombre ?? '').toLowerCase();
      const matchNombre = query === '' ? true : nombre.includes(query);
      const matchActivo = activo === '' ? true : activo === 'true' ? e.activo : !e.activo;
      return matchNombre && matchActivo;
    });
  }

  clearFilters() {
    this.filters = { nombre: '', activo: '' };
    this.empleadosFiltrados = [...this.empleados];
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadEmpleados();
    }
  }

  openCreateModal(): void {
    this.editingEmpleado = null;
    this.empleadoFormCreate = {
      nombre: '',
      email: '',
      rol: '',
      activo: true,
      id_usuario_creacion: localStorage.getItem('user_id') ?? '',
    };
    this.showCreateModal = true;
  }

  openEditModal(empleado: Empleado): void {
    this.editingEmpleado = empleado;
    this.empleadoFormEdit = {
      nombre: empleado.nombre,
      email: empleado.email,
      rol: empleado.rol,
      activo: empleado.activo,
      id_usuario_edicion: localStorage.getItem('user_id') ?? '',
    };
    this.showEditModal = true;
  }

  closeModalCreate(): void {
    this.showCreateModal = false;
    this.editingEmpleado = null;
    this.empleadoFormCreate = {
      nombre: '',
      email: '',
      rol: '',
      activo: true,
      id_usuario_creacion: '',
    };
  }

  closeModalEdit(): void {
    this.showEditModal = false;
    this.editingEmpleado = null;
    this.empleadoFormEdit = {
      nombre: '',
      email: '',
      rol: '',
      activo: true,
      id_usuario_edicion: '',
    };
  }

  // Crear nuevo empleado
  createEmpleado(): void {
    // validación simple: nombre requerido
    if (!this.empleadoFormCreate.nombre || !this.empleadoFormCreate.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    const newEmpleado = {
      nombre: this.empleadoFormCreate.nombre,
      email: this.empleadoFormCreate.email,
      rol: this.empleadoFormCreate.rol,
      activo: this.empleadoFormCreate.activo,
      id_usuario_creacion: this.empleadoFormCreate.id_usuario_creacion,
    };

    this.empleadoService.createEmpleado(newEmpleado).subscribe({
      next: () => {
        this.loadEmpleados();
        this.closeModalCreate();
      },
      error: (error) => {
        console.error('Error al crear empleado:', error);
        alert('Error al crear el empleado');
      },
    });
  }

  // Actualizar empleado existente
  updateEmpleado(): void {
    if (!this.editingEmpleado) {
      alert('No hay empleado seleccionado para editar');
      return;
    }

    // validación simple: nombre requerido
    if (!this.empleadoFormEdit.nombre || !this.empleadoFormEdit.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    const updateData = {
      nombre: this.empleadoFormEdit.nombre,
      email: this.empleadoFormEdit.email,
      rol: this.empleadoFormEdit.rol,
      activo: this.empleadoFormEdit.activo,
      id_usuario_edicion: this.empleadoFormEdit.id_usuario_edicion,
    };

    console.log('Payload que vamos a enviar (update):', updateData);

    this.empleadoService.updateEmpleado(this.editingEmpleado.id, updateData).subscribe({
      next: () => {
        this.loadEmpleados();
        this.closeModalEdit();
      },
      error: (error) => {
        console.error('Error al actualizar empleado:', error);
        alert('Error al actualizar el empleado');
      },
    });
  }

  deleteEmpleado(empleado: Empleado): void {
    if (confirm(`¿Está seguro de eliminar el empleado "${empleado.nombre}"?`)) {
      this.empleadoService.deleteEmpleado(empleado.id).subscribe({
        next: () => {
          this.loadEmpleados();
        },
        error: (error) => {
          console.error('Error al eliminar el empleado:', error);
        },
      });
    }
  }
}
