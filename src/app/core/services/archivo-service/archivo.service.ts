import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ArchivoService {
  private baseUrl = environment.rootUrl;
  private viaticoUrl = 'api/viaticos/factura/ver';
  private parrillaUrl = 'api/sistema/parrilla-promocional/descargar'
  private guiaUrl = 'api/sistema/guia-producto/ver'
  private guiaUrlDownload = 'api/sistema/guia-producto/descargar'

  constructor(private http: HttpClient) {}

  verFactura(rutaRelativa: string, entidadId: number): Observable<Blob> {
    if (!rutaRelativa) throw new Error('Ruta relativa inválida.');

    const url = new URL(`${this.baseUrl}${this.viaticoUrl}`);
    url.searchParams.set('rutaRelativa', rutaRelativa);
    url.searchParams.set('entidadId', entidadId.toString());

    return this.http.get(url.toString(), { responseType: 'blob' });
  }

  verGuia(rutaRelativa: string, entidadId: number): Observable<Blob> {
    if (!rutaRelativa) throw new Error('Ruta relativa inválida.');

    const url = new URL(`${this.baseUrl}${this.guiaUrl}`);
    url.searchParams.set('rutaRelativa', rutaRelativa);
    url.searchParams.set('entidadId', entidadId.toString());

    return this.http.get(url.toString(), { responseType: 'blob' });
  }

  obtenerArchivo(rutaRelativa: string, entidadId: number): Observable<Blob> {
    if (!rutaRelativa) throw new Error('Ruta relativa inválida');

    const url = new URL(`${this.baseUrl}${this.parrillaUrl}`);
    url.searchParams.set('rutaRelativa', rutaRelativa);
    url.searchParams.set('entidadId', entidadId.toString());

    return this.http.get(url.toString(), { responseType: 'blob' });
  }

    obtenerArchivoGuia(rutaRelativa: string, entidadId: number): Observable<Blob> {
    if (!rutaRelativa) throw new Error('Ruta relativa inválida');

    const url = new URL(`${this.baseUrl}${this.guiaUrlDownload}`);
    url.searchParams.set('rutaRelativa', rutaRelativa);
    url.searchParams.set('entidadId', entidadId.toString());

    return this.http.get(url.toString(), { responseType: 'blob' });
  }
}
