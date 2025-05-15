import { Component, Input} from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { EstadisticaViatico } from '../../../interfaces/viatico-api-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estado-viatico',
  standalone: true,
  imports: [
    NzCardModule,
    NzProgressModule,
    CommonModule
  ],
  templateUrl: './estado-viatico.component.html',
  styleUrl: './estado-viatico.component.less'
})
export class EstadoViaticoComponent {
  @Input() data!: EstadisticaViatico;
  @Input() color = '#999';
}
