import { Component } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { EstadoViaticoComponent } from "../estado-viatico/estado-viaticos.component";

@Component({
  selector: 'app-estadistica-viatico',
  standalone: true,
  imports: [
    NzGridModule,
    EstadoViaticoComponent],
  templateUrl: './estadistica-viatico.component.html',
  styleUrl: './estadistica-viatico.component.less'
})
export class EstadisticaViaticoComponent {

}
