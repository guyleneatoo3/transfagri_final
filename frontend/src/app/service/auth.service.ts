import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthenticationRequest } from '../models/authenticationrequest.model';
import { AuthenticationResponse } from '../models/authenticationresponse.model';
import { RegisterRequest } from '../models/registerrequest.model';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8082/api/v1/auth';
  private utilisateurnameSubject = new BehaviorSubject<string | null>(null);
  utilisateurname$ = this.utilisateurnameSubject.asObservable();
  private nameSubject = new BehaviorSubject<string | null>(null);
  name$ = this.nameSubject.asObservable();
  private roleSubject = new BehaviorSubject<string | null>(null);  // Nouveau sujet pour le rôle
  role$ = this.roleSubject.asObservable();  // Observable pour le rôle

  
  
  
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getAuthHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) return new HttpHeaders();
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return new HttpHeaders();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  register(request: RegisterRequest): Observable<AuthenticationResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/register`, request, { headers });
  }

  authenticate(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/authenticate`, request)
      .pipe(
        tap(response => {
          if (isPlatformBrowser(this.platformId)) {
            // Stocker le token JWT dans le localStorage ou sessionStorage uniquement côté navigateur
            localStorage.setItem('accessToken', response.token);
            const decodedToken = this.decodeToken(response.token);
            const utilisateurname = decodedToken?.sub ?? null;
            let role = (response.role as unknown as string) || '';
            role = role.toUpperCase();
            if (role.startsWith('ROLE_')) role = role.replace('ROLE_', '');
            if (utilisateurname) {
              localStorage.setItem('utilisateurname', utilisateurname);
              this.utilisateurnameSubject.next(utilisateurname);
            }
            if (role) {
              localStorage.setItem('role', role);
              this.roleSubject.next(role);
            }
            if (response.name) {
              localStorage.setItem('name', response.name);
              this.nameSubject.next(response.name);
            }
          }
        })
      );
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Supprimer les tokens du localStorage ou sessionStorage lors de la déconnexion
    localStorage.removeItem('accessToken');
    localStorage.removeItem('name');
    this.nameSubject.next(null);
    localStorage.removeItem('role'); 
    this.roleSubject.next(null); 
    
    
    
  }

 // Méthode pour décoder le token JWT (base64url)
 private decodeToken(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Erreur lors du décodage du token', e);
    return null;
  }
}
hasRole(role: string): boolean {
  if (!isPlatformBrowser(this.platformId)) return false;
  const storedRoleRaw = localStorage.getItem('role') || '';
  const stored = storedRoleRaw.toUpperCase().replace(/^ROLE_/, '');
  const target = role.toUpperCase().replace(/^ROLE_/, '');
  return stored === target;
}

isAuthenticated(): boolean {
  if (!isPlatformBrowser(this.platformId)) return false;
  return !!localStorage.getItem('accessToken');
}

}
