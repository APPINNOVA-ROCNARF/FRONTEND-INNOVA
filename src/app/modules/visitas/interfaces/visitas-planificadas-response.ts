export interface QueryResult<T> {
  items: T[];
  totalItems: number;
}

export interface ResumenVisitasPlanificada {
  seccion: string;
  representante: string;
  region: string;
  fuerza: string;

  fechaPlanificada: string;
  fechaEjecutada: string;

  nombreCliente: string;
  estado: string;
  revisita: string;
  visitaSinGestion: string;
  observacion: string;
  acompanante: string;

  clienteZCajasVaciasPlanificado: string;
  clienteZVisitaPromocionalPlanificado: string;
  clienteZPuntoContactoPlanificado: string;
  clienteZEntregaPremiosPlanificado: string;
  clienteZCajasVaciasEjecutado: string;
  clienteZVisitaPromocionalEjecutado: string;
    clienteZPuntoContactoEjecutado: string;
  clienteZEntregaPremiosEjecutado: string;

  medicoVisitaPromocionalPlanificado: string;
  medicoPuntoContactoPlanificado: string;
  medicoVisitaPromocionalEjecutado: string;
  medicoPuntoContactoEjecutado: string;

  clienteCajasVaciasPlanificado: string;
  clienteSiembraProductosPlanificado: string;
  clienteVisitaPromocionalPlanificado: string;
  clientePuntoContactoPlanificado: string;
  clienteEntregaPremiosPlanificado: string;
  clienteDevolucionPlanificado: string;
  clientePedidoPlanificado: string;
  clienteCobroPlanificado: string;
  clienteCajasVaciasEjecutado: string;
  clienteSiembraProductosEjecutado: string;
  clienteVisitaPromocionalEjecutado: string;
  clientePuntoContactoEjecutado: string;
  clienteEntregaPremiosEjecutado: string;
  clienteDevolucionEjecutado: string;
  clientePedidoEjecutado: string;
  clienteCobroEjecutado: string;
  totalRegistros: number;
  [key: string]: string | number | unknown; 
}

export interface ResumenVisitaPlanificadaAgregado {
  seccion: string;
  representante: string;
  region: string;
  fuerza: string;

  // Cliente Z
  clienteZ_CajasVacias_Planificado: number;
  clienteZ_CajasVacias_Ejecutado: number;
  clienteZ_VisitaPromocional_Planificado: number;
  clienteZ_VisitaPromocional_Ejecutado: number;
  clienteZ_PuntoContacto_Planificado: number;
  clienteZ_PuntoContacto_Ejecutado: number;
  clienteZ_EntregaPremios_Planificado: number;
  clienteZ_EntregaPremios_Ejecutado: number;

  // Médico
  medico_VisitaPromocional_Planificado: number;
  medico_VisitaPromocional_Ejecutado: number;
  medico_PuntoContacto_Planificado: number;
  medico_PuntoContacto_Ejecutado: number;

  // Cliente genérico
  cliente_CajasVacias_Planificado: number;
  cliente_CajasVacias_Ejecutado: number;
  cliente_SiembraProductos_Planificado: number;
  cliente_SiembraProductos_Ejecutado: number;
  cliente_VisitaPromocional_Planificado: number;
  cliente_VisitaPromocional_Ejecutado: number;
  cliente_PuntoContacto_Planificado: number;
  cliente_PuntoContacto_Ejecutado: number;
  cliente_EntregaPremios_Planificado: number;
  cliente_EntregaPremios_Ejecutado: number;
  cliente_Devolucion_Planificado: number;
  cliente_Devolucion_Ejecutado: number;
  cliente_Pedido_Planificado: number;
  cliente_Pedido_Ejecutado: number;
  cliente_Cobro_Planificado: number;
  cliente_Cobro_Ejecutado: number;
    [key: string]: string | number | unknown; 

}

export interface VisitasPlanificadasFiltros {
  tipos: string[];
  observacion: boolean;
  acompanado: boolean;
  representantes: string;
  secciones: string;
  regiones: string;
  fuerzas: string;
}