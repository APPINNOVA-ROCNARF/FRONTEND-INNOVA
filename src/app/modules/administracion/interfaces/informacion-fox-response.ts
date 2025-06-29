export interface ArchivoTemporalGuardadoDTO {
  nombreOriginal: string;
  rutaTemporal: string;
  extension: string;
  size: number;
  progress?: number;
  status?: 'normal' | 'success' | 'exception';
  registrosInsertados?: number; // ← Aquí
}

export interface DBFResultadoResponse {
  archivo: string;
  registrosInsertados: number;
  mensaje: string;
  exito: boolean;
}
