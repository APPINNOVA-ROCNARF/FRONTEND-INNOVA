import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = inject(API_BASE_URL);


  constructor(private http: HttpClient) {}


}
