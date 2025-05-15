import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CargarCupoResponse, PresupuestoRow } from "../../interfaces/presupuesto-data";
import { API_BASE_URL } from "../../../../app.config";

@Injectable({ providedIn: 'root' })
export class CupoMensualService {
  private apiUrl = inject(API_BASE_URL);
  private cargarCuposUrl = '/viaticos/cargar-cupos/';
  private verificarCupoUrl = '/viaticos/verificar-cupos';

  constructor(private http: HttpClient) {}

  cargarCupos(cicloId: number, datos: PresupuestoRow[]) {
    return this.http.post<CargarCupoResponse>(`${this.apiUrl}${this.cargarCuposUrl}?cicloId=${cicloId}`, datos);
  }

  verificarCupos(cicloId: number) {
  return this.http.get(`${this.apiUrl}${this.verificarCupoUrl}?cicloId=${cicloId}`, { observe: 'response' });
}

}
