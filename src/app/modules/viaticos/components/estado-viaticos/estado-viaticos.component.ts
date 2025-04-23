import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-estado-viaticos',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzProgressModule],
  templateUrl: './estado-viaticos.component.html',
  styleUrl: './estado-viaticos.component.less'
})
export class EstadoViaticosComponent {
  @Input() titulo: string = "";
  @Input() datos: { nombre: string; monto: number; color: string }[] = [];

  estados: { nombre: string; monto: number; porcentaje: number; color: string }[] = [];

  ngOnInit(): void {
    const total = this.datos.reduce((sum, item) => sum + item.monto, 0);

    this.estados = this.datos.map(d => ({
      ...d,
      porcentaje: total ? (d.monto / total) * 100 : 0
    }));
  }
}
