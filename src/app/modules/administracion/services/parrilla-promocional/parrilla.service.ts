import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import {
  ArchivoTemporalGuardadoDTO,
  CrearParrillaPromocionalDTO,
  ParrillaPromocionalDTO,
} from '../../interfaces/parrilla-api.response';

@Injectable({ providedIn: 'root' })
export class ParrillaPromocionalService {
  private apiUrl = inject(API_BASE_URL);
  private parrillaPromocionalUrl = '/sistema/parrilla-promocional';
  private eliminarArchivoUrl = '/sistema/parrilla-promocional-archivo';
  private subirArchivoTemp = '/archivo/upload-temp';

  constructor(private http: HttpClient) {}

  getParrillaPromocional(): Observable<ParrillaPromocionalDTO> {
    return this.http.get<ParrillaPromocionalDTO>(
      `${this.apiUrl}${this.parrillaPromocionalUrl}`
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

  crearParrilla(
    payload: CrearParrillaPromocionalDTO
  ): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(
      `${this.apiUrl}${this.parrillaPromocionalUrl}`,
      payload
    );
  }

  eliminarArchivo(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.eliminarArchivoUrl}`);
  }
}
