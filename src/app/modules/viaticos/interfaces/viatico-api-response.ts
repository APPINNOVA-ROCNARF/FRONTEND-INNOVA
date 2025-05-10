export interface SolicitudViatico{
    Id: number,
    UsuarioNombre: string,
    FechaRegistro: string,
    FechaModificacion: string,
    Estado: string,
    Monto: number
}

export interface DetalleSolicitudViatico{
    usuarioNombre: string,
    fechaRegistro: string,
    fechaModificacion: string,
    estado: string,
    cicloNombre: string,
    cicloId: number
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
  campoRechazado: CampoRechazado[];
  vehiculo: Vehiculo;
}

export type EstadoViatico =
  | 'Borrador'
  | 'EnRevision'
  | 'Aprobado'
  | 'Rechazado';


export interface CampoRechazado{
  campo: string,
  comentario: string,
}

export interface Vehiculo{
  placa: string,
  modelo: string,
  color: string,
  fabricante: string
}

export interface EditarViaticoDTO{
  nombreProveedor?: string,
  numeroFactura?: string
}