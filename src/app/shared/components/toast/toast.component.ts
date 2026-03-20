import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: 'toast.component.html',
  styleUrl: 'toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'alert',
    'aria-live': 'assertive'
  }
})
export class ToastComponent {
  readonly message = input.required<string>();
  readonly onClose = output<void>();

  readonly closeLabel = computed(() => `Cerrar: ${this.message()}`);

  close(): void {
    this.onClose.emit();
  }
}

