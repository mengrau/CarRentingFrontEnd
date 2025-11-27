import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario.models';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss'],
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  showCreateModal = false;
  showEditModal = false;
  editingUsuario: Usuario | null = null;

  usuarioFormCreate = {
    username: '',
    rol: 'admin',
    estado: '',
    id_usuario_creacion: '',
  };

  usuarioFormEdit = {
    username: '',
    password: '',
    rol: 'admin',
    estado: '',
    id_usuario_edicion: '',
  };

  filters = {
    username: '',
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize,
    };

    const filtersToSend = {
      username: this.filters.username || undefined,
    };

    this.usuarioService.getUsuarios(pagination, filtersToSend).subscribe({
      next: (usuarios) => {
        this.usuarios = Array.isArray(usuarios) ? usuarios : [];
        this.usuariosFiltrados = [...this.usuarios];
        this.totalPages = Math.max(1, Math.ceil(this.usuarios.length / this.pageSize));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    const username = (this.filters.username || '').toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter((u) =>
      ((u as any).username || '').toLowerCase().includes(username),
    );

    this.totalPages = Math.max(1, Math.ceil(this.usuariosFiltrados.length / this.pageSize));
    this.currentPage = 1;
  }

  clearFilters() {
    this.filters = { username: '' };
    this.usuariosFiltrados = [...this.usuarios];
    this.totalPages = Math.max(1, Math.ceil(this.usuariosFiltrados.length / this.pageSize));
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsuarios();
    }
  }

  openCreateModal(): void {
    this.editingUsuario = null;
    this.usuarioFormCreate = {
      username: '',
      rol: 'admin',
      estado: '',
      id_usuario_creacion: localStorage.getItem('user_id') ?? '',
    };
    this.showCreateModal = true;
  }

  openEditModal(usuario: Usuario): void {
    this.editingUsuario = usuario;
    this.usuarioFormEdit = {
      username: (usuario as any).username ?? '',
      password: '',
      rol: (usuario as any).rol ?? 'admin',
      estado: (usuario as any).estado ?? '',
      id_usuario_edicion: localStorage.getItem('user_id') ?? '',
    };
    this.showEditModal = true;
  }

  closeModalCreate(): void {
    this.showCreateModal = false;
    this.editingUsuario = null;
    this.usuarioFormCreate = {
      username: '',
      rol: 'admin',
      estado: '',
      id_usuario_creacion: '',
    };
  }

  closeModalEdit(): void {
    this.showEditModal = false;
    this.editingUsuario = null;
    this.usuarioFormEdit = {
      username: '',
      password: '',
      rol: 'admin',
      estado: '',
      id_usuario_edicion: '',
    };
  }

  createUsuario(): void {
    if (!this.usuarioFormCreate.username) {
      alert('Por favor complete el campo obligatorio: username');
      return;
    }

    const newUsuario: any = {
      username: this.usuarioFormCreate.username,
      rol: this.usuarioFormCreate.rol,
      estado: this.usuarioFormCreate.estado,
      id_usuario_creacion: this.usuarioFormCreate.id_usuario_creacion,
    };

    this.usuarioService.createUsuario(newUsuario).subscribe({
      next: () => {
        this.loadUsuarios();
        this.closeModalCreate();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        alert('Error al crear el usuario');
      },
    });
  }

  updateUsuario(): void {
    if (!this.editingUsuario) {
      alert('No hay usuario seleccionado para editar');
      return;
    }

    if (!this.usuarioFormEdit.username) {
      alert('Por favor complete el campo obligatorio: username');
      return;
    }

    const updateData: any = {
      username: this.usuarioFormEdit.username,
      password: this.usuarioFormEdit.password || undefined,
      rol: this.usuarioFormEdit.rol,
      estado: this.usuarioFormEdit.estado,
      id_usuario_edicion: this.usuarioFormEdit.id_usuario_edicion,
    };

    console.log('Payload update:', updateData);

    this.usuarioService.updateUsuario(this.editingUsuario.id, updateData).subscribe({
      next: () => {
        this.loadUsuarios();
        this.closeModalEdit();
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        alert('Error al actualizar el usuario');
      },
    });
  }

  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de eliminar el usuario con ID "${usuario.id}"?`)) {
      this.usuarioService.deleteUsuario(usuario.id).subscribe({
        next: () => this.loadUsuarios(),
        error: (error) => console.error('Error al eliminar el usuario:', error),
      });
    }
  }
}
