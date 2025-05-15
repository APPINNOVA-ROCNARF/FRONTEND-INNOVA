import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-estado-ciclo',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzProgressModule, NzButtonModule, NzToolTipModule, NzIconModule],
  templateUrl: './estado-ciclo.component.html',
  styleUrl: './estado-ciclo.component.less'
})
export class EstadoCicloComponent {
  @Input() porcentaje = 0;
  @Input() completado = 0; 
  @Input() tooltip = '';
  @Input() estadoTexto = 'Ciclo en progreso';
  @Input() color = 'blue';
}
