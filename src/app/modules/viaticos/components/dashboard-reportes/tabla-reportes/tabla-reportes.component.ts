import { Component, Input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ViaticoReporte } from '../../../interfaces/viatico-api-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-reportes',
  standalone: true,
  imports: [NzTableModule, CommonModule],
  templateUrl: './tabla-reportes.component.html',
  styleUrl: './tabla-reportes.component.less'
})
export class TablaReportesComponent {
  @Input() reporte: ViaticoReporte[] = [];
  @Input() loading = false;
}
