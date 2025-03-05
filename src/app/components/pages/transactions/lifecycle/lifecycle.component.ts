import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CicloVida } from './model/lifecycle';
import { CicloVidaService } from './service/lifecycle.service';

@Component({
  selector: 'app-lifecycle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lifecycle.component.html',
})
export class LifecycleComponent implements OnInit {
  ciclos: CicloVida[] = [];
  paginaCiclos: CicloVida[] = [];
  cicloSeleccionado: CicloVida | null = null;
  mostrarModal: boolean = false;
  page: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 0;
  statusFilter: 'A' | 'I' = 'A';
  statusActive: boolean = true;

  constructor(private cicloVidaService: CicloVidaService) { }

  ngOnInit(): void {
    this.listarCiclos();
  }

  listarCiclos(): void {
    this.cicloVidaService.getCycles().subscribe({
      next: (data) => {
        this.ciclos = data;
        this.filtrarCiclos();
      },
      error: (err) => {
        console.error('Error al listar ciclos', err);
      },
    });
  }

  filtrarCiclos(): void {
    const filtradas = this.ciclos.filter(ciclo => ciclo.status === this.statusFilter);
    this.totalPages = Math.ceil(filtradas.length / this.itemsPerPage);
    this.updatePaginatedData(filtradas);
  }

  updatePaginatedData(filtradas: CicloVida[]): void {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginaCiclos = filtradas.slice(startIndex, endIndex);
  }

  toggleStatus(): void {
    this.statusFilter = this.statusFilter === 'A' ? 'I' : 'A';
    this.statusActive = !this.statusActive;
    this.page = 1;
    this.filtrarCiclos();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.filtrarCiclos();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filtrarCiclos();
    }
  }

  eliminarCiclo(id: number): void {
    this.cicloVidaService.delete(id).subscribe({
      next: () => {
        this.listarCiclos();
      },
      error: (err) => {
        console.error('Error al eliminar el ciclo', err);
      },
    });
  }

  restaurarCiclo(id: number): void {
    this.cicloVidaService.activate(id).subscribe({
      next: () => {
        this.listarCiclos();
      },
      error: (err) => {
        console.error('Error al restaurar el ciclo', err);
      },
    });
  }
  editarCiclo(ciclo: CicloVida): void {
    this.cicloSeleccionado = { ...ciclo }; // Clonamos el objeto para evitar modificar directamente la lista
    this.mostrarModal = true; // Abre el modal
  }
  cerrarModal(): void {
    this.mostrarModal = false;
    this.cicloSeleccionado = null; // Resetea la selección
  }
    
  guardarEdicion(): void {
    if (!this.cicloSeleccionado) return;
  
    this.cicloVidaService.update(this.cicloSeleccionado).subscribe({
      next: () => {
        // Actualizar la lista localmente sin recargar
        this.ciclos = this.ciclos.map(ciclo =>
          ciclo.id === this.cicloSeleccionado?.id ? this.cicloSeleccionado : ciclo
        );
        this.filtrarCiclos(); // Refrescar la lista visible
        this.cerrarModal(); // Cerrar modal después de guardar
      },
      error: (err) => {
        console.error('Error al actualizar ciclo', err);
      }
    });
  }
  
  
  toggleCiclo(id: number, status: 'A' | 'I'): void {
    if (status === 'A') {
      this.eliminarCiclo(id);
    } else {
      this.restaurarCiclo(id);
    }
  }

}
