import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Food } from '../../masters/food/model/food';
import { FoodService } from '../../masters/food/service/food.service';
import { FoodCost, InsertCost, UpdateCost } from './model/cost';
import { CostFoodService } from './service/cost-food.service';

@Component({
  selector: 'app-costs-food',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './costs-food.component.html',
})
export class CostsFoodComponent implements OnInit {
  isModalOpen = false;
  isModalEdit = false;
  isModalDelete = false;
  isModalRestore = false;
  showInactive: boolean = false;
  activeFoods: Food[] = [];
  costActive: FoodCost[] = [];
  costInactive: FoodCost[] = [];
  newCostFood: InsertCost = {} as InsertCost;
  costToEdit: UpdateCost = {} as UpdateCost;
  costIdToDelete: number | null = null;
  costIdToRestore: number | null = null;

  constructor(
    private costService: CostFoodService,
    private foodService: FoodService) { }

  ngOnInit(): void {
    this.getCostFoods();
    this.getActiveFoods();
  }

  getActiveFoods(): void {
    this.foodService.getActiveFoods().subscribe({
      next: (data: Food[]) => {
        this.activeFoods = data; // Asignar lista de alimentos activos
      },
      error: (err) => {
        console.error('Error al obtener alimentos activos:', err);
      }
    });
  }

  getFoodType(foodId: number): string {
    const food = this.activeFoods.find(food => food.id_food === foodId);
    return food ? food.foodType : 'Desconocido';
  }

  getCostFoods(): void {
    if (this.showInactive) {
      this.costService.getICost().subscribe({
        next: (data: FoodCost[]) => {
          this.costInactive = data; // Cargar costo de alimentos inactivos
        },
        error: (err) => {
          console.error('Error al obtener el costo de los alimentos inactivos:', err);
        }
      });
    } else {
      this.costService.getACost().subscribe({
        next: (data: FoodCost[]) => {
          this.costActive = data; // Cargar costo de alimentos activos
        },
        error: (err) => {
          console.error('Error al obtener el costo de alimentos activos:', err);
        }
      });
    }
  }

  toggleCostList(): void {
    this.showInactive = !this.showInactive;
    this.getCostFoods();
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  openModalDelete(idFoodCosts: number): void {
    this.costIdToDelete = idFoodCosts;
    this.isModalDelete = true;
  }

  openModalRestore(idFoodCosts: number): void {
    this.costIdToRestore = idFoodCosts;
    this.isModalRestore = true;
  }

  addCost(): void {
    this.costService.addNewCost(this.newCostFood).subscribe({
      next: (data) => {
        console.log('Costo de Alimento agregado:', data);
        this.showInactive = false;
        this.getCostFoods();
        this.resetForm();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al agregar el costo del alimento:', err);
        if (err.status === 500) {
          console.error('Error del servidor:', err.message);
        }
      }
    });
  }

  DatosCost(cost: FoodCost): void {
    this.isModalEdit = true;
    this.costToEdit = {
      idFoodCosts: cost.idFoodCosts,
      weekNumber: cost.weekNumber,
      foodId: cost.foodId,
      gramsPerChicken: cost.gramsPerChicken,
      totalKg: cost.totalKg,
      totalCost: cost.totalCost,
      startDate: cost.startDate,
      endDate: cost.endDate
    };
  }

  updateCosto(): void {
    if (this.costToEdit) {
      this.costService.updateCost(this.costToEdit.idFoodCosts, this.costToEdit).subscribe({
        next: (data) => {
          console.log('Costo de Alimento actualizado:', data);
          this.showInactive = false;
          this.getCostFoods();
          this.isModalEdit = false;
        },
        error: (err) => {
          console.error('Error al actualizar el costo de alimento:', err);
        }
      });
    }
  }

  deleteCost(): void {
    if (this.costIdToDelete !== null) {
      console.log(`Desactivando el costo de alimento con ID: ${this.costIdToDelete}`);
      this.costService.deleteCost(this.costIdToDelete).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.getCostFoods();
          this.isModalDelete = false;
        },
        error: (err) => {
          console.error('Error al desactivar el costo de alimento:', err);
          console.error('Detalles del error:', err.error);
        }
      });
    }
  }

  restoreCost(): void {
    if (this.costIdToRestore !== null) {
      console.log(`Restaurando el precio de alimento con ID: ${this.costIdToRestore}`);
      this.costService.reactivateCost(this.costIdToRestore).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.getCostFoods();
          this.isModalRestore = false;
        },
        error: (err) => {
          console.error('Error al restaurar el costo de alimento:', err);
          console.error('Detalles del error:', err.error);
        }
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isModalEdit = false;
    this.isModalDelete = false;
    this.isModalRestore = false;
    this.costIdToRestore = null;
    this.costIdToDelete = null;

  }

  resetForm(): void {
    this.newCostFood = {} as InsertCost;
    this.costToEdit = {} as UpdateCost;
  }




}
