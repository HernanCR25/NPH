import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supplier } from './model/supplier';
import { SupplierService } from './service/supplier.service';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './proveedor.component.html',
})
export class ProveedorComponent implements OnInit {

  isModalOpen = false;
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  isLoading: boolean = true;
  isActive: boolean = true;
  isEditMode: boolean = false;

  // Filtros
  nameFilter: string = '';
  descriptionFilter: string = '';

  // Información del proveedor
  editSupplier: Supplier | null = null;
  supplierForm: Supplier = { id: 0, company: '', firstName: '', lastName: '', email: '', phone: '', notes: '', status: 'A' };

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.getSuppliers();
  }

  // Obtener todos los proveedores
  getSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.filterSuppliers(); // Filtrar proveedores al obtenerlos
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching suppliers:', err);
        this.isLoading = false;
      }
    });
  }

  // Filtrar proveedores según estado, nombre y descripción
  filterSuppliers(): void {
    this.filteredSuppliers = this.suppliers.filter(supplier => {
      const matchesStatus = supplier.status === (this.isActive ? 'A' : 'I');
      const matchesName = supplier.firstName
        .toLowerCase()
        .includes(this.nameFilter.toLowerCase());
      const matchesDescription = supplier.notes
        .toLowerCase()
        .includes(this.descriptionFilter.toLowerCase());
      return matchesStatus && matchesName && matchesDescription;
    });
  }

  // Cambiar el estado del switcher y actualizar la lista filtrada
  toggleStatus(): void {
    this.filterSuppliers(); // Refrescar la lista filtrada
  }

  // Activar un proveedor
  activateSupplier(id: number | undefined): void {
    if (id !== undefined) {
      this.supplierService.activateSupplier(id).subscribe({
        next: () => {
          this.getSuppliers();
        },
        error: (err) => {
          console.error('Error activating supplier:', err);
        }
      });
    } else {
      console.error('Invalid supplier ID');
    }
  }

  // Inactivar un proveedor
  inactivateSupplier(id: number | undefined): void {
    if (id !== undefined) {
      this.supplierService.inactivateSupplier(id).subscribe({
        next: () => {
          this.getSuppliers();
        },
        error: (err) => {
          console.error('Error inactivating supplier:', err);
        }
      });
    } else {
      console.error('Invalid supplier ID');
    }
  }

  // Abrir el modal en modo agregar
  openModal(): void {
    this.isEditMode = false;
    this.supplierForm = { id: 0, company: '', firstName: '', lastName: '', email: '', phone: '', notes: '', status: 'A' };
    this.isModalOpen = true;
  }

  // Abrir el modal en modo edición
  editSupplierDetails(supplier: Supplier): void {
    this.isEditMode = true;
    this.supplierForm = { ...supplier };
    this.isModalOpen = true;
  }

  // Cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Agregar un nuevo proveedor
  addSupplier(): void {
    // Asegurarse de que el id esté como 0 antes de la creación
    if (this.supplierForm.id === 0) {
      this.supplierForm.id = undefined; // O eliminar la propiedad id
    }

    this.supplierService.createSupplier(this.supplierForm).subscribe({
      next: () => {
        this.getSuppliers(); // Refrescar la lista
        this.closeModal(); // Cerrar el modal
      },
      error: (err) => {
        console.error('Error adding supplier:', err);
      }
    });
  }

  // Actualizar un proveedor existente
  updateSupplier(): void {
    if (this.supplierForm.id) {
      this.supplierService.updateSupplier(this.supplierForm.id, this.supplierForm).subscribe({
        next: () => {
          this.getSuppliers(); // Refrescar la lista
          this.closeModal(); // Cerrar el modal
        },
        error: (err) => {
          console.error('Error updating supplier:', err);
        }
      });
    }
  }
}
