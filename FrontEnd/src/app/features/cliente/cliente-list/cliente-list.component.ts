import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../shared/models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss'], // 👈 plural y entre corchetes
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  // Modal properties
  showCreateModal = false;
  showEditModal = false;
  editingCliente: Cliente | null = null;
  clienteFormCreate = {
    nombre: '',
    email: '',
    telefono: '',
    activo: true,
    id_usuario_creacion: '',
  };
  clienteFormEdit = {
    nombre: '',
    email: '',
    telefono: '',
    activo: true,
    id_usuario_edicion: '',
  };
  filters = {
    nombre: '',
    activo: '',
  };

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    // 👇 Conversión del filtro
    const filtersToSend = {
      nombre: this.filters.nombre,
      activo: this.filters.activo === '' ? undefined : this.filters.activo === 'true',
    };

    this.clienteService.getClientes(pagination, filtersToSend).subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.clientesFiltrados = [...clientes];
        this.totalPages = Math.ceil(clientes.length / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    const nombre = this.filters.nombre.toLowerCase();
    const activo = this.filters.activo;

    this.clientesFiltrados = this.clientes.filter((c) => {
      const matchNombre = c.nombre.toLowerCase().includes(nombre);
      const matchActivo = activo === '' ? true : activo === 'true' ? c.activo : !c.activo;
      return matchNombre && matchActivo;
    });
  }

  clearFilters() {
    this.filters = { nombre: '', activo: '' };
    this.clientesFiltrados = [...this.clientes];
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadClientes();
    }
  }

  openCreateModal(): void {
    this.editingCliente = null;
    this.clienteFormCreate = {
      nombre: '',
      email: '',
      telefono: '',
      activo: true,
      id_usuario_creacion: localStorage.getItem('user_id') ?? '',
    };
    this.showCreateModal = true;
  }

  openEditModal(cliente: Cliente): void {
    this.editingCliente = cliente;
    this.clienteFormEdit = {
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      activo: cliente.activo,
      id_usuario_edicion: localStorage.getItem('user_id') ?? '',
    };
    this.showEditModal = true;
  }

  closeModalCreate(): void {
    this.showCreateModal = false;
    this.editingCliente = null;
    this.clienteFormCreate = {
      nombre: '',
      email: '',
      telefono: '',
      activo: true,
      id_usuario_creacion: '',
    };
  }

  closeModalEdit(): void {
    this.showEditModal = false;
    this.editingCliente = null;
    this.clienteFormEdit = {
      nombre: '',
      email: '',
      telefono: '',
      activo: true,
      id_usuario_edicion: '',
    };
  }

  // Crear nuevo cliente (antes rama "else" de saveCliente)
  createCliente(): void {
    // validación simple
    if (!this.clienteFormCreate.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    const newCliente = {
      nombre: this.clienteFormCreate.nombre,
      email: this.clienteFormCreate.email,
      telefono: this.clienteFormCreate.telefono,
      activo: this.clienteFormCreate.activo,
      id_usuario_creacion: this.clienteFormCreate.id_usuario_creacion,
    };

    this.clienteService.createCliente(newCliente).subscribe({
      next: () => {
        this.loadClientes();
        this.closeModalCreate();
      },
      error: (error) => {
        console.error('Error al crear cliente:', error);
        alert('Error al crear el cliente');
      },
    });
  }

  // Actualizar cliente existente (antes rama "if" de saveCliente)
  updateCliente(): void {
    if (!this.editingCliente) {
      alert('No hay cliente seleccionado para editar');
      return;
    }

    if (!this.clienteFormEdit.nombre || !this.clienteFormEdit.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    const updateData = {
      nombre: this.clienteFormEdit.nombre,
      email: this.clienteFormEdit.email,
      telefono: this.clienteFormEdit.telefono,
      activo: this.clienteFormEdit.activo,
      id_usuario_edicion: this.clienteFormEdit.id_usuario_edicion,
    };

    console.log('Payload que vamos a enviar (update):', updateData);

    this.clienteService.updateCliente(this.editingCliente.id, updateData).subscribe({
      next: () => {
        this.loadClientes();
        this.closeModalEdit();
      },
      error: (error) => {
        console.error('Error al actualizar cliente:', error);
        alert('Error al actualizar el cliente');
      },
    });
  }

  deleteCliente(cliente: Cliente): void {
    if (confirm(`¿Está seguro de eliminar el cliente "${cliente.nombre}"?`)) {
      this.clienteService.deleteCliente(cliente.id).subscribe({
        next: () => {
          this.loadClientes();
        },
        error: (error) => {
          console.error('Error al eliminar el cliente:', error);
        },
      });
    }
  }
}
