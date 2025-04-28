import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sale } from '../../../../../../model/Sale';
import { SaleService } from '../../../../../../service/sale.service';
import { ProductService } from '../../../../../../service/product.service';
import { Product } from '../../../../../../model/Product';

@Component({
  selector: 'app-model-sale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './model-sale.component.html',
  styleUrls: ['./model-sale.component.css']
})
export class ModelSaleComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() mode: 'create' | 'edit' | 'view' = 'create';  // Añadido modo 'view'
  @Input() saleData: Sale | null = null;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() saleCreated = new EventEmitter<Sale>();
  @Output() saleUpdated = new EventEmitter<Sale>();

  saleForm: FormGroup;
  products: Product[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private productService: ProductService
  ) {
    this.saleForm = this.createForm();
    this.loadProducts();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      // First, reset the form state based on mode
      if (this.mode === 'view') {
        // For view mode, disable the form
        this.saleForm.disable();
      } else {
        // For create or edit mode, enable the form
        this.saleForm.enable();
        
        // Re-disable specific fields that should always be disabled
        this.saleForm.get('totalWeight')?.disable();
        this.saleForm.get('totalPrice')?.disable();
      }
      
      if ((this.mode === 'edit' || this.mode === 'view') && this.saleData) {
        // Editar o Ver: Cargar datos existentes
        this.saleForm.patchValue({
          id: this.saleData.id,
          saleDate: this.formatDateForInput(this.saleData.saleDate),
          name: this.saleData.name,
          ruc: this.saleData.ruc,
          address: this.saleData.address,
          productId: this.saleData.productId,
          weight: this.saleData.weight,
          packages: this.saleData.packages,
          pricePerKg: this.saleData.pricePerKg,
          totalWeight: this.saleData.totalWeight,
          totalPrice: this.saleData.totalPrice
        });
      } else if (this.mode === 'create') {
        // Crear: Limpiar formulario
        this.saleForm = this.createForm();
      }
    }
  }
  createForm(): FormGroup {
    return this.fb.group({
      id: [null],
      saleDate: [this.getCurrentDate(), Validators.required],
      name: ['', Validators.required],
      ruc: ['', Validators.required],
      address: ['', Validators.required],
      productId: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0.01)]],
      packages: [1, [Validators.required, Validators.min(1)]],
      pricePerKg: [{value: 0, disabled: false}, [Validators.required, Validators.min(0.01)]],
      totalWeight: [{ value: 0, disabled: true }],
      totalPrice: [{ value: 0, disabled: true }]
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      }
    });
  }

  onProductChange(): void {
    const productId = this.saleForm.get('productId')?.value;
    if (productId) {
      const selectedProduct = this.products.find(product => product.id == productId);
      if (selectedProduct && selectedProduct.pricePerKg) {
        // Set the price per kg from the selected product
        this.saleForm.patchValue({
          pricePerKg: selectedProduct.pricePerKg
        });
        // Recalculate totals
        this.calculateTotals();
      }
    }
  }
  
  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD para input type="date"
  }

  formatDateForInput(dateString: string): string {
    // Convertir del formato de la API al formato para el input date
    if (!dateString) return this.getCurrentDate();
    return dateString.split('T')[0]; // Asumiendo que viene en formato ISO
  }

  calculateTotals(): void {
    const weight = parseFloat(this.saleForm.get('weight')?.value) || 0;
    const packages = parseInt(this.saleForm.get('packages')?.value) || 0;
    const pricePerKg = parseFloat(this.saleForm.get('pricePerKg')?.value) || 0;
    
    const totalWeight = weight * packages;
    const totalPrice = totalWeight * pricePerKg;
    
    this.saleForm.patchValue({
      totalWeight: totalWeight.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    });
  }

  onSubmit(): void {
    if (this.saleForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.saleForm.controls).forEach(key => {
        this.saleForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    if (this.mode === 'create') {
      this.saleService.createSale(formData).subscribe({
        next: (newSale) => {
          this.saleCreated.emit(newSale);
          this.handleClose();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al crear venta:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.saleService.updateSale(formData.id, formData).subscribe({
        next: (updatedSale) => {
          this.saleUpdated.emit(updatedSale);
          this.handleClose();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al actualizar venta:', error);
          this.isLoading = false;
        }
      });
    }
  }

  prepareFormData(): Sale {
    // Obtener valores del formulario incluyendo los campos deshabilitados
    const formValue = this.saleForm.getRawValue();
    
    // Convertir a números los campos numéricos
    return {
      ...formValue,
      productId: parseInt(formValue.productId),
      weight: parseFloat(formValue.weight),
      packages: parseInt(formValue.packages),
      pricePerKg: parseFloat(formValue.pricePerKg),
      totalWeight: parseFloat(formValue.totalWeight),
      totalPrice: parseFloat(formValue.totalPrice)
    };
  }

  handleClose(): void {
    this.closeModal.emit();
  }
}