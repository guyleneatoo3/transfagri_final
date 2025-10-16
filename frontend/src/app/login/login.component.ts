import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationRequest } from '../models/authenticationrequest.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: AuthenticationRequest = {
    email: '',
    motdepasse: ''
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.authService.authenticate(this.loginForm).subscribe(
      (response) => {
        // Redirection selon le rôle
        this.successMessage = 'Connexion réussie ! Redirection en cours...';
  let dashboardRoute = '/accueil';
        if (response && response.role) {
          // Normalise le rôle (enlève ROLE_ et met en majuscules)
          let role = response.role.toUpperCase();
          if (role.startsWith('ROLE_')) {
            role = role.replace('ROLE_', '');
          }
          console.log('Rôle de l\'utilisateur :', role);
          switch (role) {
            case 'ADMIN':
              dashboardRoute = '/dashboard/admin';
              break;
            case 'CNEF':
              dashboardRoute = '/dashboard/cnef';
              break;
            case 'EMF':
              dashboardRoute = '/dashboard/emf';
              break;
            case 'PASNFI':
              dashboardRoute = '/dashboard/pasnfi';
              break;
            default:
              dashboardRoute = '/accueil';
          }
        }
        setTimeout(() => {
          this.router.navigate([dashboardRoute]);
        }, 1200);
      },
      (error: any) => {
        console.error('Erreur lors de la connexion :', error);
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
        this.clearMessages();
      }
    );
  }

  clearMessages(): void {
    // Efface les messages après 5 secondes
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }


}
