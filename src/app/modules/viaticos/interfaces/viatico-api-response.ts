export interface SolicitudViatico {
  id: number;
  usuarioNombre: string;
  fechaRegistro: string;
  fechaModificacion: string;
  estado: string;
  monto: number;
  [key: string]: string | number;
}

export interface DetalleSolicitudViatico {
  usuarioNombre: string;
  fechaRegistro: string;
  fechaModificacion: string;
  estado: string;
  cicloNombre: string;
  cicloId: number;
}

export interface EstadisticaSolicitudViatico {
  ciclo_id: number;

  // Solicitudes
  total_solicitudes: number;
  total_monto: number;
  total_en_revision: number;
  total_aprobado: number;
  total_rechazado: number;
  cantidad_en_revision: number;
  cantidad_aprobado: number;
  cantidad_rechazado: number;

  // Viáticos por categoría
  monto_movilizacion: number;
  monto_alimentacion: number;
  monto_hospedaje: number;
}

export interface EstadisticaViatico {
  categoria: string;
  total_registrado: number;
  total_aprobado: number;
  total_acreditado: number;
  diferencia: number;
  porcentaje_ejecucion: number;
}

export interface Viatico {
  id: number;
  fechaFactura: string;
  nombreCategoria: string;
  nombreProveedor: string;
  numeroFactura: string;
  comentario: string;
  monto: number;
  estadoViatico: EstadoViatico;
  rutaImagen: string;
  facturaId: number,
  camposRechazados: CampoRechazado[];
  vehiculo: Vehiculo;
}
export type EstadoViatico =
  | 'Borrador'
  | 'EnRevision'
  | 'Aprobado'
  | 'Rechazado'
  | 'Devuelto';

export interface CampoRechazado {
  campo: string;
  comentario: string;
}

export interface Vehiculo {
  placa: string;
  modelo: string;
  color: string;
  fabricante: string;
}

export interface EditarViaticoDTO {
  nombreProveedor?: string;
  numeroFactura?: string;
}

export interface HistorialViatico {
  fecha: string;
  usuario: string;
  tipoEvento: string;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
}

export interface ViaticoReporte {
  usuarioId: number;
  nombreUsuario: string;

  movilizacionAcreditado: number;
  movilizacionAprobado: number;
  movilizacionRechazado: number;
  movilizacionDiferencia: number;

  alimentacionAcreditado: number;
  alimentacionAprobado: number;
  alimentacionRechazado: number;
  alimentacionDiferencia: number;

  hospedajeAcreditado: number;
  hospedajeAprobado: number;
  hospedajeRechazado: number;
  hospedajeDiferencia: number;
}
