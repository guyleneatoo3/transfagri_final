import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Report { id: number; title: string; generatedAt: string; contentJson: string; }

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private base = 'http://localhost:8082/api/reports';
  constructor(private http: HttpClient) {}
  private headers(): HttpHeaders {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
  list(): Observable<Report[]> { return this.http.get<Report[]>(this.base, { headers: this.headers() }); }
  get(id: number): Observable<Report> { return this.http.get<Report>(`${this.base}/${id}`, { headers: this.headers() }); }
  generate(questionnaireId: number): Observable<Report> { return this.http.post<Report>(`${this.base}/generate/${questionnaireId}`, {}, { headers: this.headers() }); }
}
