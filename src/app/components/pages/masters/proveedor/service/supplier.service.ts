import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../model/supplier';
import { create } from 'domain';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly apiUrl = 'https://8085-vallegrandea-mssupplier-8thnb5i17u3.ws-us117.gitpod.io/api/suppliers';

  constructor(private http: HttpClient) {}

  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.apiUrl}/create`, supplier);
  }

  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getSuppliersByStatus(status: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/status/${status}`);
  }

  inactivateSupplier(id: number): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.apiUrl}/${id}/inactivate`, null);
  }

  activateSupplier(id: number): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.apiUrl}/${id}/activate`, null);
  }
}
