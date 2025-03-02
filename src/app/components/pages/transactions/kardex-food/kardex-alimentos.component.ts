import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovementKardex } from './models/movement_kardex';
@Component({
  selector: 'app-kardex-alimentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kardex-alimentos.component.html',
})
export class KardexAlimentosComponent implements OnInit {

  movimientos: MovementKardex[] = [];
  apiUrl = 'https://ominous-space-palm-tree-x74wpv5gvqrf4xw-8085.app.github.dev/NPH/movement-kardex';
  mostrarModal = false;
  movimientoActual: MovementKardex | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerMovimientos();
  }

  obtenerMovimientos(): void {
    this.http.get<MovementKardex[]>(this.apiUrl).subscribe(data => {
      this.movimientos = data;
    });
  }

  abrirModal(movimiento: MovementKardex | null = null): void {
    this.movimientoActual = movimiento ?? {
      kardexId: 0,
      documentId: 0,
      cantidadEntrada: 0,
      costoUnitarioEntrada: 0,
      valorTotalEntrada:0,
      cantidadSalida: 0,
      costoUnitarioSalida: 0,
      valorTotalSalida: 0,
      costoUnitarioSaldo: 0,
      valorTotalSaldo: 0,
      cantidadSaldo: 0,
      observation: '',
    };
    this.mostrarModal = true;
  }


  cerrarModal(): void {
    this.mostrarModal = false;
    this.movimientoActual = null;
  }

  guardarMovimiento(): void {
    if (!this.movimientoActual) return;

    if (this.movimientoActual.kardexId) {
      this.http.put(`${this.apiUrl}/${this.movimientoActual.kardexId}`, this.movimientoActual).subscribe(() => {
        this.obtenerMovimientos();
        this.cerrarModal();
      });
    } else {
      this.http.post(this.apiUrl, this.movimientoActual).subscribe(() => {
        this.obtenerMovimientos();
        this.cerrarModal();
      });
    }
  }

  eliminarMovimiento(kardexId: number): void {
    if (confirm('¿Estás seguro de eliminar este movimiento?')) {
      this.http.delete(`${this.apiUrl}/${kardexId}`).subscribe(() => {
        this.obtenerMovimientos();
      });
    }
  }
}
