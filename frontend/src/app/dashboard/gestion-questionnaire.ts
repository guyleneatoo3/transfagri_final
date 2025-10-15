
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionnaireService, Questionnaire } from '../service/questionnaire.service';

@Component({
  selector: 'app-gestion-questionnaire',
  templateUrl: './gestion-questionnaire.html',
  styleUrls: ['./gestion-questionnaire.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GestionQuestionnaireComponent {
  questionnaires: Questionnaire[] = [];
  titre = '';
  description = '';
  message = '';

  constructor(private questionnaireService: QuestionnaireService) {}

  genererQuestionnaire() {
    if (!this.titre || !this.description) {
      this.message = 'Veuillez remplir le titre et la description.';
      return;
    }
    this.questionnaireService.generateQuestionnaire(this.titre, this.description).subscribe({
      next: (q) => {
        this.questionnaires.push(q);
        this.message = 'Questionnaire généré avec succès !';
        this.titre = '';
        this.description = '';
      },
      error: () => {
        this.message = 'Erreur lors de la génération du questionnaire.';
      }
    });
  }
}