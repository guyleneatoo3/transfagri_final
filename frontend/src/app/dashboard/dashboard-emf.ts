import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarLayoutComponent } from '../shared/sidebar-layout/sidebar-layout.component';
import { KpiChartsComponent } from '../shared/charts/kpi-charts.component';
import { ExtraChartsComponent } from '../shared/charts/extra-charts.component';
import { DashboardKpiService } from '../service/dashboard-kpi.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-emf',
  templateUrl: './dashboard-emf.html',
  styleUrls: ['../haccueil/haccueil.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarLayoutComponent, KpiChartsComponent, ExtraChartsComponent]
})
export class DashboardEmfComponent implements OnInit, OnDestroy {
  counts = { emfs: 0, indicateurs: 0, questionnaires: 0, activites: 0 };
  loading = true;
  isChildView = false;
  private sub?: Subscription;
  constructor(private kpi: DashboardKpiService, private router: Router) {}
  ngOnInit(): void {
    this.kpi.loadAllCounts().subscribe({ next: (d) => { this.counts = d; this.loading = false; }, error: () => { this.loading = false; } });
    const compute = () => {
      const url = this.router.url.split('?')[0];
      this.isChildView = url.startsWith('/dashboard/emf/') && url.length > '/dashboard/emf/'.length;
    };
    compute();
    this.sub = this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => compute());
  }
  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
