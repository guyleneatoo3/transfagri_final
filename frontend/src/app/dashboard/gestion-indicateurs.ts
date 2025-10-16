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
  newIndicateur: Indicateur = { nom: '', description: '' };
  isEditing: boolean = false;
  loading = false;
  error: string | null = null;
  mistralPrompt: string = '';
  mistralResponse: string = '';

  constructor(private indicateurService: IndicateurService) {}

  ngOnInit() {
    this.loadIndicateurs();
  }

  loadIndicateurs() {
    this.loading = true; this.error = null;
    this.indicateurService.getIndicateurs().subscribe({
      next: data => { this.indicateurs = data; this.loading = false; },
      error: err => { this.error = 'Impossible de charger les indicateurs.'; this.loading = false; console.error(err); }
    });
  }

  selectIndicateur(indicateur: Indicateur) {
    this.selectedIndicateur = { ...indicateur };
    this.isEditing = true;
  }

  clearSelection() {
    this.selectedIndicateur = null;
    this.isEditing = false;
  this.newIndicateur = { nom: '', description: '' };
  }

  addIndicateur() {
    this.loading = true; this.error = null;
    this.indicateurService.addIndicateur(this.newIndicateur).subscribe({
      next: () => { this.loadIndicateurs(); this.clearSelection(); this.loading = false; },
      error: err => { this.error = 'Échec de l\'ajout.'; this.loading = false; console.error(err); }
    });
  }

  updateIndicateur() {
    if (this.selectedIndicateur && this.selectedIndicateur.id) {
      this.loading = true; this.error = null;
      this.indicateurService.updateIndicateur(this.selectedIndicateur).subscribe({
        next: () => { this.loadIndicateurs(); this.clearSelection(); this.loading = false; },
        error: err => { this.error = 'Échec de la mise à jour.'; this.loading = false; console.error(err); }
      });
    }
  }

  deleteIndicateur(indicateur: Indicateur) {
    if (indicateur.id) {
      if (!confirm('Supprimer cet indicateur ?')) return;
      this.loading = true; this.error = null;
      this.indicateurService.deleteIndicateur(indicateur.id).subscribe({
        next: () => { this.loadIndicateurs(); this.loading = false; },
        error: err => { this.error = 'Échec de la suppression.'; this.loading = false; console.error(err); }
      });
    }
  }

  // Simule l'appel à l'API Mistral pour générer un questionnaire
  genererQuestionnaire() {
    // À remplacer par un vrai appel backend
    this.mistralResponse = 'Questionnaire généré pour : ' + this.mistralPrompt;
  }

  // plus de getFormIndicateur; on bind séparément newIndicateur vs selectedIndicateur
}
