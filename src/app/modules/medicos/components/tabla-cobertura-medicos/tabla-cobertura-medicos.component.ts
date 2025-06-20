import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ConsolidadoMedico } from '../../Interfaces/consolidado-medicos-api-response';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-tabla-cobertura-medicos',
  standalone: true,
  imports: [
    FormsModule,
    NzCheckboxModule,
    NzTableModule,
    CommonModule,
    ReactiveFormsModule,
    NzIconModule,
    NzToolTipModule,
  ],
  templateUrl: './tabla-cobertura-medicos.component.html',
  styleUrl: './tabla-cobertura-medicos.component.less',
})
export class TablaCoberturaMedicosComponent {
  @Input() data: ConsolidadoMedico[] = [];
  @Input() isLoading = false;
  @Input() seccionesKeys: string[] = [];
  @Input() seccionesLabels: Record<string, string> = {};
  @Input() seccionesVisibles: Record<string, boolean> = {};
  @Input() sortFns: Record<
    string,
    (a: ConsolidadoMedico, b: ConsolidadoMedico) => number
  > = {};

  pageSize = 25;
  pageIndex = 1;

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
  }

  getField(key: string, tipo: string): string {
    const map: Record<string, string> = {
      rv: 'rv',
      a: 'a',
      b: 'b',
      c: 'c',
      pc: 'pc',
      total: 'total',
    };
    return `${map[key]}${tipo}`;
  }

  getSortKey(key: string): string {
    return `${key}Puntos`;
  }
}
