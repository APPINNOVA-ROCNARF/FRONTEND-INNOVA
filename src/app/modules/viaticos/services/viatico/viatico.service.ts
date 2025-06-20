import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import {
  EditarViaticoDTO,
  HistorialViatico,
  Viatico,
  ViaticoReporte,
} from '../../interfaces/viatico-api-response';
import {
  ActualizarEstadoViaticoRequest,
  ActualizarEstadoViaticoResponse,
} from '../../interfaces/actualizar-estado-viatico-request';

@Injectable({ providedIn: 'root' })
export class ViaticoService {
  private apiUrl = inject(API_BASE_URL);
  private ViaticoUrl = '/viaticos/';
  private actualizarEstadoViaticosUrl = '/viaticos/actualizar-estado';
  private historialViaticoUrl = '/viaticos/historial';
  private reporteViaticoUrl = '/viaticos/reporte';
  private facturaVistaUrl = '/viaticos/factura/vistas'

  constructor(private http: HttpClient) {}

  getViaticos(solicitudId: number): Observable<Viatico[]> {
    return this.http.get<Viatico[]>(
      `${this.apiUrl}${this.ViaticoUrl}${solicitudId}`
    );
  }

  actualizarEstadoViaticos(
    request: ActualizarEstadoViaticoRequest
  ): Observable<ActualizarEstadoViaticoResponse> {
    return this.http.post<ActualizarEstadoViaticoResponse>(
      `${this.apiUrl}${this.actualizarEstadoViaticosUrl}`,
      request
    );
  }

  editarViatico(id: number, data: EditarViaticoDTO): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}${this.ViaticoUrl}${id}`, data);
  }

  getHistorialViaticos(viaticoId: number): Observable<HistorialViatico[]> {
    return this.http.get<HistorialViatico[]>(
      `${this.apiUrl}${this.historialViaticoUrl}?viaticoId=${viaticoId}`
    );
  }

  getReporteViaticos(params: {
    cicloId?: number;
    fechaInicio?: string;
    fechaFin?: string;
  }): Observable<ViaticoReporte[]> {
    const queryParams = new URLSearchParams();
    if (params.cicloId)
      queryParams.append('cicloId', params.cicloId.toString());
    if (params.fechaInicio)
      queryParams.append('fechaInicio', params.fechaInicio);
    if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);

    return this.http.get<ViaticoReporte[]>(
      `${this.apiUrl}${this.reporteViaticoUrl}?${queryParams.toString()}`
    );
  }

  exportarExcel(filtros: {
    cicloId?: number;
    fechaInicio?: string;
    fechaFin?: string;
  }): Observable<Blob> {
    const queryParams = new URLSearchParams();
    if (filtros.cicloId)
      queryParams.append('cicloId', filtros.cicloId.toString());
    if (filtros.fechaInicio)
      queryParams.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) queryParams.append('fechaFin', filtros.fechaFin);

    return this.http.get(
      `${this.apiUrl}/viaticos/exportar-excel?${queryParams.toString()}`,
      {
        responseType: 'blob',
      }
    );
  }

  FacturaVista(facturaIds: number[]): Observable<Record<number, boolean>>{
    return this.http.post<Record<number, boolean>>(`${this.apiUrl}${this.facturaVistaUrl}`,facturaIds)
  }
}
