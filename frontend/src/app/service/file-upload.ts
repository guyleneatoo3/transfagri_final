import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUpload {
  private baseUrl = 'http://localhost:8082/api/training-docs';

  constructor(private http: HttpClient) {}

  upload(file: File, title: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('title', title);

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    const req = new HttpRequest('POST', this.baseUrl, formData, {
      reportProgress: true,
      responseType: 'json',
      headers
    });

    return this.http.request(req);
  }

  list(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}`, { responseType: 'blob' });
  }
}
