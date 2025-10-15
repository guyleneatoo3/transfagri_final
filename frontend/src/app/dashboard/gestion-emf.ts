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

  constructor(private emfService: EmfService) {}

  ngOnInit() {
    this.loadEmfs();
  }

  loadEmfs() {
    this.emfService.getAll().subscribe(data => this.emfs = data);
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
    this.emfService.create(this.newEmf).subscribe(() => {
      this.loadEmfs();
      this.clearSelection();
    });
  }

  updateEmf() {
    if (this.selectedEmf && this.selectedEmf.id) {
      this.emfService.update(this.selectedEmf.id, this.selectedEmf).subscribe(() => {
        this.loadEmfs();
        this.clearSelection();
      });
    }
  }

  deleteEmf(emf: EMF) {
    if (emf.id) {
      this.emfService.delete(emf.id).subscribe(() => this.loadEmfs());
    }
  }

  searchEmf() {
    if (this.searchTerm.trim()) {
      this.emfService.search(this.searchTerm).subscribe(data => this.emfs = data);
    } else {
      this.loadEmfs();
    }
  }

  // Pour le binding des champs du formulaire
  getFormEmf() {
    return this.isEditing && this.selectedEmf ? this.selectedEmf : this.newEmf;
  }
}