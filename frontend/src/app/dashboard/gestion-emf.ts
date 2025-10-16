import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmfService, EMF } from '../service/emf.service';

@Component({
  selector: 'app-gestion-emf',
  templateUrl: './gestion-emf.html',
  styleUrls: ['./gestion-emf.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GestionEmfComponent implements OnInit {
  emfs: EMF[] = [];
  selectedEmf: EMF | null = null;
  searchTerm: string = '';
  newEmf: EMF = { denomination: '', localisation: '', dirigeant: '', numeroDAgrement: '', numeroCNC: '', email: '' };
  isEditing: boolean = false;
  loading = false;
  error: string | null = null;

  constructor(private emfService: EmfService) {}

  ngOnInit() {
    this.loadEmfs();
  }

  loadEmfs() {
    this.loading = true; this.error = null;
    this.emfService.getAll().subscribe({
      next: data => { this.emfs = data; this.loading = false; },
      error: err => { this.error = 'Impossible de charger les EMF.'; this.loading = false; console.error(err); }
    });
  }

  selectEmf(emf: EMF) {
    this.selectedEmf = { ...emf };
    this.isEditing = true;
  }

  clearSelection() {
    this.selectedEmf = null;
    this.isEditing = false;
    this.newEmf = { denomination: '', localisation: '', dirigeant: '', numeroDAgrement: '', numeroCNC: '', email: '' };
  }

  addEmf() {
    this.error = null; this.loading = true;
    this.emfService.create(this.newEmf).subscribe({
      next: () => { this.loadEmfs(); this.clearSelection(); this.loading = false; },
      error: err => { this.error = 'Échec de l\'ajout.'; this.loading = false; console.error(err); }
    });
  }

  updateEmf() {
    if (this.selectedEmf && this.selectedEmf.id) {
      this.error = null; this.loading = true;
      this.emfService.update(this.selectedEmf.id, this.selectedEmf).subscribe({
        next: () => { this.loadEmfs(); this.clearSelection(); this.loading = false; },
        error: err => { this.error = 'Échec de la mise à jour.'; this.loading = false; console.error(err); }
      });
    }
  }

  deleteEmf(emf: EMF) {
    if (emf.id) {
      if (!confirm('Supprimer cet EMF ?')) return;
      this.error = null; this.loading = true;
      this.emfService.delete(emf.id).subscribe({
        next: () => { this.loadEmfs(); this.loading = false; },
        error: err => { this.error = 'Échec de la suppression.'; this.loading = false; console.error(err); }
      });
    }
  }

  searchEmf() {
    if (this.searchTerm.trim()) {
      this.loading = true; this.error = null;
      this.emfService.search(this.searchTerm).subscribe({
        next: data => { this.emfs = data; this.loading = false; },
        error: err => { this.error = 'Échec de la recherche.'; this.loading = false; console.error(err); }
      });
    } else {
      this.loadEmfs();
    }
  }

  // plus de getFormEmf; on bind séparément newEmf vs selectedEmf
}