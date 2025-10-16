import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Questionnaire {
  id?: number;
  titre: string;
  description: string;
  questions?: any[];
  createdAt?: string;
  jsonContent?: string;
  shared?: boolean;
  sharedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class QuestionnaireService {
  private apiUrl = 'http://localhost:8082/api/questionnaires';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = (typeof window !== 'undefined' && typeof localStorage !== 'undefined')
      ? localStorage.getItem('accessToken')
      : null;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }) : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  generateQuestionnaire(titre: string, description: string): Observable<Questionnaire> {
    const body = { titre, description };
    return this.http.post<Questionnaire>(`${this.apiUrl}/generate`, body, { headers: this.authHeaders() });
  }

  list(): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(this.apiUrl, { headers: this.authHeaders() });
  }

  listShared(): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(`${this.apiUrl}/shared`, { headers: this.authHeaders() });
  }

  update(q: Questionnaire): Observable<Questionnaire> {
    return this.http.put<Questionnaire>(`${this.apiUrl}/${q.id}`, q, { headers: this.authHeaders() });
  }

  share(id: number): Observable<Questionnaire> {
    return this.http.post<Questionnaire>(`${this.apiUrl}/${id}/share`, {}, { headers: this.authHeaders() });
  }

  submitAnswers(questionnaireId: number, jsonAnswers: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${questionnaireId}/answers`, jsonAnswers, { headers: this.authHeaders() });
  }

  answeredByMe(questionnaireId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${questionnaireId}/answeredByMe`, { headers: this.authHeaders() });
  }
}
