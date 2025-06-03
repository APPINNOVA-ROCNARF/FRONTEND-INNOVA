import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ResumenCoberturaClientes } from '../../interfaces/consolidado-clientes-api-response';

@Component({
  selector: 'app-tabla-cobertura-clientes',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './tabla-cobertura-clientes.component.html',
  styleUrl: './tabla-cobertura-clientes.component.less'
})
export class TablaCoberturaClientesComponent {
  @Input() data: ResumenCoberturaClientes[] = [];
  @Input() isLoading = false;
  @Input() seccionesKeys: string[] = [];
  @Input() seccionesLabels: Record<string, string> = {};
  @Input() seccionesVisibles: Record<string, boolean> = {};
  @Input() columnasVisibles: { visita: boolean; venta: boolean; total: boolean } = {
    visita: true,
    venta: true,
    total: true,
  };
  @Input() sortFns: Record<string, (a: ResumenCoberturaClientes, b: ResumenCoberturaClientes) => number> = {};

  getColspan(): number {
    let span = 0;
    if (this.columnasVisibles.visita) span += 2;
    if (this.columnasVisibles.venta) span += 2;
    span += 1;
    return span;
  }
}
