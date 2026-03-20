export interface ReservaRequest {
  customerName: string;
  date: string; // ISO: YYYY-MM-DD
  time: string; // ISO: HH:mm:ss (o compatible con LocalTime de Java)
  service: string;
}

