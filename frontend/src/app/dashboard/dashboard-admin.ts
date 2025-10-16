import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarLayoutComponent } from '../shared/sidebar-layout/sidebar-layout.component';
import { KpiChartsComponent } from '../shared/charts/kpi-charts.component';
import { ExtraChartsComponent } from '../shared/charts/extra-charts.component';
import { DashboardKpiService } from '../service/dashboard-kpi.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.html',
  styleUrls: ['../haccueil/haccueil.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarLayoutComponent, KpiChartsComponent, ExtraChartsComponent]
})
export class DashboardAdminComponent implements OnInit {
  counts = { emfs: 0, indicateurs: 0, questionnaires: 0, activites: 0 };
  constructor(private kpi: DashboardKpiService) {}
  ngOnInit(): void {
    this.kpi.loadAllCounts().subscribe({ next: (d) => this.counts = d });
  }
}
