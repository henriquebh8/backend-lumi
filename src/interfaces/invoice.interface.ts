export interface Invoice {
  id: number;
  clienteId: string;
  mesReferencia: string;
  energiaKWh: number;
  energiaValor: number;
  sceeKWh: number;
  sceeValor: number;
  compensadaKWh: number;
  compensadaValor: number;
  contribIlum: number;
  pdfPath?: string;
}
