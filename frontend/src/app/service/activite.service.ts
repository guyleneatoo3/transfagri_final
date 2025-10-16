import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:8082/api/activites';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  getAll(): Observable<Activite[]> {
    return this.http.get<Activite[]>(this.apiUrl, { headers: this.authHeaders() });
  }

  getById(id: number): Observable<Activite> {
    return this.http.get<Activite>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  create(activite: Activite): Observable<Activite> {
    return this.http.post<Activite>(this.apiUrl, activite, { headers: this.authHeaders() });
  }
   
  update(id: number, activite: Activite): Observable<Activite> {
    return this.http.put<Activite>(`${this.apiUrl}/${id}`, activite, { headers: this.authHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }
}
