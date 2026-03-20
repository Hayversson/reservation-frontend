import { Routes } from '@angular/router';

import { ReservasComponent } from './reservas/components/reservas/reservas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'reservas', pathMatch: 'full' },
  { path: 'reservas', component: ReservasComponent }
];
