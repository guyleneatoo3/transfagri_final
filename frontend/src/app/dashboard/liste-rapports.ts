import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportsService, Report } from '../service/reports.service';

interface Rapport { id: number; titre: string; date: string; url: string; }

@Component({
  selector: 'app-liste-rapports',
  templateUrl: './liste-rapports.html',
  styleUrls: ['./liste-rapports.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ListeRapportsComponent {
  rapports: Rapport[] = [];
  message = '';

  constructor(private reports: ReportsService) {}

  ngOnInit(): void {
    this.reports.list().subscribe({
      next: (list) => {
        this.rapports = (list || []).map(r => ({ id: r.id, titre: r.title, date: new Date(r.generatedAt).toLocaleDateString(), url: `/dashboard/pasnfi/rapports/${r.id}` }));
      },
      error: () => this.message = 'Impossible de charger les rapports.'
    });
  }
}