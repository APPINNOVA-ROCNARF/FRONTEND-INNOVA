import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ArchivoService {
  private baseUrl = environment.rootUrl;

  constructor(private http: HttpClient){}

  getUrlAbsoluta(
    rutaRelativa: string,
    modo: 'ver' | 'descargar' = 'ver'
  ): string {
    if (!rutaRelativa) return '';
    if (rutaRelativa.startsWith('http')) return rutaRelativa;

    return `${
      this.baseUrl
    }api/archivo/descargar?rutaRelativa=${encodeURIComponent(
      rutaRelativa
    )}&modo=${modo}`;
  }

  obtenerPdf(rutaRelativa: string): Observable<Blob> {
    const url = `${
      this.baseUrl
    }api/archivo/descargar?rutaRelativa=${encodeURIComponent(
      rutaRelativa
    )}&modo=descargar`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
