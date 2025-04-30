import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-presupuesto-viaticos-main',
  standalone: true,
  imports: [RouterModule],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class PresupuestoViaticosMainComponent {
}
