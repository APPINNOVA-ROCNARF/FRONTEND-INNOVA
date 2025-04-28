export interface ActualizarEstadoViaticoRequest {
    accion: number;
    viaticos: ActualizarViaticoItem[];
  }
  
  export interface ActualizarViaticoItem {
    id: number;
    comentario?: string;
    camposRechazados?: CampoRechazado[];
  }
  
  export interface CampoRechazado {
    campo: string;
    comentario: string;
  }

  export interface ActualizarEstadoViaticoResponse {
    success: boolean;
    message: string;
  }
  
  