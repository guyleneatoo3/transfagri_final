import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EMF {
  id?: number;
  denomination: string;
  localisation: string;
  dirigeant: string;
  numeroDAgrement: string;
  numeroCNC: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class EmfService {
  private apiUrl = 'http://localhost:8082/api/emfs';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  getAll(): Observable<EMF[]> {
    return this.http.get<EMF[]>(this.apiUrl, { headers: this.authHeaders() });
  }

  getById(id: number): Observable<EMF> {
    return this.http.get<EMF>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  create(emf: EMF): Observable<EMF> {
    return this.http.post<EMF>(this.apiUrl, emf, { headers: this.authHeaders() });
  }

  update(id: number, emf: EMF): Observable<EMF> {
    return this.http.put<EMF>(`${this.apiUrl}/${id}`, emf, { headers: this.authHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  search(term: string): Observable<EMF[]> {
    return this.http.get<EMF[]>(`${this.apiUrl}?search=${term}`, { headers: this.authHeaders() });
  }
}
