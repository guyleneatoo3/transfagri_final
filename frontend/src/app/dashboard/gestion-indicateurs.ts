import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IndicateurService, Indicateur } from '../service/indicateur';

@Component({
  selector: 'app-gestion-indicateurs',
  templateUrl: './gestion-indicateurs.html',
  styleUrls: ['./gestion-indicateurs.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GestionIndicateursComponent implements OnInit {
  indicateurs: Indicateur[] = [];
  selectedIndicateur: Indicateur | null = null;
  newIndicateur: Indicateur = { libelle: '', description: '' };
  isEditing: boolean = false;
  mistralPrompt: string = '';
  mistralResponse: string = '';

  constructor(private indicateurService: IndicateurService) {}

  ngOnInit() {
    this.loadIndicateurs();
  }

  loadIndicateurs() {
    this.indicateurService.getIndicateurs().subscribe(data => this.indicateurs = data);
  }

  selectIndicateur(indicateur: Indicateur) {
    this.selectedIndicateur = { ...indicateur };
    this.isEditing = true;
  }

  clearSelection() {
    this.selectedIndicateur = null;
    this.isEditing = false;
    this.newIndicateur = { libelle: '', description: '' };
  }

  addIndicateur() {
    this.indicateurService.addIndicateur(this.newIndicateur).subscribe(() => {
      this.loadIndicateurs();
      this.clearSelection();
    });
  }

  updateIndicateur() {
    if (this.selectedIndicateur && this.selectedIndicateur.id) {
      this.indicateurService.updateIndicateur(this.selectedIndicateur).subscribe(() => {
        this.loadIndicateurs();
        this.clearSelection();
      });
    }
  }

  deleteIndicateur(indicateur: Indicateur) {
    if (indicateur.id) {
      this.indicateurService.deleteIndicateur(indicateur.id).subscribe(() => this.loadIndicateurs());
    }
  }

  // Simule l'appel à l'API Mistral pour générer un questionnaire
  genererQuestionnaire() {
    // À remplacer par un vrai appel backend
    this.mistralResponse = 'Questionnaire généré pour : ' + this.mistralPrompt;
  }

  getFormIndicateur() {
    return this.isEditing && this.selectedIndicateur ? this.selectedIndicateur : this.newIndicateur;
  }
}
