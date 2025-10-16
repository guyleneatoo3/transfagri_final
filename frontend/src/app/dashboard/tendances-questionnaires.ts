import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuestionnaireService, Questionnaire } from '../service/questionnaire.service';
import { HttpClient } from '@angular/common/http';
import { ReportsService } from '../service/reports.service';

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
  info = '';
  // Statistiques QCM: par question -> occurrences par option
  stats: {
    totalReponses: number;
    questions: Array<{ label: string; type: 'single'|'multi'; counts: Record<string, number>; options: string[] }>
  } = { totalReponses: 0, questions: [] };
  // popup résumé IA
  aiSummary = '';
  showSummary = false;
  private _selId?: number;

  constructor(private qs: QuestionnaireService, private http: HttpClient, private reports: ReportsService) {}

  ngOnInit(): void {
    this.qs.list().subscribe({ next: (list) => this.questionnaires = list });
  }

  select(q: Questionnaire) {
    this.selected = q;
    this._selId = q.id;
    this.error = '';
    this.loading = true;
    // Appel backend: récupérer les réponses puis calculer distrib simple (nombre de réponses)
    if (!q.id) {
      this.error = 'Questionnaire invalide (identifiant manquant).';
      this.loading = false;
      return;
    }
    this.qs.answers(q.id).subscribe({
      next: (answers) => {
        // Construire l'agrégation QCM
        this.stats = this.buildQcmAggregation(q, answers || []);
        this.loading = false;
      },
      error: () => { this.error = 'Impossible de charger les tendances.'; this.loading = false; }
    });
  }

  genererRapport(q: Questionnaire) {
    // Endpoint existant côté backend ReportController supposé: /api/reports/generate/{id}
    if (!q.id) { return; }
    this.reports.generate(q.id).subscribe({
      next: (r) => { this.info = 'Rapport généré.'; this.error = ''; this._lastReportId = r?.id; },
      error: () => { this.error = 'Impossible de générer le rapport.'; this.info = ''; }
    });
  }

  private _lastReportId?: number;

  resumerAvecIA(questionnaireId?: number) {
    if (!questionnaireId) { this.error = 'Questionnaire manquant.'; return; }
    this.http.post<any>(`http://localhost:8082/api/reports/previewSummary/${questionnaireId}`, {}, { headers: this.reports['headers']() }).subscribe({
      next: (r) => { this.aiSummary = r?.summary || 'Résumé indisponible'; this.showSummary = true; this.info = ''; },
      error: () => { this.aiSummary = 'Erreur lors du résumé IA.'; this.showSummary = true; }
    });
  }

  saveSummary() {
    const id = this._selId;
    if (!id) { this.showSummary = false; return; }
    this.http.post<any>(`http://localhost:8082/api/reports/saveSummary/${id}`, { summary: this.aiSummary }, { headers: this.reports['headers']() }).subscribe({
      next: () => { this.info = 'Rapport enregistré.'; this.showSummary = false; },
      error: () => { this.info = ''; this.error = "Échec de l'enregistrement du rapport."; }
    });
  }

  private buildQcmAggregation(q: Questionnaire, answers: any[]): {
    totalReponses: number;
    questions: Array<{ label: string; type: 'single'|'multi'; counts: Record<string, number>; options: string[] }>
  } {
    // 1) Lire les questions depuis q.jsonContent
    let rawQuestions: any[] = [];
    try {
      const content = q.jsonContent ? JSON.parse(q.jsonContent) : null;
      rawQuestions = Array.isArray(content)
        ? content
        : (content?.questions || content?.questionnaire?.questions || []);
    } catch { rawQuestions = []; }

    // 2) Normaliser questions et ne garder que QCM (single/multi)
    type QDef = { key: string; label: string; type: 'single'|'multi'; options: string[] };
    const mapType = (t: string): 'single'|'multi'|'skip' => {
      const x = (t||'').toLowerCase();
      if (['qcm','single','radio','choice','select-one','multiple_choice','scale'].includes(x)) return 'single';
      if (['qcm_multiple','multi','checkbox','select-multiple'].includes(x)) return 'multi';
      return 'skip';
    };
    const qdefs: QDef[] = rawQuestions.map((it: any, idx: number) => {
      const key: string = it.id || it.key || `q_${idx}`;
      const label: string = it.intitule || it.question || it.label || it.question_text || `Question ${idx + 1}`;
      const t = mapType((it.type || it.kind || it.question_type || '').toString());
      const rawOpts = it.options || it.choix || it.choices || [];
      const options: string[] = Array.isArray(rawOpts)
        ? rawOpts.map((o: any) => typeof o === 'string' ? o : (o.option_text || o.label || o.value || '')).filter((s: string) => !!s)
        : [];
      return { key, label, type: t === 'skip' ? 'single' : t, options } as any; // temp cast, we'll filter
    }).filter((r: any) => r && (r.type === 'single' || r.type === 'multi')) as QDef[];

    // 3) Init counts par option
    const result: {
      totalReponses: number;
      questions: Array<{ label: string; type: 'single'|'multi'; counts: Record<string, number>; options: string[] }>
    } = { totalReponses: answers.length, questions: [] };
    const indexByKey: Record<string, number> = {};
    qdefs.forEach((qd, i) => {
      const counts: Record<string, number> = {};
      (qd.options || []).forEach(opt => counts[opt] = 0);
      result.questions.push({ label: qd.label, type: qd.type, counts, options: qd.options || [] });
      indexByKey[qd.key] = i;
    });

    if (answers.length === 0 || qdefs.length === 0) return result;

    // 4) Parcourir les réponses et incrémenter
    for (const a of answers) {
      let payload: any = null;
      try { payload = a?.jsonAnswers ? JSON.parse(a.jsonAnswers) : null; } catch { payload = null; }
      const map = payload?.answers || payload || {};
      for (const key of Object.keys(map)) {
        const idx = indexByKey[key];
        if (idx === undefined) continue;
        const qd = qdefs[idx];
        const bucket = result.questions[idx].counts;
        const val = map[key];
        if (qd.type === 'single') {
          const sel = typeof val === 'string' ? val : (val?.toString?.() || '');
          if (sel && bucket[sel] !== undefined) bucket[sel] += 1;
        } else if (qd.type === 'multi') {
          const arr = Array.isArray(val) ? val : [];
          arr.forEach((sel: any) => { const s = typeof sel === 'string' ? sel : (sel?.toString?.() || ''); if (s && bucket[s] !== undefined) bucket[s] += 1; });
        }
      }
    }

    return result;
  }
}
