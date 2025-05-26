import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FuerzaSelectDTO } from './Interfaces/FuerzaSelectDTO';

@Injectable({
  providedIn: 'root'
})
export class FuerzaService {
  private apiUrl = inject(API_BASE_URL);
  private fuerzaUrl = '/sistema/fuerzas/select';

  constructor(private http: HttpClient) { }

    getFuerzas(): Observable<FuerzaSelectDTO[]> {
      return this.http.get<FuerzaSelectDTO[]>(
        `${this.apiUrl}${this.fuerzaUrl}`
      );
    }

}
