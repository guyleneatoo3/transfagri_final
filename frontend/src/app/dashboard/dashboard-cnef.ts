import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { DashboardKpiService } from '../service/dashboard-kpi.service';
import { SidebarLayoutComponent } from '../shared/sidebar-layout/sidebar-layout.component';
import { KpiChartsComponent } from '../shared/charts/kpi-charts.component';
import { ExtraChartsComponent } from '../shared/charts/extra-charts.component';

@Component({
  selector: 'app-dashboard-cnef',
  templateUrl: './dashboard-cnef.html',
  styleUrls: ['../haccueil/haccueil.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarLayoutComponent, KpiChartsComponent, ExtraChartsComponent]
})
export class DashboardCnefComponent implements OnInit, OnDestroy {
  // Mobile sidebar state; stays visible on md+ via responsive classes
  sidebarOpen = false;
  // Toggle when a child route of /dashboard/cnef is active
  isChildView = false;
  // KPI state
  loading = true;
  counts = { emfs: 0, indicateurs: 0, questionnaires: 0, activites: 0 };

  private sub?: Subscription;

  constructor(private router: Router, private kpi: DashboardKpiService) {}

  ngOnInit(): void {
    const compute = () => {
      const url = this.router.url.split('?')[0];
      // A child route is active when URL starts with /dashboard/cnef/
      this.isChildView = url.startsWith('/dashboard/cnef/') && url.length > '/dashboard/cnef/'.length;
    };
    compute();
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => compute());

    // Load counts (ignore errors gracefully)
    this.kpi.loadAllCounts().subscribe({
      next: (data) => { this.counts = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  closeSidebarOnNav() {
    // Close only on mobile; on md+ the sidebar is always visible
    this.sidebarOpen = false;
  }
}
