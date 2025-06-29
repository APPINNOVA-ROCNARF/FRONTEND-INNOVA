import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { Observable } from 'rxjs';
import { UsuarioAppSelect } from '../../../../shared/services/asesores-service/Interfaces/asesores-api-response';
import { SeccionesSelect } from '../../../../shared/services/secciones-service/Interfaces/secciones-api-response';
import { FuerzaSelectDTO } from '../../../../shared/services/fuerzas-service/Interfaces/FuerzaSelectDTO';
import { VisitasPlanificadasFiltros } from '../../interfaces/visitas-planificadas-response';

@Component({
  selector: 'app-filtros-visitas-planificadas',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzCollapseModule,
    NzButtonModule,
    NzCheckboxModule,
    NzSelectModule,
    NzFormModule,
    NzDividerModule,
    NzSwitchModule,
    CommonModule,
  ],
  templateUrl: './filtros-visitas-planificadas.component.html',
  styleUrl: './filtros-visitas-planificadas.component.less',
})
export class FiltrosVisitasPlanificadasComponent implements OnInit {
  @Input() clienteZ = true;
  @Input() medico = true;
  @Input() clienteGenerico = true;

  @Input() observacion = true;
  @Input() acompanado = true;

  @Output() clienteZChange = new EventEmitter<boolean>();
  @Output() medicoChange = new EventEmitter<boolean>();
  @Output() clienteGenericoChange = new EventEmitter<boolean>();
  @Output() observacionChange = new EventEmitter<boolean>();
  @Output() acompanadoChange = new EventEmitter<boolean>();

  // Asesores
  @Input() representantes$!: Observable<UsuarioAppSelect[]>;
  representanteOptions: { label: string; value: string }[] = [];
  @Input() representantesSeleccionados: string[] = [];
  @Output() representantesSeleccionadosChange = new EventEmitter<string[]>();

  // Secciones
  @Input() secciones$!: Observable<SeccionesSelect[]>;
  seccionesOptions: { label: string; value: string }[] = [];
  @Input() seccionesSeleccionadas: string[] = [];
  @Output() seccionesSeleccionadasChange = new EventEmitter<string[]>();

  // Regiones
  @Input() regionesSeleccionadas: string[] = [];
  regiones = ['COSTA', 'SIERRA', 'AUSTRO'];
  @Output() regionesChange = new EventEmitter<string[]>();

  // Fuerzas
  @Input() fuerzas$!: Observable<FuerzaSelectDTO[]>;
  fuerzasOptions: { label: string; value: string }[] = [];
  @Input() fuerzasSeleccionadas: string[] = [];
  @Output() fuerzasSeleccionadasChange = new EventEmitter<string[]>();

  @Output() aplicarFiltros = new EventEmitter<VisitasPlanificadasFiltros>();

  ngOnInit(): void {
    this.representantes$.subscribe((lista) => {
      this.representanteOptions = lista.map((r) => ({
        label: r.nombre,
        value: r.nombreUsuario,
      }));
    });

    this.secciones$.subscribe((lista) => {
      this.seccionesOptions = lista.map((r) => ({
        label: r.codigo,
        value: r.codigo,
      }));
    });

    this.fuerzas$.subscribe((lista) => {
      this.fuerzasOptions = lista.map((r) => ({
        label: r.nombre,
        value: r.nombre,
      }));
    });
  }

aplicar(): void {
  const tipos: string[] = [];
  if (this.clienteZ) tipos.push('CLI Z');
  if (this.medico) tipos.push('MEDICO');
  if (this.clienteGenerico) tipos.push('GENERICO');

  // Emitimos TODO el estado de los filtros
  this.aplicarFiltros.emit({
    tipos,
    observacion : this.observacion,
    acompanado  : this.acompanado,
    representantes: this.representantesSeleccionados.join(','),
    secciones: this.seccionesSeleccionadas.join(','),
    regiones: this.regionesSeleccionadas.join(','),
    fuerzas: this.fuerzasSeleccionadas.join(','),
  });
}
}
