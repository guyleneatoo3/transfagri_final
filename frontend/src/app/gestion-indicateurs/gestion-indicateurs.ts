import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Indicateur {
  id: number;
  libelle: string;
  description: string;
}

@Component({
  selector: 'app-gestion-indicateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-indicateurs.html',
  styleUrls: ['./gestion-indicateurs.css']
})
export class GestionIndicateursComponent {
  indicateurs: Indicateur[] = [];
  nouvelIndicateur: Partial<Indicateur> = {};
  recherche = '';
  descriptionQuestionnaire = '';

  get indicateursFiltres() {
    return this.indicateurs.filter(i =>
      i.libelle?.toLowerCase().includes(this.recherche.toLowerCase())
    );
  }

  creerIndicateur() {
    if (this.nouvelIndicateur.libelle && this.nouvelIndicateur.description) {
      const id = this.indicateurs.length ? Math.max(...this.indicateurs.map(i => i.id)) + 1 : 1;
      this.indicateurs.push({ id, libelle: this.nouvelIndicateur.libelle, description: this.nouvelIndicateur.description });
      this.nouvelIndicateur = {};
    }
  }

  genererQuestionnairePourEMF() {
    if (!this.descriptionQuestionnaire.trim()) {
      console.log('Veuillez rédiger une description pour générer le questionnaire.');
      return;
    }
    // Appel API à faire ici avec la description et les indicateurs
    console.log('Questionnaire généré et envoyé aux EMF (simulation).');
  }
}
