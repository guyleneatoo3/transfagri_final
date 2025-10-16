import { Component, Input, OnChanges, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-extra-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-4">
    <div class="rounded-xl bg-white shadow p-4 h-80">
      <h4 class="font-semibold text-gray-800 mb-3">Évolution</h4>
      <canvas id="kpiLine"></canvas>
    </div>
    <div class="rounded-xl bg-white shadow p-4 h-80">
      <h4 class="font-semibold text-gray-800 mb-3">Comparatif</h4>
      <canvas id="kpiRadar"></canvas>
    </div>
  </div>
  `
})
export class ExtraChartsComponent implements OnChanges {
  @Input() emfs = 0;
  @Input() indicateurs = 0;
  @Input() questionnaires = 0;
  @Input() activites = 0;
  private isBrowser = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private ensureCdnLoaded(): Promise<void> {
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

  async ngOnChanges() {
    if (!this.isBrowser) return; // SSR: skip DOM access
    await this.ensureCdnLoaded();
    const win = window as any;
    const Chart = win.Chart;

    const lineEl = document.getElementById('kpiLine') as HTMLCanvasElement | null;
    const radarEl = document.getElementById('kpiRadar') as HTMLCanvasElement | null;
    if (!lineEl || !radarEl) return;

    win.__extraCharts = win.__extraCharts || {};
    if (win.__extraCharts.line) win.__extraCharts.line.destroy();
    if (win.__extraCharts.radar) win.__extraCharts.radar.destroy();

    const labels = ['EMFs', 'Indicateurs', 'Questionnaires', 'Activités'];
    const values = [this.emfs, this.indicateurs, this.questionnaires, this.activites];

    win.__extraCharts.line = new Chart(lineEl.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Tendance',
          data: values,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.2)'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    win.__extraCharts.radar = new Chart(radarEl.getContext('2d'), {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Répartition',
          data: values,
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.2)'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}
