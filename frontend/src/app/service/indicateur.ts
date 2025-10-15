import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Indicateur } from '../models/indicateur.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicateurService {
  private apiUrl = 'http://localhost:8080/api/indicateurs';

  constructor(private http: HttpClient) {}

  // 🔍 Récupérer tous les indicateurs
  getIndicateurs(): Observable<Indicateur[]> {
    return this.http.get<Indicateur[]>(this.apiUrl);
  }

  // ➕ Ajouter un indicateur
  addIndicateur(indicateur: Indicateur): Observable<Indicateur> {
    return this.http.post<Indicateur>(this.apiUrl, indicateur);
  }

  // 🔄 Modifier un indicateur
  updateIndicateur(indicateur: Indicateur): Observable<Indicateur> {
    return this.http.put<Indicateur>(`${this.apiUrl}/${indicateur.id}`, indicateur);
  }

  // ❌ Supprimer un indicateur
  deleteIndicateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔍 Rechercher par libellé
  searchIndicateurs(libelle: string): Observable<Indicateur[]> {
    return this.http.get<Indicateur[]>(`${this.apiUrl}?libelle_like=${libelle}`);
  }
}

export { Indicateur };
