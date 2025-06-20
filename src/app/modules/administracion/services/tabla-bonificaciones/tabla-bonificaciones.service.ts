import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import { ArchivoTemporalGuardadoDTO, CrearTablaBonificacionesDTO, TablaBonificacionesDTO } from '../../interfaces/tabla-bonificaciones-api.response';


@Injectable({ providedIn: 'root' })
export class TablaBonificacionesService {
  private apiUrl = inject(API_BASE_URL);
  private tablaBonificacionesUrl = '/sistema/tabla-bonificaciones';
  private eliminarArchivoUrl = '/sistema/tabla-bonificaciones-archivo';
  private subirArchivoTemp = '/archivo/upload-temp';

  constructor(private http: HttpClient) {}

  getTablaBonificaciones(): Observable<TablaBonificacionesDTO> {
    return this.http.get<TablaBonificacionesDTO>(
      `${this.apiUrl}${this.tablaBonificacionesUrl}`
    );
  }

  uploadTempArchivo(
    formData: FormData
  ): Observable<ArchivoTemporalGuardadoDTO> {
    return this.http.post<ArchivoTemporalGuardadoDTO>(
      `${this.apiUrl}${this.subirArchivoTemp}`,
      formData
    );
  }

  crearTablaBonificaciones(
    payload: CrearTablaBonificacionesDTO
  ): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(
      `${this.apiUrl}${this.tablaBonificacionesUrl}`,
      payload
    );
  }

  eliminarArchivo(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.eliminarArchivoUrl}`);
  }
}
