import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { ReservaRequest, ReservaResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private readonly http = inject(HttpClient);

  private readonly apiBaseUrl = this.normalizeBaseUrl(environment.backendUrl);
  private readonly reservasUrl = this.apiBaseUrl
    ? `${this.apiBaseUrl}/reservas`
    : 'api/reservas';

  private normalizeBaseUrl(url: string): string {
    // Evita doble slash al unir URLs (ej: "http://x:8090/" -> "http://x:8090").
    return url.replace(/\/+$/, '');
  }

  obtenerTodasLasReservas(): Observable<ReservaResponse[]> {
    return this.http.get<ReservaResponse[]>(this.reservasUrl);
  }

  crearReserva(request: ReservaRequest): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(this.reservasUrl, request);
  }

  cancelarReserva(id: number): Observable<ReservaResponse> {
    return this.http.delete<ReservaResponse>(`${this.reservasUrl}/${id}`);
  }
}

