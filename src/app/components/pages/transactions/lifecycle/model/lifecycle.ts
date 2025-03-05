export interface CicloVida {
  id: number;
  henId: number; // Relación con la gallina
  typeIto: string;
  nameIto: string;
  typeTime: string;
  times: number;
  endDate: Date; // LocalDate en Java se maneja como string en JSON
  status: string;
}
