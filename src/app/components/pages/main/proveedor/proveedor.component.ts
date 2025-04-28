import { Component, OnInit, ViewChild } from '@angular/core';
import { TypeSupplierService } from '../../../../../service/type-supplier.service';
import { TypeSupplier } from '../../../../../model/TypeSupplier';
import { SupplierService } from '../../../../../service/supplier.service';
import { Supplier } from '../../../../../model/Supplier';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css'
})
export class ProveedorComponent implements OnInit {
  suppliers: Supplier[] = [];
  paginatedSuppliers: Supplier[] = [];
  typeSuppliersMap = new Map<number, TypeSupplier>(); // Mapa para almacenar los TypeSupplier por ID
  typeSuppliers: TypeSupplier[] = [];
  selectedSupplier?: Supplier;
  formSupplier: Supplier = this.initializeSupplier();
  statusActive: boolean = true;
  statusFilter: string = 'A';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  showModal: boolean = false;

  @ViewChild('supplierForm') supplierForm!: NgForm;

  constructor(
    private supplierService: SupplierService,
    private typeSupplierService: TypeSupplierService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadAllTypeSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getAll().subscribe(data => {
      this.suppliers = data;
      this.filterAndPaginate();
      this.loadTypeSuppliers(); // Cargar los TypeSuppliers después de obtener los Suppliers
    });
  }

  loadTypeSuppliers(): void {
    this.suppliers.forEach(supplier => {
      if (supplier.typeSupplierId && !this.typeSuppliersMap.has(supplier.typeSupplierId)) {
        this.typeSupplierService.getById(supplier.typeSupplierId).subscribe(typeSupplier => {
          this.typeSuppliersMap.set(supplier.typeSupplierId, typeSupplier);
        });
      }
    });
  }

  loadAllTypeSuppliers(): void {
    this.typeSupplierService.getAll().subscribe(data => {
      this.typeSuppliers = data;
    });
  }

  toggleStatus(event: boolean): void {
    this.statusActive = event;
    this.statusFilter = event ? 'A' : 'I';
    this.filterAndPaginate();
  }

  filterAndPaginate(): void {
    const filteredSuppliers = this.suppliers.filter(s => s.status === this.statusFilter);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getPages(): number[] {
    const filteredCount = this.suppliers.filter(s => s.status === this.statusFilter).length;
    const totalPages = Math.ceil(filteredCount / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  cambiarPagina(page: number): void {
    this.currentPage = page;
    this.filterAndPaginate();
  }

  selectSupplier(id: number | undefined): void {
    if (id === undefined) return;
    
    this.supplierService.getById(id).subscribe(data => {
      this.selectedSupplier = data;
      this.formSupplier = { ...data };
      this.openModal();
    });
  }

  updateSupplier(id: number | undefined, supplier: Supplier): void {
    if (id !== undefined) {
      this.selectSupplier(id);
    }
  }

  addSupplier(supplier: Supplier): void {
    this.supplierService.create(supplier).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Proveedor creado',
        text: 'El proveedor ha sido registrado exitosamente.',
        timer: 2000,
        showConfirmButton: false
      });
      this.loadSuppliers();
      this.closeModal();
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al registrar el proveedor.'
      });
      console.error('Error creando el proveedor:', error);
    });
  }

  saveSupplier(): void {
    if (this.formSupplier.id !== undefined) {
      this.supplierService.update(this.formSupplier.id, this.formSupplier).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Proveedor actualizado',
          text: 'El proveedor ha sido actualizado exitosamente.',
          timer: 2000,
          showConfirmButton: false
        });
        this.loadSuppliers();
        this.closeModal();
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el proveedor.'
        });
        console.error('Error actualizando el proveedor:', error);
      });
    } else {
      this.addSupplier(this.formSupplier);
    }
  }

  softDeleteSupplier(id: number | undefined): void {
    if (id === undefined) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El proveedor será eliminado lógicamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.supplierService.softDelete(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Proveedor eliminado',
            text: 'El proveedor ha sido eliminado correctamente.',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadSuppliers();
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al eliminar el proveedor.'
          });
          console.error('Error eliminando el proveedor:', error);
        });
      }
    });
  }

  restoreSupplier(id: number | undefined): void {
    if (id === undefined) return;

    Swal.fire({
      title: '¿Restaurar proveedor?',
      text: 'El proveedor será restaurado.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.supplierService.restore(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Proveedor restaurado',
            text: 'El proveedor ha sido restaurado correctamente.',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadSuppliers();
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al restaurar el proveedor.'
          });
          console.error('Error restaurando el proveedor:', error);
        });
      }
    });
  }

  getTypeSupplierInfo(id: number, field: keyof TypeSupplier): string {
    const typeSupplier = this.typeSuppliersMap.get(id);
    return typeSupplier ? String(typeSupplier[field]) : 'Cargando...';
  }

  openModal(): void {
    if (!this.selectedSupplier) {
      this.formSupplier = this.initializeSupplier();
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedSupplier = undefined;
    this.formSupplier = this.initializeSupplier();
  }

  initializeSupplier(): Supplier {
    return {
      id: undefined, 
      ruc: '',
      company: '',
      name: '',
      lastname: '',
      email: '',
      cellphone: '',
      notes: '',
      registerDate: new Date().toISOString().split('T')[0],
      status: 'A',
      typeSupplierId: 0
    };
  }
}