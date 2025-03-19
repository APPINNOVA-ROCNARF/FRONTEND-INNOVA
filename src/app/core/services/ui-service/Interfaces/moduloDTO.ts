export interface PermisoDto {
  id: number;
  nombre: string;
  ruta: string;
}

export interface ModuloDto {
  id: number;
  nombre: string;
  icono: string;
  permisos: PermisoDto[];
}
