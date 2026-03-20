import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ReservaService } from '../../services/reserva.service';
import type { ReservaRequest, ReservaResponse } from '../../models';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-reservas',
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
  templateUrl: 'reservas.component.html',
  styleUrl: 'reservas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservasComponent implements OnInit {
  private readonly reservaService = inject(ReservaService);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly reservas = signal<ReservaResponse[]>([]);
  readonly cargando = signal<boolean>(false);
  readonly guardando = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly cancelandoId = signal<number | null>(null);
  readonly toastError = signal<string | null>(null);
  readonly mostrarFormulario = signal<boolean>(false);

  readonly serviciosDisponibles = [
    'Corte de cabello',
    'Barba',
    'Corte + Barba',
    'Manicura',
    'Masaje relajante'
  ] as const;

  readonly form = this.fb.group({
    nombreCliente: this.fb.control('', { validators: [Validators.required] }),
    fecha: this.fb.control('', { validators: [Validators.required] }),
    hora: this.fb.control('', { validators: [Validators.required] }),
    servicio: this.fb.control('', { validators: [Validators.required] })
  });

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.reservaService
      .obtenerTodasLasReservas()
      .pipe(
        finalize(() => {
          this.cargando.set(false);
          this.cancelandoId.set(null);
        })
      )
      .subscribe({
        next: (reservas) => this.reservas.set(reservas),
        error: () => {
          this.error.set('No se pudieron cargar las reservas.');
        }
      });
  }

  cancelarReserva(id: number): void {
    this.cancelandoId.set(id);
    this.error.set(null);

    this.reservaService
      .cancelarReserva(id)
      .pipe(finalize(() => this.cancelandoId.set(null)))
      .subscribe({
        next: (cancelada) => {
          this.reservas.update((list) =>
            list.map((r) => (r.id === id ? cancelada : r))
          );
        },
        error: () => {
          this.error.set('No se pudo cancelar la reserva.');
        }
      });
  }

  crearReserva(): void {
    this.toastError.set(null);
    this.error.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const request: ReservaRequest = {
      customerName: value.nombreCliente.trim(),
      date: value.fecha,
      time: value.hora,
      service: value.servicio
    };

    this.guardando.set(true);
    this.reservaService
      .crearReserva(request)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (creada) => {
          this.reservas.update((list) => [creada, ...list]);
          this.form.reset({
            nombreCliente: '',
            fecha: '',
            hora: '',
            servicio: ''
          });
          this.mostrarFormulario.set(false);
        },
        error: () => {
          this.toastError.set('Error al guardar la reserva. Inténtalo nuevamente.');
        }
      });
  }

  cerrarToast(): void {
    this.toastError.set(null);
  }

  abrirFormulario(): void {
    this.mostrarFormulario.set(true);
    this.toastError.set(null);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.form.reset({
      nombreCliente: '',
      fecha: '',
      hora: '',
      servicio: ''
    });
  }
}

