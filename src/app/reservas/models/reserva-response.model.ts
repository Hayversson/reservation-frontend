import type { ReservaStatus } from './reserva-status.model';

export interface ReservaResponse {
  id: number;
  customerName: string;
  date: string; // ISO: YYYY-MM-DD
  time: string; // ISO: HH:mm:ss
  service: string;
  status: ReservaStatus;
}

