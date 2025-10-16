import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReportsService, Report } from '../service/reports.service';

@Component({
  selector: 'app-rapport-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="bg-white rounded-xl shadow p-4">
    <a routerLink="/dashboard/pasnfi/rapports" class="text-sky-600 hover:underline">← Retour</a>
    <h2 class="text-2xl font-semibold mt-2">{{ report?.title || 'Rapport' }}</h2>
    <div class="text-sm text-slate-500">Généré le: {{ report?.generatedAt | date:'medium' }}</div>
    <div class="mt-4">
      <h3 class="font-semibold mb-2">Rapport</h3>
      <div class="bg-slate-50 rounded p-3 overflow-auto text-sm whitespace-pre-wrap" *ngIf="report?.aiSummary; else fallback">
        {{ report?.aiSummary }}
      </div>
      <ng-template #fallback>
        <div *ngIf="rendered; else noContent" class="bg-slate-50 rounded p-3 overflow-auto text-sm whitespace-pre-wrap">
          {{ rendered }}
        </div>
        <ng-template #noContent>
          <div class="text-slate-500 text-sm">Aucun contenu disponible pour ce rapport.</div>
        </ng-template>
      </ng-template>
    </div>
  </div>
  `
})
export class RapportDetailComponent implements OnInit {
  report?: Report;
  rendered = '';
  constructor(private route: ActivatedRoute, private reports: ReportsService) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.reports.get(id).subscribe({ next: (r) => { this.report = r; this.rendered = this.renderContent(r); } });
    }
  }
  prettyJson(data?: string) {
    if (!data) return '';
    try { return JSON.stringify(JSON.parse(data), null, 2); } catch { return data; }
  }

  private renderContent(r?: Report): string {
    if (!r?.contentJson) return '';
    try {
      const obj = JSON.parse(r.contentJson);
      const lines: string[] = [];
      const titre = (obj.titre || r.title || '').toString();
      const total = obj.total_reponses ?? obj.totalReponses ?? obj.total ?? undefined;
      if (titre) lines.push(`Titre: ${titre}`);
      if (typeof total === 'number') lines.push(`Nombre total de réponses: ${total}`);
      // QCM section
      const qcm = Array.isArray(obj.qcm) ? obj.qcm : [];
      if (qcm.length) {
        lines.push('\nTendances (questions à choix):');
        for (const q of qcm) {
          const label = q.label || 'Question';
          lines.push(`- ${label}`);
          const counts = q.counts || {};
          for (const opt of Object.keys(counts)) {
            lines.push(`    • ${opt}: ${counts[opt]}`);
          }
        }
      }
      // QRO section: show a few sample texts if available
      const qro = Array.isArray(obj.qro) ? obj.qro : [];
      const samples: string[] = [];
      for (const q of qro) {
        const arr: unknown = q.responses;
        if (Array.isArray(arr)) {
          for (const t of arr) {
            if (typeof t === 'string' && t.trim()) samples.push(t.trim());
            if (samples.length >= 3) break;
          }
        }
        if (samples.length >= 3) break;
      }
      if (samples.length) {
        lines.push('\nExtraits de réponses libres:');
        for (const s of samples) lines.push(`- ${s}`);
      }
      return lines.join('\n');
    } catch {
      // If JSON invalid, show a trimmed plain text without revealing raw JSON structure in UI
      return r.contentJson.length > 1000 ? r.contentJson.slice(0, 1000) + '…' : r.contentJson;
    }
  }
}
