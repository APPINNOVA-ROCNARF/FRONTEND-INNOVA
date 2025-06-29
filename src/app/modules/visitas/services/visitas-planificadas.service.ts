import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  QueryResult,
  ResumenVisitaPlanificadaAgregado,
  ResumenVisitasPlanificada,
} from '../interfaces/visitas-planificadas-response';

@Injectable({ providedIn: 'root' })
export class VisitasPlanificadasService {
  private baseUrl = 'http://localhost:5000/api/visitas/planificadas/';
  private baseUrlAgregado =
    'http://localhost:5000/api/visitas/resumen-planificada/';

    private baseUrlExcel = 'http://localhost:5000/api/visitas/exportar-excel/'

  constructor(private http: HttpClient) {}

  getResumen(
    fechaDesde: Date,
    fechaHasta: Date,
    codigoCliente?: string,
    nombreCliente?: string,
    asesores?: string,
    secciones?: string,
    regiones?: string,
    fuerzas?: string,
    tiposClientes?: string,
    pageIndex?: number,
    pageSize?: number
  ): Observable<QueryResult<ResumenVisitasPlanificada>> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde.toISOString());
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta.toISOString());
    if (codigoCliente) params = params.set('codigoCliente', codigoCliente);
    if (nombreCliente) params = params.set('nombreCliente', nombreCliente);
    if (asesores) params = params.set('asesores', asesores);
    if (secciones) params = params.set('secciones', secciones);
    if (regiones) params = params.set('regiones', regiones);
    if (fuerzas) params = params.set('fuerzas', fuerzas);
    if (tiposClientes) params = params.set('tiposClientes', tiposClientes);

    if (pageIndex !== undefined)
      params = params.set('pageNumber', pageIndex.toString());
    if (pageSize !== undefined)
      params = params.set('pageSize', pageSize.toString());

    return this.http.get<QueryResult<ResumenVisitasPlanificada>>(this.baseUrl, {
      params,
    });
  }

    exportarResumenExcel(
    fechaDesde: Date,
    fechaHasta: Date,
    codigoCliente?: string,
    nombreCliente?: string,
    asesores?: string,
    secciones?: string,
    regiones?: string,
    fuerzas?: string,
    tiposClientes?: string
  ): Observable<Blob> {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde.toISOString())
      .set('fechaHasta', fechaHasta.toISOString());

    if (codigoCliente)   params = params.set('codigoCliente', codigoCliente);
    if (nombreCliente)   params = params.set('nombreCliente', nombreCliente);
    if (asesores)        params = params.set('asesores', asesores);
    if (secciones)       params = params.set('secciones', secciones);
    if (regiones)        params = params.set('regiones', regiones);
    if (fuerzas)         params = params.set('fuerzas', fuerzas);
    if (tiposClientes)   params = params.set('tiposClientes', tiposClientes);

    return this.http.get(
      `${this.baseUrlExcel}`,
      {
        params,
        responseType: 'blob'
      }
    );
  }


  getResumenAgregado(
    fechaDesde: Date,
    fechaHasta: Date,
    codigoCliente?: string,
    nombreCliente?: string,
    asesores?: string,
    secciones?: string,
    regiones?: string,
    fuerzas?: string,
    tiposClientes?: string
  ): Observable<ResumenVisitaPlanificadaAgregado[]> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde.toISOString());
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta.toISOString());
    if (codigoCliente) params = params.set('codigoCliente', codigoCliente);
    if (nombreCliente) params = params.set('nombreCliente', nombreCliente);
    if (asesores) params = params.set('asesores', asesores);
    if (secciones) params = params.set('secciones', secciones);
    if (regiones) params = params.set('regiones', regiones);
    if (fuerzas) params = params.set('fuerzas', fuerzas);
    if (tiposClientes) params = params.set('tiposClientes', tiposClientes);

    return this.http.get<ResumenVisitaPlanificadaAgregado[]>(
      this.baseUrlAgregado,
      {
        params,
      }
    );
  }
}
