import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../service/Utilisateur.service';
import { UtilisateurDTO } from '../models/utilisateurDTO';
import { RegisterRequest } from '../models/registerrequest.model';

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-utilisateurs.html',
  styleUrls: ['./gestion-utilisateurs.css']
})
export class GestionUtilisateursComponent implements OnInit {
  utilisateurs: UtilisateurDTO[] = [];
  recherche = '';
  nouvelUtilisateur: Partial<RegisterRequest> = { role: 'ROLE_EMF' };
  utilisateurEnEdition: UtilisateurDTO | null = null;
  selectedRole: string | null = null; // 'CNEF' | 'EMF' | 'PASNFI' | null
  message = '';

  constructor(private api: UtilisateurService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const role = params.get('role');
      this.selectedRole = role ? role.toUpperCase() : null;
      this.load();
    });
  }

  load() {
    this.api.getAllUtilisateurs().subscribe({
      next: (list) => {
        // UtilisateurDTO has fields: idutilisateur, nom, email, role
        this.utilisateurs = list.filter(u => {
          if (!this.selectedRole) return true;
          return (u.role || '').toUpperCase().includes(this.selectedRole!);
        });
      },
      error: () => this.message = 'Erreur lors du chargement des utilisateurs.'
    });
  }

  get utilisateursFiltres() {
    const rechercheLower = this.recherche.toLowerCase();
    return this.utilisateurs.filter(u =>
      (u.nom || '').toLowerCase().includes(rechercheLower) ||
      (u.email || '').toLowerCase().includes(rechercheLower) ||
      (u.role || '').toLowerCase().includes(rechercheLower)
    );
  }

  creerUtilisateur() {
    if (this.nouvelUtilisateur.email && this.nouvelUtilisateur.motdepasse && this.nouvelUtilisateur.role && this.nouvelUtilisateur.nom) {
      const payload: RegisterRequest = {
        email: this.nouvelUtilisateur.email,
        motdepasse: this.nouvelUtilisateur.motdepasse,
        role: this.nouvelUtilisateur.role,
        nom: this.nouvelUtilisateur.nom
      };
      this.api.addUtilisateur(payload).subscribe({
        next: () => { this.message = 'Utilisateur créé.'; this.nouvelUtilisateur = { role: this.nouvelUtilisateur.role }; this.load(); },
        error: () => this.message = 'Erreur lors de la création.'
      });
    }
  }

  modifierUtilisateur(utilisateur: UtilisateurDTO) {
    this.utilisateurEnEdition = { ...utilisateur };
  }

  enregistrerModification() {
    if (!this.utilisateurEnEdition) return;
    const id = this.utilisateurEnEdition.idutilisateur || this.utilisateurEnEdition.id;
    if (!id) return;
    // Backend expects UtilisateurDto { nom, email, motdepasse, role }
    const payload: any = {
      nom: this.utilisateurEnEdition.nom,
      email: this.utilisateurEnEdition.email,
      motdepasse: (this.utilisateurEnEdition as any).motdepasse || '',
      role: this.utilisateurEnEdition.role
    };
    this.api.updateUtilisateur(id, payload).subscribe({
      next: () => { this.message = 'Utilisateur mis à jour.'; this.utilisateurEnEdition = null; this.load(); },
      error: () => this.message = 'Erreur lors de la mise à jour.'
    });
  }

  annulerModification() { this.utilisateurEnEdition = null; }

  setRoleFilter(role: string | null) {
    this.router.navigate([], { queryParams: { role }, queryParamsHandling: 'merge' });
  }

  supprimerUtilisateur(id: number | undefined) {
    if (!id) return;
    this.api.deleteUtilisateur(id).subscribe({
      next: () => { this.message = 'Utilisateur supprimé.'; this.load(); },
      error: () => this.message = 'Erreur lors de la suppression.'
    });
  }
}
