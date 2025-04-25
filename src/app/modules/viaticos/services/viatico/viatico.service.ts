import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../../app.config';
import { Viatico } from '../../interfaces/viatico-api-response';

@Injectable({ providedIn: 'root' })
export class ViaticoService {
  private apiUrl = inject(API_BASE_URL);
  private ViaticoUrl = '/viaticos/';

  constructor(private http: HttpClient) {}

  getViaticos(solicitudId: number): Observable<Viatico[]> {
    return this.http.get<Viatico[]>(`${this.apiUrl}${this.ViaticoUrl}${solicitudId}`);
  }

}
