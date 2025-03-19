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
    modulos: {
      moduloId: number;
      nombreModulo: string;
      seleccionado: boolean;
      permisos: {
        permisoId: number;
        nombrePermiso: string;
        seleccionado: boolean;
        acciones: {
          accionId: number;
          nombreAccion: string;
          seleccionado: boolean;
        }[];
      }[];
    }[];
  }