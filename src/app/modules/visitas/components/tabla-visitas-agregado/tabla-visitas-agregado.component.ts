import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ResumenVisitaPlanificadaAgregado } from '../../interfaces/visitas-planificadas-response';

@Component({
  selector: 'app-tabla-visitas-agregado',
  standalone: true,
  imports: [NzTableModule, CommonModule, ReactiveFormsModule],
  templateUrl: './tabla-visitas-agregado.component.html',
  styleUrl: './tabla-visitas-agregado.component.less'
})
export class TablaVisitasAgregadoComponent {
  @Input() data: ResumenVisitaPlanificadaAgregado[] = [];
  @Input() isLoading = false;

  
  @Input() showClienteZ = true;
  @Input() showMedico = true;
  @Input() showClienteGenerico = true;

columnConfigs = [
  // Columnas fijas siempre visibles
  { key: 'seccion',                 width: 120, always: true },
  { key: 'representante',           width: 250, always: true },
  { key: 'region',                  width: 100, always: true },
  { key: 'fuerza',                  width: 100, always: true },

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
}
