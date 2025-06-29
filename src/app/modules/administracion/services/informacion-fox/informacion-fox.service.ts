import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArchivoTemporalGuardadoDTO, DBFResultadoResponse } from '../../interfaces/informacion-fox-response';

@Injectable({
  providedIn: 'root',
})
export class InformacionFoxService {
  private apiUrl = inject(API_BASE_URL);
  private subirArchivoTemp = '/archivo/upload-zip';
  private subirArchivoFox = '/sistema/fox/procesar'

  constructor(private http: HttpClient) {}

  uploadTempArchivo(
    formData: FormData
  ): Observable<ArchivoTemporalGuardadoDTO> {
    return this.http.post<ArchivoTemporalGuardadoDTO>(
      `${this.apiUrl}${this.subirArchivoTemp}`,
      formData
    );
  }

  procesarArchivo(tipo: string, rutaRelativa: string): Observable<DBFResultadoResponse> {
    const url = `${this.apiUrl}/sistema/fox/${tipo}/procesar`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<DBFResultadoResponse>(
      url,
      JSON.stringify(rutaRelativa),
      { headers }
    );
  }
}
