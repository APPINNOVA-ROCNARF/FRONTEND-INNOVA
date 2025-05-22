import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import { ArchivoTemporalGuardadoDTO, GuiaProducto } from '../../interfaces/guias-api-response';

@Injectable({ providedIn: 'root' })
export class GuiaProductoService {
  private apiUrl = inject(API_BASE_URL);
  private guiaProductoUrl = '/sistema/obtener-guias-producto';
  private subirArchivoTemp = '/archivo/upload-temp';


  constructor(private http: HttpClient) { }

  getGuiasProducto(): Observable<GuiaProducto[]> {
    return this.http.get<GuiaProducto[]>(`${this.apiUrl}${this.guiaProductoUrl}`);
  }

  uploadTempArchivo(formData: FormData): Observable<ArchivoTemporalGuardadoDTO> {
    return this.http.post<ArchivoTemporalGuardadoDTO>(
      `${this.apiUrl}${this.subirArchivoTemp}`,
      formData
    );
  }
}
