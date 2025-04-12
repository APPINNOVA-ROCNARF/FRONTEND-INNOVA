import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { CicloSelectDTO } from './Interfaces/CicloSelectDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CicloService {
  private apiUrl = inject(API_BASE_URL);
  private cicloUrl = '/sistema/ciclos/select';

  constructor(private http: HttpClient) { }

    getCiclos(): Observable<CicloSelectDTO[]> {
      return this.http.get<CicloSelectDTO[]>(`${this.apiUrl}${this.cicloUrl}`);
    }

}
