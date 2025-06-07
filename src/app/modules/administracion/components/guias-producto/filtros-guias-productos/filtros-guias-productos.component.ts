import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-filtros-guias-productos',
  standalone: true,
  imports: [NzCardModule, NzSelectModule],
  templateUrl: './filtros-guias-productos.component.html',
  styleUrl: './filtros-guias-productos.component.less'
})
export class FiltrosGuiasProductosComponent {

}
