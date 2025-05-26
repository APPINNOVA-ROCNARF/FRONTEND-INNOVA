import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { HistorialViatico } from '../../../interfaces/viatico-api-response';


@Component({
  selector: 'app-historial-viatico',
  standalone: true,
  imports: [NzTagModule, NzIconModule,  CommonModule, NzListModule, NzTypographyModule],
  templateUrl: './historial-viatico.component.html',
  styleUrl: './historial-viatico.component.less'
})
export class HistorialViaticoComponent{
  @Input() datos: HistorialViatico[] = [];
   @Input() loading = false;
  labelMap: Record<string,string> = {
    NumeroFactura: 'Número de factura',
    EdicionFactura: 'Edición de factura',
    CambioEstadoViatico: 'Cambio de estado'
  };


    getLabel(campo: string): string {
    return this.labelMap[campo] ?? campo;
  }

    getTagColor(valor: string): string {
    switch (valor.toLowerCase()) {
      case 'aprobado':  return 'green';
      case 'rechazado': return 'red';
      case 'devuelto': return 'orange';
      case 'enRevision': return 'blue';
      case 'borrador': return 'default';
      default:          return 'blue';
    }
  }

}
