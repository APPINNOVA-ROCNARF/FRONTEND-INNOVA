import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import { Viatico } from '../../interfaces/viatico-api-response';
import { ActualizarEstadoViaticoRequest, ActualizarEstadoViaticoResponse } from '../../interfaces/actualizar-estado-viatico-request';

@Injectable({ providedIn: 'root' })
export class ViaticoService {
  private apiUrl = inject(API_BASE_URL);
  private ViaticoUrl = '/viaticos/';
  private actualizarEstadoViaticosUrl = '/viaticos/actualizar-estado';

  constructor(private http: HttpClient) {}

  getViaticos(solicitudId: number): Observable<Viatico[]> {
    return this.http.get<Viatico[]>(`${this.apiUrl}${this.ViaticoUrl}${solicitudId}`);
  }

  actualizarEstadoViaticos(request: ActualizarEstadoViaticoRequest): Observable<ActualizarEstadoViaticoResponse> {
    return this.http.post<ActualizarEstadoViaticoResponse>(`${this.apiUrl}${this.actualizarEstadoViaticosUrl}`, request);
  }

}
