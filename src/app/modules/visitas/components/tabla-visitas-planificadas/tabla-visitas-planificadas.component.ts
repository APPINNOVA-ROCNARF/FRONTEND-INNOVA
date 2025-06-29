import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { EstadoTagPipe } from '../../pipes/EstadoTag.pipe';
import { ResumenVisitasPlanificada } from '../../interfaces/visitas-planificadas-response';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-tabla-visitas-planificadas',
  standalone: true,
  imports: [
    NzDividerModule,
    NzTableModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzPaginationModule,
    NzTagModule,
    EstadoTagPipe,
    NzSpaceModule,
    NzDropDownModule,
    NzCheckboxModule,
    NzIconModule,
    NzToolTipModule,
  ],
  templateUrl: './tabla-visitas-planificadas.component.html',
  styleUrl: './tabla-visitas-planificadas.component.less',
})
export class TablaVisitasPlanificadasComponent {
  @Input() data: ResumenVisitasPlanificada[] = [];
  @Input() isLoading = false;
  @Input() pageIndex = 1;
  @Input() pageSize = 50;
  @Input() totalItems = 0;

  @Input() showClienteZ = true;
  @Input() showMedico = true;
  @Input() showClienteGenerico = true;
  @Input() showObservacion = true;
  @Input() showAcompanado = true;

  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  onPageIndexChange(idx: number): void {
    this.pageIndexChange.emit(idx);
  }

columnConfigs = [
  // Columnas fijas siempre visibles
  { key: 'seccion',                 width: 120, always: true },
  { key: 'representante',           width: 250, always: true },
  { key: 'region',                  width: 100, always: true },
  { key: 'fuerza',                  width: 100, always: true },
  { key: 'fechaPlanificada',        width: 150, always: true },
  { key: 'fechaEjecutada',          width: 150, always: true },
  { key: 'nombreCliente',           width: 200, always: true },
  { key: 'estado',                  width: 120, always: true },
  { key: 'revisita',                width: 100, always: true },
  { key: 'visitaSinGestion',        width: 100, always: true },

  // Columnas opcionales "Observación" y "Acompañado"
  { key: 'observacion',             width: 300, visible: () => this.showObservacion },
  { key: 'acompanante',             width: 200, visible: () => this.showAcompanado},

  // BLOQUE CLIENTE Z (8 columnas)
  { key: 'clienteZCajasVaciasPlanificado',    width: 150, visible: () => this.showClienteZ },
  { key: 'clienteZCajasVaciasEjecutado',      width: 100, visible: () => this.showClienteZ },
  { key: 'clienteZVisitaPromocionalPlanificado', width: 150, visible: () => this.showClienteZ },
  { key: 'clienteZVisitaPromocionalEjecutado',   width: 100, visible: () => this.showClienteZ },
  { key: 'clienteZPuntoContactoPlanificado',  width: 150, visible: () => this.showClienteZ },
  { key: 'clienteZPuntoContactoEjecutado',    width: 100, visible: () => this.showClienteZ },
  { key: 'clienteZEntregaPremiosPlanificado', width: 150, visible: () => this.showClienteZ },
  { key: 'clienteZEntregaPremiosEjecutado',   width: 100, visible: () => this.showClienteZ },

  // BLOQUE MÉDICO (4 columnas)
  { key: 'medicoVisitaPromocionalPlanificado', width: 150, visible: () => this.showMedico },
  { key: 'medicoVisitaPromocionalEjecutado',   width: 100, visible: () => this.showMedico },
  { key: 'medicoPuntoContactoPlanificado',     width: 150, visible: () => this.showMedico },
  { key: 'medicoPuntoContactoEjecutado',       width: 100, visible: () => this.showMedico },

  // BLOQUE CLIENTE GENÉRICO (16 columnas)
  { key: 'clienteCajasVaciasPlanificado',      width: 150, visible: () => this.showClienteGenerico },
  { key: 'clienteCajasVaciasEjecutado',        width: 100, visible: () => this.showClienteGenerico },
  { key: 'clienteSiembraProductosPlanificado', width: 150, visible: () => this.showClienteGenerico },
  { key: 'clienteSiembraProductosEjecutado',   width: 100, visible: () => this.showClienteGenerico },
  { key: 'clienteVisitaPromocionalPlanificado', width: 150, visible: () => this.showClienteGenerico },
  { key: 'clienteVisitaPromocionalEjecutado',   width: 100, visible: () => this.showClienteGenerico },
  { key: 'clientePuntoContactoPlanificado',     width: 150, visible: () => this.showClienteGenerico },
  { key: 'clientePuntoContactoEjecutado',       width: 100, visible: () => this.showClienteGenerico },
  { key: 'clienteEntregaPremiosPlanificado',    width: 150, visible: () => this.showClienteGenerico },
  { key: 'clienteEntregaPremiosEjecutado',      width: 100, visible: () => this.showClienteGenerico },
  { key: 'clienteDevolucionPlanificado',        width: 150, visible: () => this.showClienteGenerico },
  { key: 'clienteDevolucionEjecutado',          width: 100, visible: () => this.showClienteGenerico },
  { key: 'clientePedidoPlanificado',            width: 150, visible: () => this.showClienteGenerico },
  { key: 'clientePedidoEjecutado',              width: 100, visible: () => this.showClienteGenerico },
  { key: 'clienteCobroPlanificado',             width: 150, visible: () => this.showClienteGenerico },
  { key: 'clienteCobroEjecutado',               width: 100, visible: () => this.showClienteGenerico },
];

getTableWidth(): string {
  const total = this.columnConfigs
    .filter(col => col.always || col.visible?.())
    .reduce((sum, col) => sum + col.width, 0);
  return `${total}px`;
}
  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }
}
