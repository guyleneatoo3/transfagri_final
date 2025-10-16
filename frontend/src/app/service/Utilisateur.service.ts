import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../models/registerrequest.model';  
import { Utilisateur } from '../models/utilisateur.model';
import { UtilisateurDTO } from '../models/utilisateurDTO';


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  addUtilisateur(registerRequest: RegisterRequest): Observable<any> {
    // Endpoint public: ne pas envoyer d'en-tête Authorization
    const authUrl = 'http://localhost:8082/api/v1/auth/register';
    console.debug('Register Request:', registerRequest);
    return this.http.post<any>(authUrl, registerRequest);
  }
  

  private apiUrl = 'http://localhost:8082/api/utilisateurs';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  private getAuthHeaders(): HttpHeaders {
    // Avoid accessing localStorage during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders();
    }
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return new HttpHeaders();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAllUtilisateurs(): Observable<UtilisateurDTO[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<UtilisateurDTO[]>(`${this.apiUrl}`, { headers });
  }

  getUtilisateurById(idUtilisateur: number): Observable<Utilisateur> {
    const headers = this.getAuthHeaders();
    return this.http.get<Utilisateur>(`${this.apiUrl}/${idUtilisateur}`, { headers });
  }
  
  updateUtilisateur(idUtilisateur: number, Utilisateur: RegisterRequest): Observable<UtilisateurDTO> {
    const headers = this.getAuthHeaders();
    return this.http.put<UtilisateurDTO>(`${this.apiUrl}/${idUtilisateur}`, Utilisateur, { headers });
  }

  deleteUtilisateur(idUtilisateur: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${idUtilisateur}`, { headers });
  }

  
}
