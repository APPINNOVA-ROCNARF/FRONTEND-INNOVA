// src/app/services/consolidado-visitas-medicas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumenCoberturaClientes } from '../interfaces/consolidado-clientes-api-response';

@Injectable({
  providedIn: 'root',
})
export class ConsolidadoCoberturaClientesService {
  private baseUrl = 'http://localhost:5000/api/clientes/cobertura-clientes';

  constructor(private http: HttpClient) {}

  getConsolidado(
    fechaInicial: Date,
    fechaFinal: Date,
  ): Observable<ResumenCoberturaClientes[]> {
    const params = new HttpParams()
      .set('fechaInicial', fechaInicial.toDateString())
      .set('fechaFinal', fechaFinal.toDateString())


    return this.http.get<ResumenCoberturaClientes[]>(this.baseUrl, { params });
  }
}
