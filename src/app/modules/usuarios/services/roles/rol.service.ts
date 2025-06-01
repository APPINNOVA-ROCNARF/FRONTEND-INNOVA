import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolSimple, RolDetalle, Modulo, NuevoRol } from '../../interfaces/rol-api-response';
import { API_BASE_URL } from '../../../../app.config';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = inject(API_BASE_URL);
  private rolUrl = '/rol';
  private moduloUrl = '/rol/modulos/';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<RolSimple[]> {
    return this.http.get<RolSimple[]>(`${this.apiUrl}${this.rolUrl}`);
  }

  getRolDetalle(rolId: number): Observable<RolDetalle> {
    return this.http.get<RolDetalle>(`${this.apiUrl}${this.rolUrl}${rolId}`);
  }

  getModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}${this.moduloUrl}`);
  }

  crearRol(payload: NuevoRol): Observable<unknown> {
    return this.http.post(`${this.apiUrl}${this.rolUrl}`, payload);
  }
}
