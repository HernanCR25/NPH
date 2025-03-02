import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shed } from './model/shed';
import { ShedService } from './service/shed.service';

@Component({
  selector: 'app-shed',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './shed.component.html',
})
export class ShedComponent implements OnInit {
  sheds: Shed[] = [];
  filteredSheds: Shed[] = [];
  activeStatus: 'A' | 'I' = 'A';
  isModalOpen = false;
  isEditMode = false;

  // Galpón temporal para agregar/editar
  tempShed: Partial<Shed> = {
    id: 0,
    name: '',
    location: '',
    capacity: 0,
    chickenType: '',
    inspectionDate: '',
    note: '',
    status: 'A'
  };

  // Criterios de búsqueda
  searchCriteria = {
    name: '',
    location: '',
    capacity: '',
    chickenType: '',
    inspectionDate: ''
  };

  constructor(private shedService: ShedService) { }

  ngOnInit(): void {
    this.loadSheds();
  }

  loadSheds(): void {
    this.shedService.getAllSheds().subscribe(
      (data) => {
        this.sheds = data;
        this.filterSheds();
      },
      (error) => {
        console.error('Error fetching sheds:', error);
      }
    );
  }

  filterSheds(): void {
    this.filteredSheds = this.sheds.filter((shed) => {
      return (
        shed.status === this.activeStatus &&
        (!this.searchCriteria.name || shed.name.toLowerCase().includes(this.searchCriteria.name.toLowerCase())) &&
        (!this.searchCriteria.location || shed.location.toLowerCase().includes(this.searchCriteria.location.toLowerCase())) &&
        (!this.searchCriteria.capacity || shed.capacity.toString().includes(this.searchCriteria.capacity)) &&
        (!this.searchCriteria.chickenType || shed.chickenType.toLowerCase().includes(this.searchCriteria.chickenType.toLowerCase())) &&
        (!this.searchCriteria.inspectionDate || shed.inspectionDate.includes(this.searchCriteria.inspectionDate))
      );
    });
  }

  switchStatus(status: 'A' | 'I'): void {
    this.activeStatus = status;
    this.filterSheds();
  }

  restoreShed(id: number): void {
    this.shedService.activateShed(id).subscribe(
      () => {
        this.loadSheds();
        alert('Galpón restaurado exitosamente.');
      },
      (error) => {
        console.error('Error al restaurar el galpón:', error);
        alert('Ocurrió un error al intentar restaurar el galpón.');
      }
    );
  }

  deleteShed(id: number): void {
    this.shedService.inactivateShed(id).subscribe(
      () => {
        this.loadSheds();
        alert('Galpón eliminado exitosamente.');
      },
      (error) => {
        console.error('Error al eliminar el galpón:', error);
        alert('Ocurrió un error al intentar eliminar el galpón.');
      }
    );
  }

  openModal(shed?: Shed): void {
    this.isEditMode = !!shed; // Si hay un galpón, estamos en modo editar
    this.tempShed = shed
      ? { ...shed } // Copia el galpón para editar
      : {
        id: 0,
        name: '',
        location: '',
        capacity: 0,
        chickenType: '',
        inspectionDate: '',
        note: '',
        status: 'A'
      }; // Galpón vacío para agregar
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.tempShed = {};
  }

  saveShed(): void {
    if (this.isEditMode && this.tempShed.id) {
      // Editar galpón
      this.shedService.updateShed(this.tempShed.id, this.tempShed as Shed).subscribe(
        () => {
          this.loadSheds();
          this.closeModal();
          alert('Galpón actualizado exitosamente.');
        },
        (error) => {
          console.error('Error al actualizar el galpón:', error);
          alert('Ocurrió un error al intentar actualizar el galpón.');
        }
      );
    } else {
      // Crear galpón
      const shedToCreate = { ...this.tempShed };
      delete shedToCreate.id;  // Eliminar el ID antes de enviar al backend

      this.shedService.createShed(shedToCreate as Shed).subscribe(
        () => {
          this.loadSheds();
          this.closeModal();
          alert('Galpón agregado exitosamente.');
        },
        (error) => {
          console.error('Error al agregar el galpón:', error);
          alert('Ocurrió un error al intentar agregar el galpón.');
        }
      );
    }
  }

}
