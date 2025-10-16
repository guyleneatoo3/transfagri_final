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

// Role guard
export const roleGuard: CanActivateFn = (route) => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) return true; // allow during SSR
  const roles = (route.data?.['roles'] as string[]) || [];
  if (roles.length === 0) return true;
  const authService = inject(AuthService);
  return roles.some(r => authService.hasRole(r));
};

export const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'home', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', loadComponent: () => import('./haccueil/haccueil').then(m => m.HaccueilComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
  { path: 'contact', loadComponent: () => import('./contact/contact').then(m => m.ContactComponent) },
  { path: 'apropos', loadComponent: () => import('./apropos/apropos').then(m => m.AproposComponent) },
  { path: 'activites', loadComponent: () => import('./gerer-activite/gerer-activite').then(m => m.GererActiviteComponent) },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent), canActivate: [authGuard] },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard],
    children: [
      // Remove generic users management here; admin dashboard handles it exclusively
      // Limit generic formation route to CNEF only (upload)
      { path: 'formation', loadComponent: () => import('./dashboard/gestion-formation').then(m => m.GestionFormationComponent), canActivate: [authGuard, roleGuard], data: { roles: ['CNEF'] } },
    ]
  },
  {
    path: 'dashboard/emf',
    loadComponent: () => import('./dashboard/dashboard-emf').then(m => m.DashboardEmfComponent),
    canActivate: [authGuard, roleGuard], data: { roles: ['EMF'] },
    children: [
      { path: 'questionnaire', loadComponent: () => import('./dashboard/emf-repondre-questionnaire').then(m => m.EmfRepondreQuestionnaireComponent), canActivate: [authGuard] }
      ,{ path: 'formations', loadComponent: () => import('./dashboard/emf-formations').then(m => m.EmfFormationsComponent), canActivate: [authGuard] }
    ]
  },
  {
    path: 'dashboard/cnef',
    loadComponent: () => import('./dashboard/dashboard-cnef').then(m => m.DashboardCnefComponent),
    canActivate: [authGuard, roleGuard], data: { roles: ['CNEF'] },
    children: [
      { path: 'emf', loadComponent: () => import('./dashboard/gestion-emf').then(m => m.GestionEmfComponent), canActivate: [authGuard] },
      { path: 'formation', loadComponent: () => import('./dashboard/gestion-formation').then(m => m.GestionFormationComponent), canActivate: [authGuard] },
      { path: 'activites', loadComponent: () => import('./dashboard/gestion-activite').then(m => m.GestionActiviteComponent), canActivate: [authGuard] },
      { path: 'indicateurs', loadComponent: () => import('./dashboard/gestion-indicateurs').then(m => m.GestionIndicateursComponent), canActivate: [authGuard] },
  { path: 'questionnaires', loadComponent: () => import('./dashboard/gestion-questionnaire').then(m => m.GestionQuestionnaireComponent), canActivate: [authGuard] },
  { path: 'tendances', loadComponent: () => import('./dashboard/tendances-questionnaires').then(m => m.TendancesQuestionnairesComponent), canActivate: [authGuard] }
    ]
  },
  {
    path: 'dashboard/pasnfi',
    loadComponent: () => import('./dashboard/dashboard-pasnfi').then(m => m.DashboardPasnfiComponent),
    canActivate: [authGuard, roleGuard], data: { roles: ['PASNFI'] },
    children: [
  { path: 'rapports', loadComponent: () => import('./dashboard/liste-rapports').then(m => m.ListeRapportsComponent), canActivate: [authGuard] },
  { path: 'rapports/:id', loadComponent: () => import('./dashboard/rapport-detail').then(m => m.RapportDetailComponent), canActivate: [authGuard] }
    ]
  },
  {
    path: 'dashboard/admin',
    loadComponent: () => import('./dashboard/dashboard-admin').then(m => m.DashboardAdminComponent),
    canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] },
    children: [
      { path: 'utilisateurs', loadComponent: () => import('./gestion-utilisateurs/gestion-utilisateurs').then(m => m.GestionUtilisateursComponent), canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] } }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }