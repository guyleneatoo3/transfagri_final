
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiviteService, Activite } from '../service/activite.service';

@Component({
  selector: 'app-gerer-activite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerer-activite.html',
  styleUrls: ['./gerer-activite.css']
})
export class GererActiviteComponent implements OnInit {
  activites: Activite[] = [];
  activite: Partial<Activite> = {};
  editMode = false;
  editId: number | null = null;

  statutOptions = [
    { value: 'Terminé', label: 'Terminé' },
    { value: 'En cours', label: 'En cours' },
    { value: 'En retard', label: 'En retard' }
  ];

  constructor(private activiteService: ActiviteService) {}

  ngOnInit() {
    this.loadActivites();
  }

  loadActivites() {
    this.activiteService.getAll().subscribe(data => this.activites = data);
  }

  onSubmit() {
    if (this.editMode && this.editId !== null) {
      this.activiteService.update(this.editId, this.activite as Activite).subscribe(() => {
        this.loadActivites();
        this.cancelEdit();
      });
    } else {
      this.activiteService.create(this.activite as Activite).subscribe(() => {
        this.loadActivites();
        this.activite = {};
      });
    }
  }

  editActivite(act: Activite) {
    this.editMode = true;
    this.editId = act.id!;
    this.activite = {
      nom: act.nom,
      description: act.description,
      emfAssigne: act.emfAssigne,
      statut: act.statut,
      dateEcheance: act.dateEcheance
    };
  }

  deleteActivite(act: Activite) {
    this.activiteService.delete(act.id!).subscribe(() => {
      this.loadActivites();
      if (this.editId === act.id) this.cancelEdit();
    });
  }

  cancelEdit() {
    this.editMode = false;
    this.editId = null;
    this.activite = {};
  }
}
