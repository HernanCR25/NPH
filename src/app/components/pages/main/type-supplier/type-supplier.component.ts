import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { TypeSupplierService } from '../../../../../service/type-supplier.service';
import { TypeSupplier } from '../../../../../model/TypeSupplier';
import { UbigeoService } from '../../../../../service/ubigeo.service';
import { Ubigeo } from '../../../../../model/Ubigeo';

@Component({
  selector: 'app-type-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './type-supplier.component.html',
  styleUrl: './type-supplier.component.css'
})
export class TypeSupplierComponent implements OnInit {
  typeSuppliers: TypeSupplier[] = [];
  paginatedSuppliers: TypeSupplier[] = [];
  pageSize = 10;
  currentPage = 1;
  ubigeos: Ubigeo[] = [];

  statusActive = true;
  statusFilter = 'A';
  isModalOpen = false;
  isEdit = false;
  supplier: Partial<TypeSupplier> = { address: '', name: '', status: 'A', ubigeoId: 0 };

  constructor(
    private typeSupplierService: TypeSupplierService,
    private ubigeoService: UbigeoService
  ) {}

  ngOnInit(): void {
    this.loadTypeSuppliers();
    this.loadUbigeos();
  }

  loadTypeSuppliers(): void {
    this.typeSupplierService.getAll().subscribe(
      (data) => {
        this.typeSuppliers = data;
        this.applyStatusFilter();
      },
      (error) => {
        console.error('Error al cargar los tipos de proveedores:', error);
      }
    );
  }

  loadUbigeos(): void {
    this.ubigeoService.listarTodos().subscribe(
      (data) => {
        this.ubigeos = data;
      },
      (error) => {
        console.error('Error al cargar los Ubigeos:', error);
      }
    );
  }

  getUbigeoName(ubigeoId: number): string {
    const ubigeo = this.ubigeos.find((u) => u.id === ubigeoId);
    return ubigeo ? `${ubigeo.department} - ${ubigeo.district}` : 'Desconocido';
  }

  toggleStatus(status: boolean): void {
    this.statusActive = status;
    this.statusFilter = status ? 'A' : 'I';
    this.applyStatusFilter();
  }

  applyStatusFilter(): void {
    const filteredSuppliers = this.typeSuppliers.filter(
      (supplier) => supplier.status === this.statusFilter
    );

    this.paginatedSuppliers = filteredSuppliers.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  getPages(): number[] {
    const totalPages = Math.ceil(
      this.typeSuppliers.filter((s) => s.status === this.statusFilter).length /
        this.pageSize
    );
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.applyStatusFilter();
  }

  openModal(editSupplier?: TypeSupplier) {
    this.isModalOpen = true;
    this.isEdit = !!editSupplier;
    this.supplier = editSupplier ? { ...editSupplier } : { address: '', name: '', status: 'A', ubigeoId: 0 };
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveSupplier() {
    if (this.isEdit) {
      this.typeSupplierService.update(this.supplier.id!, this.supplier as TypeSupplier).subscribe(
        () => {
          Swal.fire('Éxito', 'Proveedor actualizado con éxito', 'success');
          this.closeModal();
          this.loadTypeSuppliers();
        },
        (error) => {
          console.error('Error al actualizar:', error);
          Swal.fire('Error', 'No se pudo actualizar el proveedor', 'error');
        }
      );
    } else {
      this.typeSupplierService.create(this.supplier as TypeSupplier).subscribe(
        () => {
          Swal.fire('Éxito', 'Proveedor creado con éxito', 'success');
          this.closeModal();
          this.loadTypeSuppliers();
        },
        (error) => {
          console.error('Error al crear:', error);
          Swal.fire('Error', 'No se pudo crear el proveedor', 'error');
        }
      );
    }
  }

  softDelete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción desactivará el proveedor.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.typeSupplierService.softDelete(id).subscribe(
          () => {
            Swal.fire('Desactivado', 'El proveedor ha sido desactivado.', 'success');
            this.loadTypeSuppliers();
          },
          (error) => {
            console.error('Error al eliminar proveedor:', error);
            Swal.fire('Error', 'No se pudo desactivar el proveedor', 'error');
          }
        );
      }
    });
  }

  restore(id: number): void {
    Swal.fire({
      title: '¿Restaurar proveedor?',
      text: 'El proveedor será activado nuevamente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.typeSupplierService.restore(id).subscribe(
          () => {
            Swal.fire('Restaurado', 'El proveedor ha sido restaurado.', 'success');
            this.loadTypeSuppliers();
          },
          (error) => {
            console.error('Error al restaurar proveedor:', error);
            Swal.fire('Error', 'No se pudo restaurar el proveedor', 'error');
          }
        );
      }
    });
  }
}
