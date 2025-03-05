import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, of } from 'rxjs';

interface Asesor {
  idAsesor: string;
  clave: string;
  nombre: string;
  seccion: string | null;
  tipo: string;
  email: string | null;
  fuerzaVenta: string | null;
  region: string | null;
  rol: string | null;
  relacionAsesorSeccion: string | null;
}

interface ApiResponse {
  totalItems: number;
  items: Asesor[];
}

@Injectable({
  providedIn: 'root'
})
export class AsesoresService {
  private apiUrl = 'http://200.105.252.218/rocnarf/api/asesores/';
  constructor(private http: HttpClient) { }
  getNombresAsesores(): Observable<string[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => {
        console.log('Respuesta de la API:', response); // Verifica el formato de respuesta

        // Verifica si `items` es un array antes de intentar mapear
        if (response && response.items && Array.isArray(response.items)) {
          return response.items.map(a => a.nombre);
        } else {
          console.error('La API devolvió un formato inesperado:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error en la API:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
}
