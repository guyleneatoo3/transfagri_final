import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../service/Utilisateur.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  idutilisateur: number | null = null;
  nom = '';
  email = '';
  role = '';
  message = '';

  constructor(private utilisateurService: UtilisateurService) {
    const storedId = typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null;
    if (storedId) this.idutilisateur = +storedId;
    const storedName = typeof localStorage !== 'undefined' ? localStorage.getItem('name') : null;
    if (storedName) this.nom = storedName;
    const storedEmail = typeof localStorage !== 'undefined' ? localStorage.getItem('utilisateurname') : null;
    if (storedEmail) this.email = storedEmail;
    const storedRole = typeof localStorage !== 'undefined' ? localStorage.getItem('role') : null;
    if (storedRole) this.role = storedRole.replace(/^ROLE_/i, '').toUpperCase();
  }

  save() {
    if (!this.idutilisateur) {
      this.message = "ID utilisateur manquant; contactez l'admin pour modifier votre profil.";
      return;
    }
    const payload: any = { nom: this.nom, email: this.email, role: this.role };
    this.utilisateurService.updateUtilisateur(this.idutilisateur, payload).subscribe({
      next: () => this.message = 'Profil mis à jour.',
      error: () => this.message = 'Erreur lors de la mise à jour.'
    });
  }
}
