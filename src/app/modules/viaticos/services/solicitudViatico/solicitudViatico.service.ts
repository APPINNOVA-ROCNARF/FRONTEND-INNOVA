import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import {
  DetalleSolicitudViatico,
  EstadisticaSolicitudViatico,
  EstadisticaViatico,
  SolicitudViatico,
} from '../../interfaces/viatico-api-response';

@Injectable({ providedIn: 'root' })
export class SolicitudViaticoService {
  private apiUrl = inject(API_BASE_URL);
  private solicitudViaticoUrl = '/viaticos/solicitud/ciclo/';
  private estadisticaSolicitudViaticoUrl =
    '/viaticos/estadistica-solicitud-viatico/';
  private estadisticaViaticoUrl =
    '/viaticos/estadistica-viatico/';
  private detalleSolicitudViaticoUrl = '/viaticos/solicitud/detalle/';

  constructor(private http: HttpClient) { }

  getSolicitudViatico(cicloId: number): Observable<SolicitudViatico[]> {
    return this.http.get<SolicitudViatico[]>(
      `${this.apiUrl}${this.solicitudViaticoUrl}${cicloId}`
    );
  }

  getEstadisticaSolicitudViatico(
    cicloId: number
  ): Observable<EstadisticaSolicitudViatico> {
    return this.http.get<EstadisticaSolicitudViatico>(
      `${this.apiUrl}${this.estadisticaSolicitudViaticoUrl}${cicloId}`
    );
  }

  getEstadisticaViatico(
    solicitudId: number
  ): Observable<EstadisticaViatico[]> {
    return this.http.get<EstadisticaViatico[]>(
      `${this.apiUrl}${this.estadisticaViaticoUrl}${solicitudId}`
    );
  }

  getDetalleSolicitudViatico(
    solicitudId: number
  ): Observable<DetalleSolicitudViatico> {
    return this.http.get<DetalleSolicitudViatico>(
      `${this.apiUrl}${this.detalleSolicitudViaticoUrl}${solicitudId}`
    );
  }
}
