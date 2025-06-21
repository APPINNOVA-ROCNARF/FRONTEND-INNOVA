import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../../app.config';
import { HttpClient } from '@angular/common/http';
import { ArchivoTemporalGuardadoDTO } from '../../interfaces/parrilla-api.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InformacionFoxService {
  private apiUrl = inject(API_BASE_URL);
  private subirArchivoTemp = '/archivo/upload-zip';

  constructor(private http: HttpClient) {}

  uploadTempArchivo(
    formData: FormData
  ): Observable<ArchivoTemporalGuardadoDTO> {
    return this.http.post<ArchivoTemporalGuardadoDTO>(
      `${this.apiUrl}${this.subirArchivoTemp}`,
      formData
    );
  }
}
