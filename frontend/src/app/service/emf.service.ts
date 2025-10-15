import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:8080/api/emfs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<EMF[]> {
    return this.http.get<EMF[]>(this.apiUrl);
  }

  getById(id: number): Observable<EMF> {
    return this.http.get<EMF>(`${this.apiUrl}/${id}`);
  }

  create(emf: EMF): Observable<EMF> {
    return this.http.post<EMF>(this.apiUrl, emf);
  }

  update(id: number, emf: EMF): Observable<EMF> {
    return this.http.put<EMF>(`${this.apiUrl}/${id}`, emf);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(term: string): Observable<EMF[]> {
    return this.http.get<EMF[]>(`${this.apiUrl}?search=${term}`);
  }
}
