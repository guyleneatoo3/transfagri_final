import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilisateurDTO } from '../models/utilisateurDTO';
import { RegisterRequest } from '../models/registerrequest.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private apiUrl = 'http://localhost:8080/api/utilisateurs'; 
  // 🔹 adapte l’URL à ton backend (Spring Boot)

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer tous les utilisateurs
  getAllUtilisateurs(): Observable<UtilisateurDTO[]> {
    return this.http.get<UtilisateurDTO[]>(`${this.apiUrl}`);
  }

  // 🔹 Ajouter un utilisateur
  addUtilisateur(request: RegisterRequest): Observable<UtilisateurDTO> {
    return this.http.post<UtilisateurDTO>(`${this.apiUrl}`, request);
  }

  // 🔹 Modifier un utilisateur
  updateUtilisateur(id: number, request: RegisterRequest): Observable<UtilisateurDTO> {
    return this.http.put<UtilisateurDTO>(`${this.apiUrl}/${id}`, request);
  }

  // 🔹 Supprimer un utilisateur
  deleteUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Récupérer un utilisateur par ID (optionnel si tu veux afficher les détails)
  getUtilisateurById(id: number): Observable<UtilisateurDTO> {
    return this.http.get<UtilisateurDTO>(`${this.apiUrl}/${id}`);
  }
}
