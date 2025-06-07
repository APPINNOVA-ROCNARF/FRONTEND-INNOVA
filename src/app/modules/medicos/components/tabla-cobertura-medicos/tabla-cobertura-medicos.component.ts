import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ConsolidadoMedico } from '../../Interfaces/consolidado-medicos-api-response';

@Component({
  selector: 'app-tabla-cobertura-medicos',
  standalone: true,
  imports: [NzTableModule, CommonModule, ReactiveFormsModule],
  templateUrl: './tabla-cobertura-medicos.component.html',
  styleUrl: './tabla-cobertura-medicos.component.less'
})
export class TablaCoberturaMedicosComponent {
  @Input() data: ConsolidadoMedico[] = [];
  @Input() isLoading = false;
  @Input() sortFns: Record<string, (a: ConsolidadoMedico, b: ConsolidadoMedico) => number> = {};

}
