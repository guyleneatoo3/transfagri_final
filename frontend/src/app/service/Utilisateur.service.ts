import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../models/registerrequest.model';  
import { Utilisateur } from '../models/utilisateur.model';
import { UtilisateurDTO } from '../models/utilisateurDTO';


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  addUtilisateur(registerRequest: RegisterRequest) {
    throw new Error('Method not implemented.');
  }
  

  private apiUrl = 'http://localhost:8082/api/Utilisateurs';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
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
