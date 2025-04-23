import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import { EstadisticaSolicitudViatico, SolicitudViatico } from '../../interfaces/viatico-api-response';

@Injectable({ providedIn: 'root' })
export class SolicitudViaticoService {
  private apiUrl = inject(API_BASE_URL);
  private solicitudViaticoUrl = '/viaticos/solicitud/ciclo/';
  private estadisticaSolicitudViaticoUrl = '/viaticos/estadistica-solicitud-viatico/';

  constructor(private http: HttpClient) {}

  getSolicitudViatico(cicloId: number): Observable<SolicitudViatico[]> {
    return this.http.get<SolicitudViatico[]>(`${this.apiUrl}${this.solicitudViaticoUrl}${cicloId}`);
  }

  getEstadisticaSolicitudViatico(cicloId: number): Observable<EstadisticaSolicitudViatico> {
    return this.http.get<EstadisticaSolicitudViatico>(`${this.apiUrl}${this.estadisticaSolicitudViaticoUrl}${cicloId}`)
  }
}
