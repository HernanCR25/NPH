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
  nuevoCiclo: CicloVida = { henId: 0, typeIto: '', nameIto: '', typeTime: '', times: 0, status: 'A' }; // El id y endDate se generan en el backend
  mostrarModalCrear: boolean = false;
  tipoBusqueda: string = '';// Para almacenar el valor de búsqueda por tipo

  constructor(private cicloVidaService: CicloVidaService) { }

  ngOnInit(): void {
    this.listarCiclos();
  }

  abrirModalCrear(): void {
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.nuevoCiclo = { henId: 0, typeIto: '', nameIto: '', typeTime: '', times: 0, status: 'A' }; // Resetear
  }

  crearCiclo(): void {
    this.cicloVidaService.create(this.nuevoCiclo).subscribe({
      next: (data) => {
        this.listarCiclos(); // Recargar la lista de ciclos
        this.cerrarModalCrear(); // Cerrar el modal
      },
      error: (err) => {
        console.error('Error al crear ciclo', err);
      },
    });
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
        // Recargar toda la lista de ciclos después de la edición
        this.listarCiclos();
        this.cerrarModal(); // Cerrar modal después de guardar
      },
      error: (err) => {
        console.error('Error al actualizar ciclo', err);
      }
    });
  }
 // Método para buscar ciclos por tipo (typeIto)
 buscarCicloPorTipo(): void {
  if (!this.tipoBusqueda) {
    console.warn('Seleccione un tipo de búsqueda válido.');
    // Si el campo está vacío, puedes llamar a listarCiclos() o manejar el caso según sea necesario
    this.listarCiclos();
    return;
  }

  // Llamamos al servicio para obtener los ciclos por tipo
  this.cicloVidaService.getCiclosByTypeIto(this.tipoBusqueda).subscribe({
    next: (data: CicloVida[]) => {
      this.ciclos = data; // Asignamos los datos obtenidos
      this.filtrarCiclos(); // Actualizamos la vista
    },
    error: (err) => {
      console.error('Error al buscar ciclos por tipo', err);
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

