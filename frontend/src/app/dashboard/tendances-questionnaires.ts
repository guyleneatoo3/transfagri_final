import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuestionnaireService, Questionnaire } from '../service/questionnaire.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tendances-questionnaires',
  standalone: true,
  // Drop unused chart components to avoid NG8113 warnings for unused imports in this template
  imports: [CommonModule, RouterModule],
  templateUrl: './tendances-questionnaires.html'
})
export class TendancesQuestionnairesComponent implements OnInit {
  questionnaires: Questionnaire[] = [];
  selected?: Questionnaire;
  loading = false;
  error = '';
  // stats minimalistes (à étendre si besoin)
  stats: any = { distribution: [], labels: [] };

  constructor(private qs: QuestionnaireService, private http: HttpClient) {}

  ngOnInit(): void {
    this.qs.list().subscribe({ next: (list) => this.questionnaires = list });
  }

  select(q: Questionnaire) {
    this.selected = q;
    this.error = '';
    this.loading = true;
    // Appel backend: récupérer les réponses puis calculer distrib simple (nombre de réponses)
    if (!q.id) {
      this.error = 'Questionnaire invalide (identifiant manquant).';
      this.loading = false;
      return;
    }
    this.http.get<any[]>(`http://localhost:8082/api/questionnaires/${q.id}/answers`).subscribe({
      next: (answers) => {
        this.stats = { distribution: [answers.length], labels: ['Réponses'] };
        this.loading = false;
      },
      error: () => { this.error = 'Impossible de charger les tendances.'; this.loading = false; }
    });
  }

  genererRapport(q: Questionnaire) {
    // Endpoint existant côté backend ReportController supposé: /api/reports/generate/{id}
    if (!q.id) { return; }
    this.http.post<any>(`http://localhost:8082/api/reports/generate/${q.id}`, {}).subscribe();
  }

  resumerAvecIA(reportId?: number) {
    // Endpoint à créer côté backend: POST /api/reports/{id}/summarize
    if (!reportId) { return; }
    this.http.post<any>(`http://localhost:8082/api/reports/${reportId}/summarize`, {}).subscribe();
  }
}
