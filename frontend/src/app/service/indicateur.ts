import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Indicateur } from '../models/indicateur.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicateurService {
  private apiUrl = 'http://localhost:8082/api/indicateurs';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // 🔍 Récupérer tous les indicateurs
  getIndicateurs(): Observable<Indicateur[]> {
    return this.http.get<Indicateur[]>(this.apiUrl, { headers: this.authHeaders() });
  }

  // ➕ Ajouter un indicateur
  addIndicateur(indicateur: Indicateur): Observable<Indicateur> {
    return this.http.post<Indicateur>(this.apiUrl, indicateur, { headers: this.authHeaders() });
  }

  // 🔄 Modifier un indicateur
  updateIndicateur(indicateur: Indicateur): Observable<Indicateur> {
    return this.http.put<Indicateur>(`${this.apiUrl}/${indicateur.id}`, indicateur, { headers: this.authHeaders() });
  }

  // ❌ Supprimer un indicateur
  deleteIndicateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  // 🔍 Rechercher par nom
  searchIndicateurs(nom: string): Observable<Indicateur[]> {
    // backend expects ?search=term
    return this.http.get<Indicateur[]>(`${this.apiUrl}?search=${encodeURIComponent(nom)}`, { headers: this.authHeaders() });
  }
}

export { Indicateur };
