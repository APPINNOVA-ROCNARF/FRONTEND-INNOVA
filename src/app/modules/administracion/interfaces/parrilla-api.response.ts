export interface ParrillaPromocionalDTO {
    id: number,
    nombre: string,
    descripcion: string,
    nombreArchivo: string,
    extensionArchivo: string,
    urlArchivo: string,
    fechaModificado: string,
}

export interface ArchivoTemporalGuardadoDTO {
  nombreOriginal: string;
  rutaTemporal: string;
  extension: string;
}

export interface CrearParrillaPromocionalDTO{
  nombre: string,
  descripcion: string,
  archivo?: ArchivoTemporalGuardadoDTO
}