export interface SolicitudViatico{
    Id: number,
    UsuarioNombre: string,
    FechaRegistro: string,
    FechaModificacion: string,
    Estado: string,
    Monto: number
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
  