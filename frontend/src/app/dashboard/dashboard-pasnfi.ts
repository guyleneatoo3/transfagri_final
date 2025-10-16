import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarLayoutComponent } from '../shared/sidebar-layout/sidebar-layout.component';
import { KpiChartsComponent } from '../shared/charts/kpi-charts.component';
import { ExtraChartsComponent } from '../shared/charts/extra-charts.component';
import { DashboardKpiService } from '../service/dashboard-kpi.service';

@Component({
  selector: 'app-dashboard-pasnfi',
  templateUrl: './dashboard-pasnfi.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarLayoutComponent, KpiChartsComponent, ExtraChartsComponent]
})
export class DashboardPasnfiComponent implements OnInit {
  counts = { emfs: 0, indicateurs: 0, questionnaires: 0, activites: 0 };
  loading = true;
  constructor(private kpi: DashboardKpiService) {}
  ngOnInit(): void {
    this.kpi.loadAllCounts().subscribe({ next: (d) => { this.counts = d; this.loading = false; }, error: () => { this.loading = false; } });
  }
}
