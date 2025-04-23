export interface SolicitudViatico{
    Id: number,
    UsuarioNombre: string,
    CicloNombre: string,
    FechaRegistro: string,
    FechaModificacion: string,
    Estado: string,
    Monto: number
}

export interface EstadisticaSolicitudViatico {
    cicloId: number;
  
    // Solicitudes
    totalSolicitudes: number;
    totalMonto: number;
    totalEnRevision: number;
    totalAprobado: number;
    totalRechazado: number;
    cantidadEnRevision: number;
    cantidadAprobado: number;
    cantidadRechazado: number;
  
    // Viáticos por categoría
    montoMovilizacion: number;
    montoAlimentacion: number;
    montoHospedaje: number;
  
    // Viáticos por estado
    viaticosEnRevision: number;
    viaticosAprobados: number;
    viaticosRechazados: number;
  }
  