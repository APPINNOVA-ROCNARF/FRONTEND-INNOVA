export interface PermisoDTO {
  id: number;
  nombre: string;
  ruta: string;
}

export interface ModuloDTO {
  id: number;
  nombre: string;
  icono: string;
  permisos: PermisoDTO[];
}
