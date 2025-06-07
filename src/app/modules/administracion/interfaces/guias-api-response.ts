export interface GuiaProducto {
  id: number;
  marca: string;
  nombre: string;
  fuerza: string;
  activo: boolean;
  [key: string]: string | number | boolean;
}

export interface ArchivoTemporalGuardadoDTO {
  nombreOriginal: string;
  rutaTemporal: string;
  extension: string;
}

export interface GuiaProductoDetalle {
  id: number;
  marca: string;
  nombre: string;
  urlVideo: string;
  fuerzaNombre: string;
  fuerzaId: number;
  activo: boolean;
  archivos: ArchivoGuia[];
}

export interface ArchivoGuia {
  id: number;
  nombre: string;
  ruta: string;
  extension: string;
  activo: boolean;
  fechaRegistro: string;
}

export interface GuiaProductoCrearDTO {
  marca: string;
  nombre: string;
  urlVideo: string;
  fuerzaId: number;
  archivos: ArchivoTemporalGuardadoDTO[];
}
