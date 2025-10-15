import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivateFn } from '@angular/router';

import { inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './service/auth.service';

// Auth guard
export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    const authService = inject(AuthService);
    if (authService.isAuthenticated()) {
      return true;
    } else {
      window.location.href = '/login';
      return false;
    }
  } else {
    return true;
  }
};

export const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'home', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', loadComponent: () => import('./haccueil/haccueil').then(m => m.HaccueilComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./registe/register.component').then(m => m.RegisterComponent) },
  { path: 'contact', loadComponent: () => import('./contact/contact').then(m => m.ContactComponent) },
  { path: 'apropos', loadComponent: () => import('./apropos/apropos').then(m => m.AproposComponent) },
  { path: 'activites', loadComponent: () => import('./gerer-activite/gerer-activite').then(m => m.GererActiviteComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard],
    children: [
      { path: 'utilisateurs', loadComponent: () => import('./gestion-utilisateurs/gestion-utilisateurs').then(m => m.GestionUtilisateursComponent), canActivate: [authGuard] },
      { path: 'indicateurs', loadComponent: () => import('./gestion-indicateurs/gestion-indicateurs').then(m => m.GestionIndicateursComponent), canActivate: [authGuard] },
      { path: 'formation', loadComponent: () => import('./dashboard/gestion-formation').then(m => m.GestionFormationComponent), canActivate: [authGuard] },
    ]
  },
  {
    path: 'dashboard/emf',
    loadComponent: () => import('./dashboard/dashboard-emf').then(m => m.DashboardEmfComponent),
    canActivate: [authGuard],
    children: [
      { path: 'gestion', loadComponent: () => import('./dashboard/gestion-emf').then(m => m.GestionEmfComponent), canActivate: [authGuard] },
  { path: 'questionnaire', loadComponent: () => import('./dashboard/remplir-questionnaire').then(m => m.RemplirQuestionnaireComponent), canActivate: [authGuard] }
    ]
  },
  {
    path: 'dashboard/cnef',
    loadComponent: () => import('./dashboard/dashboard-cnef').then(m => m.DashboardCnefComponent),
    canActivate: [authGuard],
    children: [
      { path: 'emf', loadComponent: () => import('./dashboard/gestion-emf').then(m => m.GestionEmfComponent), canActivate: [authGuard] },
      { path: 'formation', loadComponent: () => import('./dashboard/gestion-formation').then(m => m.GestionFormationComponent), canActivate: [authGuard] },
      { path: 'activites', loadComponent: () => import('./dashboard/gestion-activite').then(m => m.GestionActiviteComponent), canActivate: [authGuard] },
      { path: 'indicateurs', loadComponent: () => import('./dashboard/gestion-indicateurs').then(m => m.GestionIndicateursComponent), canActivate: [authGuard] },
  { path: 'questionnaires', loadComponent: () => import('./dashboard/gestion-questionnaire').then(m => m.GestionQuestionnaireComponent), canActivate: [authGuard] }
    ]
  },
  {
    path: 'dashboard/pasnfi',
    loadComponent: () => import('./dashboard/dashboard-pasnfi').then(m => m.DashboardPasnfiComponent),
    canActivate: [authGuard],
    children: [
  { path: 'rapports', loadComponent: () => import('./dashboard/liste-rapports').then(m => m.ListeRapportsComponent), canActivate: [authGuard] }
    ]
  },
  {
    path: 'dashboard/admin',
    loadComponent: () => import('./dashboard/dashboard-admin').then(m => m.DashboardAdminComponent),
    canActivate: [authGuard],
    children: [
      { path: 'utilisateurs', loadComponent: () => import('./gestion-utilisateurs/gestion-utilisateurs').then(m => m.GestionUtilisateursComponent), canActivate: [authGuard] }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }