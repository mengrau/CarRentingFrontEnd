import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { PagoService } from '../../../core/services/pago.service';
import { Pago } from '../../../shared/models/pago.model';

@Component({
  selector: 'app-pago-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-list.component.html',
  styleUrls: ['./pago-list.component.scss'],
})
export class PagoListComponent implements OnInit {
  pagos: Pago[] = [];
  pagosFiltrados: Pago[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  showCreateModal = false;
  showEditModal = false;
  editingPago: Pago | null = null;

  pagoFormCreate = {
    contrato_id: '',
    monto: '',
    fecha_pago: '',
    id_usuario_creacion: '',
  };

  pagoFormEdit = {
    monto: '',
    fecha_pago: '',
    id_usuario_edicion: '',
  };

  // Filtros
  filters = {
    id: '',
  };

  constructor(private pagoService: PagoService) {}

  ngOnInit(): void {
    this.loadPagos();
  }

  loadPagos(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    const filtersToSend: any = {
      id: this.filters.id || undefined,
    };

    this.pagoService.getPagos(pagination, filtersToSend).subscribe({
      next: (pagos) => {
        this.pagos = pagos;
        this.pagosFiltrados = [...pagos];
        this.totalPages = Math.ceil(this.pagos.length / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar pagos:', error);
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    const idFilter = this.filters.id.trim().toLowerCase();

    this.pagosFiltrados = this.pagos.filter((p) => {
      const matchId = idFilter ? String(p.id).toLowerCase().includes(idFilter) : true;
      return matchId;
    });

    // ajustar paginación local si corresponde
    this.totalPages = Math.max(1, Math.ceil(this.pagosFiltrados.length / this.pageSize));
    this.currentPage = 1;
  }

  clearFilters() {
    this.filters = { id: '' };
    this.pagosFiltrados = [...this.pagos];
    this.totalPages = Math.max(1, Math.ceil(this.pagosFiltrados.length / this.pageSize));
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPagos();
    }
  }

  openCreateModal(): void {
    this.editingPago = null;
    this.pagoFormCreate = {
      contrato_id: '',
      monto: '',
      fecha_pago: '',
      id_usuario_creacion: localStorage.getItem('user_id') ?? '',
    };
    this.showCreateModal = true;
  }

  openEditModal(pago: Pago): void {
    this.editingPago = pago;
    this.pagoFormEdit = {
      monto: pago.monto !== undefined ? String((pago as any).monto) : '',
      fecha_pago: pago.fecha_pago,
      id_usuario_edicion: localStorage.getItem('user_id') ?? '',
    };
    this.showEditModal = true;
  }

  closeModalCreate(): void {
    this.showCreateModal = false;
    this.editingPago = null;
    this.pagoFormCreate = {
      contrato_id: '',
      monto: '',
      fecha_pago: '',
      id_usuario_creacion: '',
    };
  }

  closeModalEdit(): void {
    this.showEditModal = false;
    this.editingPago = null;
    this.pagoFormEdit = {
      monto: '',
      fecha_pago: '',
      id_usuario_edicion: '',
    };
  }

  // Crear nuevo pago
  createPago(): void {
    if (
      !this.pagoFormCreate.contrato_id ||
      !this.pagoFormCreate.monto ||
      !this.pagoFormCreate.fecha_pago
    ) {
      alert('Por favor complete los campos obligatorios (contrato, monto, fecha)');
      return;
    }

    const newPago: any = {
      contrato_id: this.pagoFormCreate.contrato_id,
      monto: isNaN(Number(this.pagoFormCreate.monto))
        ? this.pagoFormCreate.monto
        : Number(this.pagoFormCreate.monto),
      fecha_pago: this.pagoFormCreate.fecha_pago,
      id_usuario_creacion: this.pagoFormCreate.id_usuario_creacion,
    };

    this.pagoService.createPago(newPago).subscribe({
      next: () => {
        this.loadPagos();
        this.closeModalCreate();
      },
      error: (error) => {
        console.error('Error al crear pago:', error);
        alert('Error al crear el pago');
      },
    });
  }

  // Actualizar pago existente
  updatePago(): void {
    if (!this.editingPago) {
      alert('No hay pago seleccionado para editar');
      return;
    }

    if (!this.pagoFormEdit.monto || !this.pagoFormEdit.fecha_pago) {
      alert('Por favor complete los campos obligatorios (monto, fecha)');
      return;
    }

    const updateData: any = {
      monto: isNaN(Number(this.pagoFormEdit.monto))
        ? this.pagoFormEdit.monto
        : Number(this.pagoFormEdit.monto),
      fecha_pago: this.pagoFormEdit.fecha_pago,
      id_usuario_edicion: this.pagoFormEdit.id_usuario_edicion,
    };

    console.log('Payload que vamos a enviar (update):', updateData);

    this.pagoService.updatePago(this.editingPago.id, updateData).subscribe({
      next: () => {
        this.loadPagos();
        this.closeModalEdit();
      },
      error: (error) => {
        console.error('Error al actualizar pago:', error);
        alert('Error al actualizar el pago');
      },
    });
  }

  deletePago(pago: Pago): void {
    if (confirm(`¿Está seguro de eliminar el pago con ID "${pago.id}"?`)) {
      this.pagoService.deletePago(pago.id).subscribe({
        next: () => {
          this.loadPagos();
        },
        error: (error) => {
          console.error('Error al eliminar el pago:', error);
        },
      });
    }
  }
}
