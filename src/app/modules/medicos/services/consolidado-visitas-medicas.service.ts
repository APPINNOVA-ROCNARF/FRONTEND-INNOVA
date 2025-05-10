// src/app/services/consolidado-visitas-medicas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsolidadoMedico } from '../pages/cobertura-medicos/dashboard/dashboard-cobertura-medicos.component';

@Injectable({
  providedIn: 'root',
})
export class ConsolidadoVisitasMedicasService {
  private baseUrl = 'http://200.105.252.218/rocnarf/api/clientes/consolidadoVisitasMedicas';

  constructor(private http: HttpClient) {}

  getConsolidado(
    fechaDesde: Date,
    fechaHasta: Date,
    seccion = '',
    representante = '',
    fuerzaVenta = ''
  ): Observable<ConsolidadoMedico[]> {
    const params = new HttpParams()
      .set('fechaDesde', fechaDesde.toDateString())
      .set('fechaHasta', fechaHasta.toDateString())
      .set('seccion', seccion)
      .set('representante', representante)
      .set('fuerzaVenta', fuerzaVenta);

    return this.http.get<ConsolidadoMedico[]>(this.baseUrl, { params });
  }
}
