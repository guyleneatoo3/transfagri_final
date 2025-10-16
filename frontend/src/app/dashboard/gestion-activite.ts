import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiviteService, Activite } from '../service/activite.service';

@Component({
  selector: 'app-gestion-activite',
  templateUrl: './gestion-activite.html',
  styleUrls: ['./gestion-activite.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GestionActiviteComponent implements OnInit {
  activites: Activite[] = [];
  selectedActivite: Activite | null = null;
  newActivite: Activite = { nom: '', description: '', emfAssigne: '', statut: 'En cours', dateEcheance: '' };
  isEditing: boolean = false;
  loading = false;
  error: string | null = null;

  constructor(private activiteService: ActiviteService) {}

  ngOnInit() {
    this.loadActivites();
  }

  loadActivites() {
    this.loading = true; this.error = null;
    this.activiteService.getAll().subscribe({
      next: data => { this.activites = data; this.loading = false; },
      error: err => { this.error = 'Impossible de charger les activités.'; this.loading = false; console.error(err); }
    });
  }

  selectActivite(activite: Activite) {
    this.selectedActivite = { ...activite };
    this.isEditing = true;
  }

  clearSelection() {
    this.selectedActivite = null;
    this.isEditing = false;
    this.newActivite = { nom: '', description: '', emfAssigne: '', statut: 'En cours', dateEcheance: '' };
  }

  addActivite() {
    this.loading = true; this.error = null;
    this.activiteService.create(this.newActivite).subscribe({
      next: () => { this.loadActivites(); this.clearSelection(); this.loading = false; },
      error: err => { this.error = 'Échec de l\'ajout.'; this.loading = false; console.error(err); }
    });
  }

  updateActivite() {
    if (this.selectedActivite && this.selectedActivite.id) {
      this.loading = true; this.error = null;
      this.activiteService.update(this.selectedActivite.id, this.selectedActivite).subscribe({
        next: () => { this.loadActivites(); this.clearSelection(); this.loading = false; },
        error: err => { this.error = 'Échec de la mise à jour.'; this.loading = false; console.error(err); }
      });
    }
  }

  deleteActivite(activite: Activite) {
    if (activite.id) {
      if (!confirm('Supprimer cette activité ?')) return;
      this.loading = true; this.error = null;
      this.activiteService.delete(activite.id).subscribe({
        next: () => { this.loadActivites(); this.loading = false; },
        error: err => { this.error = 'Échec de la suppression.'; this.loading = false; console.error(err); }
      });
    }
  }

  // plus de getFormActivite; on bind séparément newActivite vs selectedActivite
}
