
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionnaireService, Questionnaire } from '../service/questionnaire.service';
import { ReportsService } from '../service/reports.service';

@Component({
  selector: 'app-gestion-questionnaire',
  templateUrl: './gestion-questionnaire.html',
  styleUrls: ['./gestion-questionnaire.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GestionQuestionnaireComponent implements OnInit {
  questionnaires: Questionnaire[] = [];
  titre = '';
  description = '';
  message = '';
  loading = false;
  editing: Questionnaire | null = null;
  showActions = false;

  constructor(private questionnaireService: QuestionnaireService, private reports: ReportsService) {}

  ngOnInit(): void {
    // Charger la liste des questionnaires dès l'ouverture de la page
    this.questionnaireService.list().subscribe({
      next: (list) => this.questionnaires = list,
      error: () => this.message = 'Impossible de récupérer la liste des questionnaires.'
    });
  }

  genererQuestionnaire() {
    if (!this.titre || !this.description) {
      this.message = 'Veuillez remplir le titre et la description.';
      return;
    }
    this.loading = true;
    this.showActions = false;
    this.questionnaireService.generateQuestionnaire(this.titre, this.description).subscribe({
      next: (q) => {
        this.loading = false;
        this.message = 'Questionnaire généré avec succès !';
        this.editing = { ...q };
        this.showActions = true;
        // Refresh list lazily
        this.questionnaireService.list().subscribe(list => this.questionnaires = list);
      },
      error: () => {
        this.loading = false;
        this.message = 'Erreur lors de la génération du questionnaire.';
      }
    });
  }

  modifierSauvegarder() {
    if (!this.editing || !this.editing.id) return;
    this.questionnaireService.update(this.editing).subscribe(q => {
      this.message = 'Questionnaire mis à jour.';
      this.showActions = true;
      this.questionnaireService.list().subscribe(list => this.questionnaires = list);
    });
  }

  partager() {
    if (!this.editing || !this.editing.id) return;
    this.questionnaireService.share(this.editing.id).subscribe(q => {
      this.message = 'Questionnaire partagé avec succès !';
      this.showActions = false;
      this.editing = null;
      this.titre = '';
      this.description = '';
      this.questionnaireService.list().subscribe(list => this.questionnaires = list);
    });
  }

  generateReport(q: Questionnaire) {
    if (!q.id) return;
    this.message = 'Génération du rapport…';
    this.reports.generate(q.id).subscribe({
      next: () => this.message = 'Rapport généré avec succès. Consultez-le côté PASNFI.',
      error: () => this.message = 'Erreur lors de la génération du rapport.'
    });
  }
}