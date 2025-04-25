import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

@Component({
  selector: 'app-datos-solicitud',
  standalone: true,
  imports: [
    NzCardModule,
    NzDescriptionsModule
  ],
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.less'
})
export class DatosSolicitudComponent {

}
