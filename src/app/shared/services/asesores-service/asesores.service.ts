
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioAppSelect } from './Interfaces/asesores-api-response';


@Injectable({
  providedIn: 'root'
})
export class AsesoresService {
    private apiUrl = inject(API_BASE_URL);
    private usuarioAppSelectUrl = '/usuario/usuariosapp/select';
  
    constructor(private http: HttpClient) { }
  
      getAsesores(): Observable<UsuarioAppSelect[]> {
        return this.http.get<UsuarioAppSelect[]>(`${this.apiUrl}${this.usuarioAppSelectUrl}`);
      }
  
}
