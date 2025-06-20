import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import { ArchivoTemporalGuardadoDTO, GuiaProducto, GuiaProductoCrearDTO, GuiaProductoDetalle, GuiaProductoSelectsDTO } from '../../interfaces/guias-api-response';

@Injectable({ providedIn: 'root' })
export class GuiaProductoService {
  private apiUrl = inject(API_BASE_URL);
  private guiaProductoUrl = '/sistema/guia-producto';
  private archivoGuiaUrl = '/sistema/guia-producto/archivo';
  private subirArchivoTemp = '/archivo/upload-temp';

  constructor(private http: HttpClient) {}

  getGuiasProducto(): Observable<GuiaProducto[]> {
    return this.http.get<GuiaProducto[]>(
      `${this.apiUrl}${this.guiaProductoUrl}`
    );
  }

  getGuiaProductoDetalle(id: number): Observable<GuiaProductoDetalle> {
    return this.http.get<GuiaProductoDetalle>(
      `${this.apiUrl}${this.guiaProductoUrl}/${id}`
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

  crearGuia(payload: GuiaProductoCrearDTO): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(
      `${this.apiUrl}${this.guiaProductoUrl}`,
      payload
    );
  }

  eliminarGuia(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${this.guiaProductoUrl}/${id}`
    );
  }

  editarGuia(
    id: number,
    payload: GuiaProductoCrearDTO
  ): Observable<{ id: number }> {
    return this.http.put<{ id: number }>(
      `${this.apiUrl}${this.guiaProductoUrl}/${id}`,
      payload
    );
  }

  eliminarArchivoGuia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.archivoGuiaUrl}/${id}`);
  }

  getGuiaSelect(): Observable<GuiaProductoSelectsDTO> {
    return this.http.get<GuiaProductoSelectsDTO>(`${this.apiUrl}${this.guiaProductoUrl}/select`);
  }
}
