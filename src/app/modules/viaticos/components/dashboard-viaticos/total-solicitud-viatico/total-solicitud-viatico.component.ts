import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-total-viaticos',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzDividerModule, NzTagModule],
  templateUrl: './total-solicitud-viatico.component.html',
  styleUrl: './total-solicitud-viatico.component.less'
})
export class TotalSolicitudViaticoComponent {
  @Input() totalViaticos: number = 0;
  @Input() totalRegistros: number = 0;
}
