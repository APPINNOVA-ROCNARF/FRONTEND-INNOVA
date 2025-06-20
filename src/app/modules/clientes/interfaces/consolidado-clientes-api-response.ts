export interface ResumenCoberturaClientes {
  seccion: string;
  representante: string;
  region: string;
  fuerza: string;

  total_CLACT: number;
  total_CLINC: number;
  total_CONTA: number;
  total_CLIZ: number;

  visita_CLACT: number;
  visita_CLINC: number;
  visita_CONTA: number;
  visita_CLIZ: number;

  porcentaje_Visita_CLACT: number;
  porcentaje_Visita_CLINC: number;
  porcentaje_Visita_CONTA: number;
  porcentaje_Visita_CLIZ: number;

  venta_CLACT: number;
  venta_CLINC: number;
  venta_CONTA: number;
  venta_CLIZ: number;

  porcentaje_Venta_CLACT: number;
  porcentaje_Venta_CLINC: number;
  porcentaje_Venta_CONTA: number;
  porcentaje_Venta_CLIZ: number;

  cobro_CLACT: number;
  cobro_CLINC: number;
  cobro_CONTA: number;
  cobro_CLIZ: number;

  porcentaje_Cobro_CLACT: number;
  porcentaje_Cobro_CLINC: number;
  porcentaje_Cobro_CONTA: number;
  porcentaje_Cobro_CLIZ: number;

  [key: string]: string | number | any; 
}
