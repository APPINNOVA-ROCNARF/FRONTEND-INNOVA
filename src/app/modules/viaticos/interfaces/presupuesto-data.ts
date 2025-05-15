export interface PresupuestoRow {
  SECTOR: string;
  'CUPO MOVILIDAD': number;
  'CUPO HOSPEDAJE': number;
  'CUPO ALIMENTACION': number;
}

export interface CargarCupoResponse {
  mensaje: string;
  cuposInsertados: number;
  sectoresNoEncontrados: string[];
}