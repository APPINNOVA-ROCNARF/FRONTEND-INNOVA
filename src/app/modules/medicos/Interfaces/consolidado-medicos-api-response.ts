export interface ConsolidadoMedico {
  seccion: string;
  representante: string;
  region: string,
  fuerzaVenta: string;
  totalMed: number;
  totalEfect: number;
  potencial: number;
  totalPuntos: number;
  rvMed: number;
  rvEfect: number;
  rvPot: number;
  rvPuntos: number;
  aMed: number;
  aEfect: number;
  aPot: number;
  aPuntos: number;
  bMed: number;
  bEfect: number;
  bPot: number;
  bPuntos: number;
  cMed: number;
  cEfect: number;
  cPot: number;
  cPuntos: number;
  pcMed: number;
  pcEfect: number;
  pcPot: number;
  pcPuntos: number;
    [key: string]: string | number;

}