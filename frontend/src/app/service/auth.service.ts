import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthenticationRequest } from '../models/authenticationrequest.model';
import { AuthenticationResponse } from '../models/authenticationresponse.model';
import { RegisterRequest } from '../models/registerrequest.model';
import { Role } from '../models/registerrequest.model';

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
  private roleSubject = new BehaviorSubject<Role | null>(null);  // Nouveau sujet pour le rôle
  role$ = this.roleSubject.asObservable();  // Observable pour le rôle

  
  
  

  constructor(private http: HttpClient) {
    
    
   }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  register(request: RegisterRequest): Observable<AuthenticationResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/register`, request, { headers });
  }

  authenticate(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/authenticate`, request)
      .pipe(
        tap(response => {
          // Stocker le token JWT dans le localStorage ou sessionStorage
          localStorage.setItem('accessToken', response.token);
          const decodedToken = this.decodeToken(response.token);
          const utilisateurname = decodedToken.sub;
          const role = response.role as Role; 
          localStorage.setItem('utilisateurname', utilisateurname);
          localStorage.setItem('role', role);  
          
          this.utilisateurnameSubject.next(utilisateurname); 
          this.roleSubject.next(role);  
          localStorage.setItem('name', response.name);  // Stocker le nom dans le localStorage
          this.nameSubject.next(response.name);  // Mettre à jour le BehaviorSubject avec le nom
        })
      );
  }

  logout(): void {
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
hasRole(role: Role): boolean {
  const storedRole = localStorage.getItem('role') as Role;
  return storedRole === role;
}

isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken');
}

}
