import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { GuiaProducto } from '../../../interfaces/guias-api-response';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tabla-guias-producto',
  standalone: true,
  imports: [NzToolTipModule, NzTableModule, NzIconModule, CommonModule, NzButtonModule,NzDividerModule],
  templateUrl: './tabla-guias-producto.component.html',
  styleUrl: './tabla-guias-producto.component.less'
})
export class TablaGuiasProductoComponent {
  @Input() guias: GuiaProducto[] = [];

  constructor(
    public router : Router,
    public route: ActivatedRoute
  ){}
}
