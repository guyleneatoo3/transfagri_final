import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmfService, EMF } from '../service/emf.service';

@Component({
  selector: 'app-emf-gestion',
  templateUrl: './emf-gestion.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EmfGestionComponent {
  emfs: EMF[] = [];
  searchTerm = '';

  constructor(private emfService: EmfService) {
    this.loadEmfs();
  }

  loadEmfs() {
    this.emfService.getAll().subscribe(data => this.emfs = data);
  }

  search() {
    this.emfService.search(this.searchTerm).subscribe(data => this.emfs = data);
  }

  addEmf() {
    // Ouvre un formulaire ou modale pour ajouter un EMF
  }

  editEmf(emf: EMF) {
    // Ouvre un formulaire ou modale pour modifier l'EMF
  }

  deleteEmf(id: number) {
    this.emfService.delete(id).subscribe(() => this.loadEmfs());
  }
}
