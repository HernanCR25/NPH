import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shed } from '../model/shed';

@Injectable({
  providedIn: 'root'
})
export class ShedService {

  private apiUrl = 'https://legendary-palm-tree-69vpv6pr9wv34gx-9000.app.github.dev/api/sheds';

  constructor(private http: HttpClient) { }

  getAllSheds(): Observable<Shed[]> {
    return this.http.get<Shed[]>(this.apiUrl);
  }

  getShedById(id: number): Observable<Shed> {
    return this.http.get<Shed>(`${this.apiUrl}/${id}`);
  }

  createShed(shed: Shed): Observable<Shed> {
    return this.http.post<Shed>(`${this.apiUrl}/crear`, shed);
  }

  updateShed(id: number, shed: Shed): Observable<Shed> {
    return this.http.put<Shed>(`${this.apiUrl}/${id}`, shed);
  }

  deleteShed(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getShedsByStatus(status: string): Observable<Shed[]> {
    return this.http.get<Shed[]>(`${this.apiUrl}/status/${status}`);
  }

  inactivateShed(id: number): Observable<Shed> {
    return this.http.patch<Shed>(`${this.apiUrl}/${id}/inactivate`, {});
  }

  activateShed(id: number): Observable<Shed> {
    return this.http.patch<Shed>(`${this.apiUrl}/${id}/activate`, {});
  }
}
