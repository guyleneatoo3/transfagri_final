import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Utilisateur {
  id: number;
  denomination: string;
  localisation: string;
  Dirigeant: string;
  Numero_d_agreement: string;
  d_imatriculation_au_CNC: string;
  email: string;
}

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-utilisateurs.html',
  styleUrls: ['./gestion-utilisateurs.css']
})
export class GestionUtilisateursComponent {
  utilisateurs: Utilisateur[] = [
    { id: 1, denomination: 'CEFA', localisation: 'B.P.98 Ngaoundere', Dirigeant: 'EBODE', Numero_d_agreement: '000404/MINFI', d_imatriculation_au_CNC: 'EMF/2010/0004', email: '' },
    { id: 2, denomination: 'NGACCUL', localisation: 'Ngaoundere', Dirigeant: 'ASAH', Numero_d_agreement: '', d_imatriculation_au_CNC: '', email: '' }
  ];

  recherche = '';
  nouvelUtilisateur: Partial<Utilisateur> = {};
  utilisateurEnEdition: Utilisateur | null = null;

  get utilisateursFiltres() {
    const rechercheLower = this.recherche.toLowerCase();
    return this.utilisateurs.filter(u =>
      u.denomination.toLowerCase().includes(rechercheLower) ||
      u.localisation.toLowerCase().includes(rechercheLower) ||
      u.Dirigeant.toLowerCase().includes(rechercheLower) ||
      u.Numero_d_agreement.toLowerCase().includes(rechercheLower) ||
      u.d_imatriculation_au_CNC.toLowerCase().includes(rechercheLower) ||
      u.email.toLowerCase().includes(rechercheLower)
    );
  }

  creerUtilisateur() {
    if (this.nouvelUtilisateur.denomination && this.nouvelUtilisateur.email) {
      const id = this.utilisateurs.length ? Math.max(...this.utilisateurs.map(u => u.id)) + 1 : 1;
      this.utilisateurs.push({
        id,
        denomination: this.nouvelUtilisateur.denomination,
        localisation: this.nouvelUtilisateur.localisation || '',
        Dirigeant: this.nouvelUtilisateur.Dirigeant || '',
        Numero_d_agreement: this.nouvelUtilisateur.Numero_d_agreement || '',
        d_imatriculation_au_CNC: this.nouvelUtilisateur.d_imatriculation_au_CNC || '',
        email: this.nouvelUtilisateur.email
      });
      this.nouvelUtilisateur = {};
    }
  }

  modifierUtilisateur(utilisateur: Utilisateur) {
    this.utilisateurEnEdition = { ...utilisateur };
  }

  enregistrerModification() {
    if (this.utilisateurEnEdition) {
      const index = this.utilisateurs.findIndex(u => u.id === this.utilisateurEnEdition!.id);
      if (index !== -1) {
        this.utilisateurs[index] = this.utilisateurEnEdition;
      }
      this.utilisateurEnEdition = null;
    }
  }

  annulerModification() {
    this.utilisateurEnEdition = null;
  }

  supprimerUtilisateur(id: number) {
    this.utilisateurs = this.utilisateurs.filter(u => u.id !== id);
  }
}
