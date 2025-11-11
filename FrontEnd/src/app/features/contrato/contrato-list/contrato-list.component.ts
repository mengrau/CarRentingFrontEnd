import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ContratoService } from '../../../core/services/contrato.service';
import { Contrato } from '../../../shared/models/contrato.model';

@Component({
  selector: 'app-contrato-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contrato-list.component.html',
  styleUrls: ['./contrato-list.component.scss'],
})
export class ContratoListComponent implements OnInit {
  contratos: Contrato[] = [];
  contratosFiltrados: Contrato[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  // Modal properties
  showCreateModal = false;
  showEditModal = false;
  editingContrato: Contrato | null = null;

  // Formularios de creación y edición
  contratoFormCreate = {
    cliente_id: '',
    vehiculo_id: '',
    empleado_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    activo: true,
    id_usuario_creacion: '',
  };

  contratoFormEdit = {
    cliente_id: '',
    vehiculo_id: '',
    empleado_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    activo: true,
    id_usuario_edicion: '',
  };

  filters = {
    id: '',
    activo: '',
  };

  constructor(private contratoService: ContratoService) {}

  ngOnInit(): void {
    this.loadContratos();
  }

  loadContratos(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    const filtersToSend = {
      id: this.filters.id,
      activo: this.filters.activo === '' ? undefined : this.filters.activo === 'true',
    };

    this.contratoService.getContratos(pagination, filtersToSend).subscribe({
      next: (contratos) => {
        this.contratos = contratos;
        this.contratosFiltrados = [...contratos];
        this.totalPages = Math.ceil(contratos.length / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar contratos:', error);
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    const idFilter = this.filters.id.toLowerCase();
    const activoFilter = this.filters.activo;

    this.contratosFiltrados = this.contratos.filter((c) => {
      const matchId = c.id.toLowerCase().includes(idFilter);
      const matchActivo = activoFilter === '' ? true : activoFilter === 'true' ? c.activo : !c.activo;
      return matchId && matchActivo;
    });
  }

  clearFilters() {
    this.filters = { id: '', activo: '' };
    this.contratosFiltrados = [...this.contratos];
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadContratos();
    }
  }

  openCreateModal(): void {
    this.editingContrato = null;
    this.contratoFormCreate = {
      cliente_id: '',
      vehiculo_id: '',
      empleado_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      activo: true,
      id_usuario_creacion: localStorage.getItem('user_id') ?? '',
    };
    this.showCreateModal = true;
  }

  openEditModal(contrato: Contrato): void {
    this.editingContrato = contrato;
    this.contratoFormEdit = {
      cliente_id: contrato.cliente_id,
      vehiculo_id: contrato.vehiculo_id,
      empleado_id: contrato.empleado_id,
      fecha_inicio: contrato.fecha_inicio,
      fecha_fin: contrato.fecha_fin ?? '',
      activo: contrato.activo,
      id_usuario_edicion: localStorage.getItem('user_id') ?? '',
    };
    this.showEditModal = true;
  }

  closeModalCreate(): void {
    this.showCreateModal = false;
    this.editingContrato = null;
    this.contratoFormCreate = {
      cliente_id: '',
      vehiculo_id: '',
      empleado_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      activo: true,
      id_usuario_creacion: '',
    };
  }

  closeModalEdit(): void {
    this.showEditModal = false;
    this.editingContrato = null;
    this.contratoFormEdit = {
      cliente_id: '',
      vehiculo_id: '',
      empleado_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      activo: true,
      id_usuario_edicion: '',
    };
  }

  // Crear nuevo contrato
  createContrato(): void {
    if (
      !this.contratoFormCreate.cliente_id ||
      !this.contratoFormCreate.vehiculo_id ||
      !this.contratoFormCreate.empleado_id ||
      !this.contratoFormCreate.fecha_inicio
    ) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    const newContrato = {
      cliente_id: this.contratoFormCreate.cliente_id,
      vehiculo_id: this.contratoFormCreate.vehiculo_id,
      empleado_id: this.contratoFormCreate.empleado_id,
      fecha_inicio: this.contratoFormCreate.fecha_inicio,
      fecha_fin: this.contratoFormCreate.fecha_fin,
      activo: this.contratoFormCreate.activo,
      id_usuario_creacion: this.contratoFormCreate.id_usuario_creacion,
    };

    this.contratoService.createContrato(newContrato).subscribe({
      next: () => {
        this.loadContratos();
        this.closeModalCreate();
      },
      error: (error) => {
        console.error('Error al crear contrato:', error);
        alert('Error al crear el contrato');
      },
    });
  }

  // Actualizar contrato existente
  updateContrato(): void {
    if (!this.editingContrato) {
      alert('No hay contrato seleccionado para editar');
      return;
    }

    const updateData = {
      cliente_id: this.contratoFormEdit.cliente_id,
      vehiculo_id: this.contratoFormEdit.vehiculo_id,
      empleado_id: this.contratoFormEdit.empleado_id,
      fecha_inicio: this.contratoFormEdit.fecha_inicio,
      fecha_fin: this.contratoFormEdit.fecha_fin,
      activo: this.contratoFormEdit.activo,
      id_usuario_edicion: this.contratoFormEdit.id_usuario_edicion,
    };

    console.log('Payload que vamos a enviar (update):', updateData);

    this.contratoService.updateContrato(this.editingContrato.id, updateData).subscribe({
      next: () => {
        this.loadContratos();
        this.closeModalEdit();
      },
      error: (error) => {
        console.error('Error al actualizar contrato:', error);
        alert('Error al actualizar el contrato');
      },
    });
  }

  deleteContrato(contrato: Contrato): void {
    if (confirm(`¿Está seguro de eliminar el contrato con ID "${contrato.id}"?`)) {
      this.contratoService.deleteContrato(contrato.id).subscribe({
        next: () => {
          this.loadContratos();
        },
        error: (error) => {
          console.error('Error al eliminar el contrato:', error);
        },
      });
    }
  }
}
