import { Component, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionnaireService, Questionnaire } from '../service/questionnaire.service';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-emf-repondre-questionnaire',
  templateUrl: './emf-repondre-questionnaire.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EmfRepondreQuestionnaireComponent {
  shared: Questionnaire[] = [];
  selected: Questionnaire | null = null;
  answers: any = {};
  message = '';
  // Map of questionnaireId -> already answered by current EMF
  answeredById: Record<number, boolean> = {};
  parsedQuestions: Array<{
    key: string;
    index: number;
    label: string;
    type: 'single' | 'multi' | 'text' | 'number' | 'date';
    options: string[];
    required: boolean;
  }> = [];
  submittedAttempt = false;

  private isBrowser = false;

  constructor(private qs: QuestionnaireService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) this.refresh();
  }

  refresh() {
    this.qs.listShared().subscribe(list => {
      this.shared = list;
      // Prefetch answered status per questionnaire
      this.answeredById = {};
      list.forEach(q => {
        if (q.id) {
          this.qs.answeredByMe(q.id).subscribe({
            next: (ans) => { if (q.id != null) this.answeredById[q.id] = !!ans; },
            error: () => {}
          });
        }
      });
    });
  }

  open(q: Questionnaire) {
    // If already answered, don't open the form
    if (q.id && this.answeredById[q.id]) {
      this.message = 'Questionnaire envoyé avec succès.';
      this.selected = null;
      return;
    }
    // Clear any previous success/error message for a fresh attempt
    this.message = '';
    this.selected = q;
    // Initialize answers structure
    try {
      const content = q.jsonContent ? JSON.parse(q.jsonContent) : null;
      // Support both our older schema and the Mistral JSON (question_text/question_type/options as objects)
      const rawQuestions: any[] = Array.isArray(content)
        ? content
        : (content?.questions || content?.questionnaire?.questions || []);
      const norm: Array<{ key: string; index: number; label: string; type: any; options: string[]; required: boolean; }> = [];
      this.answers = {};
      rawQuestions.forEach((it: any, idx: number) => {
        const key: string = it.id || it.key || `q_${idx}`;
        const label: string = it.intitule || it.question || it.label || it.question_text || `Question ${idx + 1}`;
        const t = (it.type || it.kind || it.question_type || '').toString().toLowerCase();
        let type: 'single' | 'multi' | 'text' | 'number' | 'date' = 'text';
  if (['qcm', 'single', 'radio', 'choice', 'select-one', 'multiple_choice', 'scale'].includes(t)) type = 'single';
  else if (['qcm_multiple', 'multi', 'checkbox', 'select-multiple'].includes(t)) type = 'multi';
        else if (['qro', 'text', 'textarea', 'open', 'string'].includes(t)) type = 'text';
        else if (['number', 'numeric'].includes(t)) type = 'number';
        else if (['date', 'datetime', 'day'].includes(t)) type = 'date';
        // Normalize options: can be array of strings or array of objects { option_text, value }
        let options: string[] = [];
        const rawOpts = it.options || it.choix || it.choices || [];
        if (Array.isArray(rawOpts)) {
          options = rawOpts.map((o: any) => typeof o === 'string' ? o : (o.option_text || o.label || o.value || ''))
                           .filter((s: string) => !!s);
        }
        const required: boolean = !!(it.required || it.obligatoire || false);

        norm.push({ key, index: idx + 1, label, type, options, required });

        // Defaults per type
        if (type === 'single') this.answers[key] = null;
        else if (type === 'multi') this.answers[key] = [] as string[];
        else if (type === 'number') this.answers[key] = null;
        else if (type === 'date') this.answers[key] = '';
        else this.answers[key] = '';
      });
      this.parsedQuestions = norm;
      this.submittedAttempt = false;
      // Vérifie si déjà répondu
      if (q.id) {
        this.qs.answeredByMe(q.id).subscribe({
          next: (ans) => {
            if (ans) {
              this.message = 'Questionnaire envoyé avec succès.';
              // reflect state in the list map too
              if (q.id != null) this.answeredById[q.id] = true;
              // close the form since it was already answered
              this.selected = null;
            }
          },
          error: () => {}
        });
      }
    } catch (_) {
      this.answers = {};
      this.parsedQuestions = [];
    }
  }

  submit() {
    if (!this.selected || !this.selected.id) return;
    // Validate required
    this.submittedAttempt = true;
    const missing = this.parsedQuestions.filter(q => {
      const val = this.answers[q.key];
      if (!q.required) return false;
      if (q.type === 'single') return val === null || val === undefined || val === '';
      if (q.type === 'multi') return !Array.isArray(val) || val.length === 0;
      return val === null || val === undefined || (typeof val === 'string' && val.trim() === '');
    });
    if (missing.length > 0) {
      this.message = 'Veuillez répondre à toutes les questions obligatoires.';
      return;
    }
    this.qs.submitAnswers(this.selected.id, { answers: this.answers }).subscribe({
      next: () => {
        this.message = 'Questionnaire envoyé avec succès.';
        if (this.selected?.id != null) this.answeredById[this.selected.id] = true;
        this.selected = null;
        this.refresh();
      },
      error: (err) => {
        if (err && err.status === 409) {
          this.message = 'Questionnaire envoyé avec succès.';
          if (this.selected?.id != null) this.answeredById[this.selected.id] = true;
          this.selected = null;
          this.refresh();
        } else {
          this.message = 'Erreur lors de l\'envoi des réponses.';
        }
      }
    });
  }

  toggleMulti(qKey: string, option: string) {
    const arr: string[] = this.answers[qKey] || [];
    const idx = arr.indexOf(option);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(option);
    this.answers[qKey] = [...arr];
  }
}
