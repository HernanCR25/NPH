
export interface MovementKardex {
  kardexId: number;
  documentId: number;
  cantidadEntrada: number;
  costoUnitarioEntrada: number;
  valorTotalEntrada:number;
  cantidadSalida: number;
  costoUnitarioSalida: number;
  valorTotalSalida: number;
  costoUnitarioSaldo: number;
  valorTotalSaldo: number;
  observation : string;
  cantidadSaldo: number;
}
