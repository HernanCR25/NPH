import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ubigeo } from './model/location';
import { UbigeoService } from './service/location.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnInit {
  ubicaciones: Ubigeo[] = [];
  paginatedUbicaciones: Ubigeo[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  statusFilter: 'A' | 'I' = 'A';
  statusActive: boolean = true;

  constructor(private ubigeoService: UbigeoService) { }

  ngOnInit(): void {
    this.listarUbicaciones();
  }

  listarUbicaciones(): void {
    this.ubigeoService.listarTodos().subscribe({
      next: (data) => {
        this.ubicaciones = data;
        this.filtrarUbicaciones();
      },
      error: (err) => {
        console.error('Error al listar ubicaciones', err);
      },
    });
  }

  filtrarUbicaciones(): void {
    const filtradas = this.ubicaciones.filter(ubicacion => ubicacion.status === this.statusFilter);
    this.totalPages = Math.ceil(filtradas.length / this.itemsPerPage);
    this.updatePaginatedData(filtradas);
  }

  updatePaginatedData(filtradas: Ubigeo[]): void {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUbicaciones = filtradas.slice(startIndex, endIndex);
  }

  toggleStatus(): void {
    this.statusFilter = this.statusFilter === 'A' ? 'I' : 'A';
    this.statusActive = !this.statusActive;
    this.page = 1;
    this.filtrarUbicaciones();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.filtrarUbicaciones();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filtrarUbicaciones();
    }
  }

  eliminarUbicacion(id: number): void {
    this.ubigeoService.eliminarLogico(id).subscribe({
      next: () => {
        this.listarUbicaciones();
      },
      error: (err) => {
        console.error('Error al eliminar ubicación', err);
      },
    });
  }

  restaurarUbicacion(id: number): void {
    this.ubigeoService.restaurar(id).subscribe({
      next: () => {
        this.listarUbicaciones();
      },
      error: (err) => {
        console.error('Error al restaurar ubicación', err);
      },
    });
  }

  toggleUbicacion(id: number, status: 'A' | 'I'): void {
    if (status === 'A') {
      this.eliminarUbicacion(id);
    } else {
      this.restaurarUbicacion(id);
    }
  }

}
