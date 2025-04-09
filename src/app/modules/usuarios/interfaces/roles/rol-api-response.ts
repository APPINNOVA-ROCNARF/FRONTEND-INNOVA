export interface RolSimple {
    rolId: number;
    nombreRol: string;
    descripcion: string;
    estado: boolean;
  }

export interface RolDetalle {
  rolId: number;
  nombreRol: string;
  descripcion: string;
  estado: boolean;
  modulos: Modulo[];
}

export interface NuevoRol {
  nombreRol: string;
  descripcion: string;
  modulos: Modulo[];
}
export interface Modulo {
  moduloId: number;
  nombreModulo: string;
  seleccionado: boolean;
  permisos: Permiso[];
}

export interface Permiso {
  permisoId: number;
  nombrePermiso: string;
  seleccionado: boolean;
  acciones: Accion[];
}


export interface Accion {
  accionId: number;
  nombreAccion: string;
  seleccionado: boolean;
}

