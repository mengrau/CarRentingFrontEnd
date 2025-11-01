import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente, ClienteFilters } from '../../../shared/models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss'] // 👈 plural y entre corchetes
  
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  
  filters: ClienteFilters = {};
  
  // Modal properties
  showModal = false;
  editingCliente: Cliente | null = null;
  clienteForm = {
    nombre: '',
    email: '',
    activo: true
  };

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.clienteService.getClientes(pagination, this.filters).subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        // Since backend doesn't provide pagination info, we'll set a default
        this.totalPages = Math.ceil(clientes.length / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        // Si el backend no está disponible, usar datos mock
        if (error.status === 0 || error.status === undefined) {
          console.log('Backend no disponible, usando datos mock para categorías');
          this.clientes = [{
            id_cliente: '1',
            id: '1',
            nombre: 'Tecnología',
            email: 'Categoría para productos tecnológicos',
            activo: true,
            fecha_creacion: new Date().toISOString(),
            fecha_edicion: new Date().toISOString()
          }];
          this.totalPages = 1;
        }
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadClientes();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadClientes();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadClientes();
    }
  }

  openCreateModal(): void {
    this.editingCliente = null;
    this.clienteForm = {
      nombre: '',
      email: '',
      activo: true
    };
    this.showModal = true;
  }

  editCliente(cliente: Cliente): void {
    this.editingCliente = cliente;
    this.clienteForm = {
      nombre: cliente.nombre,
      email: cliente.email || '',
      activo: cliente.activo
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCliente = null;
    this.clienteForm = {
      nombre: '',
      email: '',
      activo: true
    };
  }

  saveCliente(): void {
    if (!this.clienteForm.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (this.editingCliente) {
      // Actualizar categoría existente
      const updateData = {
        nombre: this.clienteForm.nombre,
        email: this.clienteForm.email,
        activo: this.clienteForm.activo
      };
      
      this.clienteService.updateCliente(this.editingCliente.id, updateData).subscribe({
        next: () => {
          this.loadClientes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar categoría:', error);
          alert('Error al actualizar la categoría');
        }
      });
    } else {
      // Crear nueva categoría
      const newCliente = {
        nombre: this.clienteForm.nombre,
        email: this.clienteForm.email,
        activo: this.clienteForm.activo
      };
      
      this.clienteService.createCliente(newCliente).subscribe({
        next: () => {
          this.loadClientes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          alert('Error al crear la categoría');
        }
      });
    }
  }

  deleteCliente(cliente: Cliente): void {
    if (confirm(`¿Está seguro de eliminar el cliente "${cliente.nombre}"?`)) {
      this.clienteService.deleteCliente(cliente.id).subscribe({
        next: () => {
          this.loadClientes();
        },
        error: (error) => {
          console.error('Error al eliminar el cliente:', error);
        }
      });
    }
  }
}
