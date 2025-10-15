import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-remplir-questionnaire',
  templateUrl: './remplir-questionnaire.html',
  styleUrls: ['./remplir-questionnaire.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RemplirQuestionnaireComponent {
  questionnaire = {
    titre: 'Questionnaire reçu',
    questions: [
      { id: 1, texte: 'Question 1 ?', reponse: '' },
      { id: 2, texte: 'Question 2 ?', reponse: '' }
    ]
  };
  message = '';

  submit() {
    // Ici, tu appellerais le backend pour soumettre les réponses
    this.message = 'Questionnaire soumis avec succès !';
  }
}