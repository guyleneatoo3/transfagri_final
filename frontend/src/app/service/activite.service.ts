import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Activite {
  id?: number;
  nom: string;
  description: string;
  emfAssigne: string;
  statut: 'Terminé' | 'En cours' | 'En retard';
  dateEcheance: string; // format: dd/MM/yyyy
}

@Injectable({ providedIn: 'root' })
export class ActiviteService {
  private apiUrl = 'http://localhost:8080/api/activites';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Activite[]> {
    return this.http.get<Activite[]>(this.apiUrl);
  }

  getById(id: number): Observable<Activite> {
    return this.http.get<Activite>(`${this.apiUrl}/${id}`);
  }

  create(activite: Activite): Observable<Activite> {
    return this.http.post<Activite>(this.apiUrl, activite);
  }

  update(id: number, activite: Activite): Observable<Activite> {
    return this.http.put<Activite>(`${this.apiUrl}/${id}`, activite);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
