import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-haccueil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './haccueil.html',
  styleUrls: ['./haccueil.css']

})
export class HaccueilComponent {
  currentYear = new Date().getFullYear();

  // Données factices pour la liste des activités
  activites = signal([
    { id: 1, nom: 'Formation en gestion de crédit', emf: 'Crédit du Sahel', statut: 'Terminé', echeance: '15/09/2025' },
    { id: 2, nom: 'Déploiement du nouveau logiciel', emf: 'Finance Populaire', statut: 'En cours', echeance: '30/09/2025' },
    { id: 3, nom: 'Audit de performance trimestriel', emf: 'Express Union', statut: 'En cours', echeance: '05/10/2025' },
    { id: 4, nom: 'Rapport de suivi mensuel', emf: 'CEC S.A.', statut: 'En retard', echeance: '20/09/2025' },
    { id: 5, nom: 'Atelier sur les produits verts', emf: 'Crédit Communautaire', statut: 'Terminé', echeance: '10/09/2025' },
  ]);

  constructor() {
    // Logique d'initialisation si nécessaire
  }
}
