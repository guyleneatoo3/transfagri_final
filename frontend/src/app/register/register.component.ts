import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../service/Utilisateur.service';
import { UtilisateurDTO } from '../models/utilisateurDTO';
import { RegisterRequest } from '../models/registerrequest.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  utilisateurs: UtilisateurDTO[] = [];
  registerForm: FormGroup;
  showEditModal = false;
  isEditMode = false;
  alertMessage = '';
  alertType = '';
  roles = ['ADMIN', 'CNEF', 'EMF', 'PASNFI'];
  selectedUser: UtilisateurDTO | null = null;

  constructor(private utilisateurService: UtilisateurService, private fb: FormBuilder, @Inject(PLATFORM_ID) private platformId: Object) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motdepasse: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('accessToken')) {
      this.loadUtilisateurs();
    }
  }

  loadUtilisateurs(): void {
    this.utilisateurService.getAllUtilisateurs().subscribe({
      next: (data: UtilisateurDTO[]) => this.utilisateurs = data,
      error: () => this.showAlert('Erreur de chargement', 'error')
    });
  }

  openRegisterModal(): void {
    this.isEditMode = false;
    this.registerForm.reset();
    this.showEditModal = true;
    this.selectedUser = null;
  }

  openEditModal(user: UtilisateurDTO): void {
    this.isEditMode = true;
    this.selectedUser = user;
    this.registerForm.patchValue(user);
    this.showEditModal = true;
  }

  openDeleteModal(user: UtilisateurDTO): void {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.utilisateurService.deleteUtilisateur(user.idutilisateur).subscribe({
        next: () => {
          this.showAlert('Utilisateur supprimé', 'success');
          this.loadUtilisateurs();
        },
        error: () => this.showAlert('Erreur suppression', 'error')
      });
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    const formValue = this.registerForm.value;
    const roleValue: string = typeof formValue.role === 'string' ? formValue.role : String(formValue.role);
    const normalizedRole = roleValue.startsWith('ROLE_') ? roleValue : `ROLE_${roleValue}`;
    const request: RegisterRequest = {
      email: formValue.email,
      motdepasse: formValue.motdepasse,
      role: normalizedRole as any,
      nom: formValue.nom
    };
    console.debug('Submitting RegisterRequest', request);
    if (this.isEditMode && this.selectedUser) {
      this.utilisateurService.updateUtilisateur(this.selectedUser.idutilisateur, request).subscribe({
        next: () => {
          this.showAlert('Utilisateur modifié', 'success');
          if (isPlatformBrowser(this.platformId) && localStorage.getItem('accessToken')) {
            this.loadUtilisateurs();
          }
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Erreur modification utilisateur:', err);
          this.showAlert(`Erreur modification${err?.status ? ' (' + err.status + ')' : ''}`, 'error');
        }
      });
    } else {
      this.utilisateurService.addUtilisateur(request).subscribe({
        next: () => {
          this.showAlert('Utilisateur ajouté', 'success');
          if (isPlatformBrowser(this.platformId) && localStorage.getItem('accessToken')) {
            this.loadUtilisateurs();
          }
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Erreur ajout utilisateur:', err);
          this.showAlert(`Erreur ajout${err?.status ? ' (' + err.status + ')' : ''}`, 'error');
        }
      });
    }
  }

  showAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
      this.alertType = '';
    }, 3000);
  }
}
