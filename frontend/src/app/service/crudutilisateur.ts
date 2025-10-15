import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur.model';

// Déclare le service comme injectable dans toute l'application
@Injectable({
  providedIn: 'root'
})
export class CRUDUtilisateurService {
  // Tableau local pour stocker les utilisateurs
  private utilisateurs: Utilisateur[] = [];

  // Observable pour notifier les changements
  private utilisateursSubject = new BehaviorSubject<Utilisateur[]>([]);

  // Compteur pour générer des IDs uniques
  private nextId = 1;

  // Renvoie l'observable des utilisateurs
  getUtilisateurs(): Observable<Utilisateur[]> {
    return this.utilisateursSubject.asObservable();
  }

  // Ajoute un nouvel utilisateur
  ajouterUtilisateur(utilisateur: Omit<Utilisateur, 'id'>): void {
    const newUser: Utilisateur = {
      id: this.nextId++,     // Génère un nouvel ID
      ...utilisateur         // Copie les autres champs
    };
    this.utilisateurs.push(newUser); // Ajoute au tableau
    this.emitChange();               // Notifie les abonnés
  }

  // Modifie un utilisateur existant
  modifierUtilisateur(utilisateur: Utilisateur): void {
    const index = this.utilisateurs.findIndex(u => u.id === utilisateur.id);
    if (index !== -1) {
      this.utilisateurs[index] = { ...utilisateur }; // Met à jour
      this.emitChange();                             // Notifie
    }
  }

  // Supprime un utilisateur par son ID
  supprimerUtilisateur(id: number): void {
    this.utilisateurs = this.utilisateurs.filter(u => u.id !== id);
    this.emitChange(); // Notifie les abonnés
  }

  // Met à jour l'observable avec les nouvelles données
  private emitChange(): void {
    this.utilisateursSubject.next([...this.utilisateurs]);
  }
}