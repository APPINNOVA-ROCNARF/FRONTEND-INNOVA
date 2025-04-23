import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-estado-ciclo',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzProgressModule, NzTagModule, NzButtonModule, NzToolTipModule],
  templateUrl: './estado-ciclo.component.html',
  styleUrl: './estado-ciclo.component.less'
})
export class EstadoCicloComponent {
  @Input() porcentaje: number = 0;
  @Input() completado: number = 0; 
  @Input() tooltip: string = '';
  @Input() estadoTexto: string = 'Ciclo en progreso';
}
