import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-estado-viaticos',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzProgressModule],
  templateUrl: './estado-viaticos.component.html',
  styleUrl: './estado-viaticos.component.less',
})
export class EstadoViaticosComponent {
  @Input() titulo: string = '';
  @Input() datos: { nombre: string; monto: number; color: string }[] = [];

  get datosConPorcentaje() {
    const total = this.datos.reduce((sum, d) => sum + d.monto, 0);
    return this.datos.map((d) => ({
      ...d,
      porcentaje: total ? (d.monto / total) * 100 : 0,
    }));
  }
}
