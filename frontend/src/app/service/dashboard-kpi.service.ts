import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';

export interface DashboardCounts {
  emfs: number;
  indicateurs: number;
  questionnaires: number;
  activites: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardKpiService {
  private baseUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private authHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) return new HttpHeaders();
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return new HttpHeaders();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  countEmfs(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/emfs/count`, { headers: this.authHeaders() });
  }

  countIndicateurs(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/indicateurs/count`, { headers: this.authHeaders() });
  }

  countQuestionnaires(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/questionnaires/count`, { headers: this.authHeaders() });
  }

  countActivites(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/activites/count`, { headers: this.authHeaders() });
  }

  loadAllCounts(): Observable<DashboardCounts> {
    return forkJoin({
      emfs: this.countEmfs(),
      indicateurs: this.countIndicateurs(),
      questionnaires: this.countQuestionnaires(),
      activites: this.countActivites(),
    });
  }
}
