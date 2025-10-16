import { Component, Input, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Using Chart.js via CDN from index.html is acceptable for dev; we target the canvas by id
@Component({
  selector: 'app-kpi-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="grid gap-4 grid-cols-1 lg:grid-cols-3">
    <div class="rounded-xl bg-white shadow p-4 lg:col-span-2 h-80">
      <h4 class="font-semibold text-gray-800 mb-3">Répartition des éléments</h4>
      <canvas id="kpiBar"></canvas>
    </div>
    <div class="rounded-xl bg-white shadow p-4 h-80">
      <h4 class="font-semibold text-gray-800 mb-3">Vue d'ensemble</h4>
      <canvas id="kpiDoughnut"></canvas>
    </div>
  </div>
  `
})
export class KpiChartsComponent implements OnChanges {
  @Input() emfs = 0;
  @Input() indicateurs = 0;
  @Input() questionnaires = 0;
  @Input() activites = 0;
  private isBrowser = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private ensureCdnLoaded(): Promise<void> {
    // Chart.js loaded by CDN? if not, inject
    return new Promise((resolve, reject) => {
      if (!this.isBrowser) return resolve();
      const win = window as any;
      if (win.Chart) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Chart.js CDN failed to load'));
      document.head.appendChild(s);
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!this.isBrowser) return; // SSR: skip DOM access
    await this.ensureCdnLoaded();
    const win = window as any;
    const Chart = win.Chart;

    // Destroy previous charts if re-rendered
    const barEl = document.getElementById('kpiBar') as HTMLCanvasElement | null;
    const doughnutEl = document.getElementById('kpiDoughnut') as HTMLCanvasElement | null;
    if (!barEl || !doughnutEl) return;

    // Use a stable instance map on window for cleanup across updates
    win.__kpiCharts = win.__kpiCharts || {};
    if (win.__kpiCharts.bar) { win.__kpiCharts.bar.destroy(); }
    if (win.__kpiCharts.doughnut) { win.__kpiCharts.doughnut.destroy(); }

    const labels = ['EMFs', 'Indicateurs', 'Questionnaires', 'Activités'];
    const values = [this.emfs, this.indicateurs, this.questionnaires, this.activites];

    win.__kpiCharts.bar = new Chart(barEl.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Total',
          data: values,
          backgroundColor: ['#0ea5e9', '#f59e0b', '#8b5cf6', '#f43f5e']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    win.__kpiCharts.doughnut = new Chart(doughnutEl.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: ['#0ea5e9', '#f59e0b', '#8b5cf6', '#f43f5e']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}
