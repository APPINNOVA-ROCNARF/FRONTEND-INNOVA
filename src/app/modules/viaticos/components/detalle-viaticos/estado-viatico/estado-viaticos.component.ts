import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-estado-viatico',
  standalone: true,
  imports: [
    NzCardModule,
    NzProgressModule
  ],
  templateUrl: './estado-viatico.component.html',
  styleUrl: './estado-viatico.component.less'
})
export class EstadoViaticoComponent {

}
