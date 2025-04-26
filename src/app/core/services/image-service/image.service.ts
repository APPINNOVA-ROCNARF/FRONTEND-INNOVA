import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private baseUrl = environment.rootUrl;

  getUrlAbsoluta(rutaRelativa: string): string {
    if (!rutaRelativa) return '';
    if (rutaRelativa.startsWith('http')) return rutaRelativa;
    return `${this.baseUrl}${rutaRelativa}`;
  }
}
