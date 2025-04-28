import { Component, OnInit } from '@angular/core';
import { UbigeoService } from '../../../../../service/ubigeo.service';
import { Ubigeo } from '../../../../../model/Ubigeo';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit {
  ubicaciones: Ubigeo[] = [];
  paginatedUbicaciones: Ubigeo[] = [];
  page: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  statusFilter: 'A' | 'I' = 'A';
  statusActive: boolean = true;
  isModalOpen = false;
  editMode = false;
  ubigeoForm: FormGroup;

  constructor(private ubigeoService: UbigeoService, private fb: FormBuilder) {
    this.ubigeoForm = this.fb.group({
      id: [null],
      country: [''],
      department: [''],
      province: [''],
      district: [''],
      status: ['A'],
    });
  }

  ngOnInit(): void {
    this.listarUbicaciones();
  }

  listarUbicaciones(): void {
    this.ubigeoService.listarTodos().subscribe({
      next: (data) => {
        this.ubicaciones = data;
        this.filtrarUbicaciones();
      },
      error: (err) => console.error('Error al listar ubicaciones:', err),
    });
  }

  filtrarUbicaciones(): void {
    this.paginatedUbicaciones = this.ubicaciones
      .filter((u) => u.status === this.statusFilter)
      .slice((this.page - 1) * this.itemsPerPage, this.page * this.itemsPerPage);
    this.totalPages = Math.ceil(this.ubicaciones.length / this.itemsPerPage);
  }

  abrirModal(): void {
    this.editMode = false;
    this.ubigeoForm.reset({ status: 'A' });
    this.isModalOpen = true;
  }

  editarUbicacion(ubicacion: Ubigeo): void {
    this.editMode = true;
    this.ubigeoForm.patchValue(ubicacion);
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  guardarUbicacion(): void {
    if (this.editMode) {
      this.ubigeoService.editar(this.ubigeoForm.value.id, this.ubigeoForm.value).subscribe({
        next: (updatedUbicacion) => {
          Swal.fire({
            icon: 'success',
            title: 'Ubicación actualizada',
            text: `La ubicación ${updatedUbicacion.province} ha sido actualizada con éxito.`,
            timer: 2000,
            showConfirmButton: false
          });
          this.listarUbicaciones();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al actualizar ubicación:', err),
      });
    } else {
      this.ubigeoService.crear(this.ubigeoForm.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Ubicación agregada',
            text: 'La ubicación ha sido creada con éxito.',
            timer: 2000,
            showConfirmButton: false
          });
          this.listarUbicaciones();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al agregar ubicación:', err),
      });
    }
  }

  eliminarUbicacion(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción desactivará la ubicación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ubigeoService.eliminarLogico(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Ubicación eliminada',
              text: `La ubicación ha sido desactivada correctamente.`,
              timer: 2000,
              showConfirmButton: false
            });
            this.listarUbicaciones();
          },
          error: (err) => console.error('Error al eliminar ubicación:', err),
        });
      }
    });
  }

  restaurarUbicacion(id: number): void {
    Swal.fire({
      title: '¿Restaurar ubicación?',
      text: 'Esta acción activará nuevamente la ubicación',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ubigeoService.restaurar(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Ubicación restaurada',
              text: 'La ubicación ha sido activada nuevamente.',
              timer: 2000,
              showConfirmButton: false
            });
            this.listarUbicaciones();
          },
          error: (error) => console.error('Error al restaurar la ubicación:', error),
        });
      }
    });
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filtrarUbicaciones();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.filtrarUbicaciones();
    }
  }

  toggleStatus(): void {
    this.statusFilter = this.statusActive ? 'A' : 'I';
    this.listarUbicaciones();
  }
}
