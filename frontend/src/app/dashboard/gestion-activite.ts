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

  constructor(private activiteService: ActiviteService) {}

  ngOnInit() {
    this.loadActivites();
  }

  loadActivites() {
    this.activiteService.getAll().subscribe(data => this.activites = data);
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
    this.activiteService.create(this.newActivite).subscribe(() => {
      this.loadActivites();
      this.clearSelection();
    });
  }

  updateActivite() {
    if (this.selectedActivite && this.selectedActivite.id) {
      this.activiteService.update(this.selectedActivite.id, this.selectedActivite).subscribe(() => {
        this.loadActivites();
        this.clearSelection();
      });
    }
  }

  deleteActivite(activite: Activite) {
    if (activite.id) {
      this.activiteService.delete(activite.id).subscribe(() => this.loadActivites());
    }
  }

  getFormActivite() {
    return this.isEditing && this.selectedActivite ? this.selectedActivite : this.newActivite;
  }
}
