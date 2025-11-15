import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ContratoService } from '../../../core/services/contrato.service';
import { PagoService } from '../../../core/services/pago.service';
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

  pagoFormCreate = {
    monto: '',
    fecha_pago: '',
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

  constructor(
    private contratoService: ContratoService,
    private pagoService: PagoService,
  ) {}

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
      const matchActivo =
        activoFilter === '' ? true : activoFilter === 'true' ? c.activo : !c.activo;
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
    this.pagoFormCreate = {
      monto: '',
      fecha_pago: '',
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

  createContratoWithPago(): void {
    // validaciones contrato + pago
    if (
      !this.contratoFormCreate.cliente_id ||
      !this.contratoFormCreate.vehiculo_id ||
      !this.contratoFormCreate.empleado_id ||
      !this.contratoFormCreate.fecha_inicio
    ) {
      alert('Por favor complete los campos obligatorios del contrato');
      return;
    }

    // si quieres forzar que siempre se registre un pago inicial:
    if (!this.pagoFormCreate.monto || !this.pagoFormCreate.fecha_pago) {
      alert('Por favor complete los campos obligatorios del pago inicial');
      return;
    }

    const newContrato = {
      cliente_id: this.contratoFormCreate.cliente_id,
      vehiculo_id: this.contratoFormCreate.vehiculo_id,
      empleado_id: this.contratoFormCreate.empleado_id,
      fecha_inicio: new Date(this.contratoFormCreate.fecha_inicio).toISOString(),
      fecha_fin: new Date(this.contratoFormCreate.fecha_fin).toISOString(),
      activo: this.contratoFormCreate.activo,
      id_usuario_creacion: this.contratoFormCreate.id_usuario_creacion,
    };

    // crear contrato primero
    this.contratoService.createContrato(newContrato).subscribe({
      next: (contratoCreado: any) => {
        const contratoId = contratoCreado.id;
        // crear pago con el id retornado
        this.createPagoAutomatico(contratoId);
      },
      error: (error) => {
        console.error('Error al crear contrato:', error);
        alert('Error al crear el contrato');
      },
    });
  }
  
  private createPagoAutomatico(contratoId: string): void {
    const newPago: any = {
      contrato_id: contratoId,
      monto: isNaN(Number(this.pagoFormCreate.monto))
        ? this.pagoFormCreate.monto
        : Number(this.pagoFormCreate.monto),
      fecha_pago: new Date(this.pagoFormCreate.fecha_pago).toISOString(),
      id_usuario_creacion: this.pagoFormCreate.id_usuario_creacion,
    };

    this.pagoService.createPago(newPago).subscribe({
      next: () => {
        // refrescar listas y cerrar modal
        this.loadContratos();
        // si tienes loadPagos en otro componente, usa evento o shared service para refrescar
        this.closeModalCreate();
        alert('Contrato y pago creados correctamente');
      },
      error: (error) => {
        console.error('Error al crear pago:', error);
        // COMPENSACIÓN simple: opcionalmente eliminar el contrato recién creado
        // (OJO: esto puede tener implicaciones; ver recomendación backend abajo)
        if (confirm('Error al crear el pago. ¿Desea eliminar el contrato creado para evitar estados inconsistentes?')) {
          // intenta eliminar el contrato creado
          this.contratoService.deleteContrato(contratoId).subscribe({
            next: () => {
              alert('Contrato eliminado por inconsistencia en pago');
              this.loadContratos();
              this.closeModalCreate();
            },
            error: (delErr) => {
              console.error('Error al eliminar contrato compensatorio:', delErr);
              alert('Pago falló y no se pudo eliminar el contrato. Contacte al administrador.');
            },
          });
        } else {
          alert('Pago falló. El contrato permanece creado — puede registrar el pago manualmente luego.');
          this.loadContratos();
          this.closeModalCreate();
        }
      },
    });
  }

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
