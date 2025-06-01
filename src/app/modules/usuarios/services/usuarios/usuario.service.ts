import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import { UsuarioDTO } from '../../interfaces/usuario-api-response';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = inject(API_BASE_URL);
  private usuarioUrl = '/usuario'

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.apiUrl}${this.usuarioUrl}`);
  }

}
