import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.loadChart();
  }

  loadChart() {
    if (this.chartRef) {
      const canvas = this.chartRef.nativeElement;
      canvas.style.width = '100%';  // Ocupar todo el ancho
      canvas.style.height = '100px'; // 🔥 Ajustar altura manualmente

      new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
          datasets: [{
            label: 'Consumo (kg)',
            data: [500, 400, 650, 700, 600],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3B82F6',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // 🚀 Clave para reducir altura
        }
      });
    }
  }

}
