import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Questionnaire {
  id?: number;
  titre: string;
  description: string;
  questions?: any[];
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class QuestionnaireService {
  private apiUrl = 'http://localhost:8080/api/questionnaires';

  constructor(private http: HttpClient) {}

  generateQuestionnaire(titre: string, description: string): Observable<Questionnaire> {
    const body = { titre, description };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Questionnaire>(`${this.apiUrl}/generate`, body, { headers });
  }

  // Ajoute d'autres méthodes si besoin (getAll, getById, etc.)
}
