import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeccionesSelect } from './Interfaces/secciones-api-response';


@Injectable({
  providedIn: 'root'
})
export class SeccionesService {
    private apiUrl = inject(API_BASE_URL);
    private seccionesSelectUrl = '/sistema/secciones/select';
  
    constructor(private http: HttpClient) { }
  
      getSecciones(): Observable<SeccionesSelect[]> {
        return this.http.get<SeccionesSelect[]>(`${this.apiUrl}${this.seccionesSelectUrl}`);
      }
  
}
