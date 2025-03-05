import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hen } from './model/hen';
import { HenService } from './service/hen.service';

@Component({
  selector: 'app-hen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hen.component.html',
})
export class HenComponent implements OnInit {
  gallinas: Hen[] = [];
  paginaGallinas: Hen[] = [];
  gallinaSeleccionada: Hen | null = null;
  mostrarModal: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  statusFilter: 'A' | 'I' = 'A';
  statusActive: boolean = true;

  constructor(private henService: HenService) { }

  ngOnInit(): void {
    this.listarGallinas();
  }

  listarGallinas(): void {
    this.henService.getHens().subscribe({
      next: (data) => {
        this.gallinas = data;
        this.filtrarGallinas();
      },
      error: (err) => {
        console.error('Error al listar gallinas', err);
      },
    });
  }

  filtrarGallinas(): void {
    const filtradas = this.gallinas.filter(gallina => gallina.status === this.statusFilter);
    this.totalPages = Math.ceil(filtradas.length / this.itemsPerPage);
    this.updatePaginatedData(filtradas);
  }

  updatePaginatedData(filtradas: Hen[]): void {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginaGallinas = filtradas.slice(startIndex, endIndex);
  }

  toggleStatus(): void {
    this.statusFilter = this.statusFilter === 'A' ? 'I' : 'A';
    this.statusActive = !this.statusActive;
    this.page = 1;
    this.filtrarGallinas();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.filtrarGallinas();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filtrarGallinas();
    }
  }

  eliminarGallina(id: number): void {
    this.henService.delete(id).subscribe({
      next: () => {
        this.listarGallinas();
      },
      error: (err) => {
        console.error('Error al eliminar la gallina', err);
      },
    });
  }

  restaurarGallina(id: number): void {
    this.henService.activate(id).subscribe({
      next: () => {
        this.listarGallinas();
      },
      error: (err) => {
        console.error('Error al restaurar la gallina ', err);
      },
    });
  }
  editarGallina(hen: Hen): void {
    this.gallinaSeleccionada = { ...hen }; // Clonamos el objeto para evitar modificar directamente la lista
    this.mostrarModal = true; // Abre el modal
  }
  cerrarModal(): void {
    this.mostrarModal = false;
    this.gallinaSeleccionada = null; // Resetea la selección
  }
    
  guardarEdicion(): void {
    if (!this.gallinaSeleccionada) return;
  
    this.henService.update(this.gallinaSeleccionada).subscribe({
      next: () => {
        // Actualizar la lista localmente sin recargar
        this.gallinas = this.gallinas.map(gallina =>
          gallina.id === this.gallinaSeleccionada?.id ? this.gallinaSeleccionada : gallina
        );
        this.filtrarGallinas(); // Refrescar la lista visible
        this.cerrarModal(); // Cerrar modal después de guardar
      },
      error: (err) => {
        console.error('Error al actualizar gallina', err);
      }
    });
  }
  
  
  toggleGallina(id: number, status: 'A' | 'I'): void {
    if (status === 'A') {
      this.eliminarGallina(id);
    } else {
      this.restaurarGallina(id);
    }
  }

}
