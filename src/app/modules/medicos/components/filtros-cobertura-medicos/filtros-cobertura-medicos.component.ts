import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioAppSelect } from '../../../../shared/services/asesores-service/Interfaces/asesores-api-response';
import { SeccionesSelect } from '../../../../shared/services/secciones-service/Interfaces/secciones-api-response';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuerzaSelectDTO } from '../../../../shared/services/fuerzas-service/Interfaces/FuerzaSelectDTO';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-filtros-cobertura-medicos',
  standalone: true,
  imports: [
    NzCollapseModule,
    NzSelectModule,
    CommonModule,
    FormsModule,
    DragDropModule,
    NzCheckboxModule,
    NzButtonModule
  ],
  templateUrl: './filtros-cobertura-medicos.component.html',
  styleUrl: './filtros-cobertura-medicos.component.less',
})
export class FiltrosCoberturaMedicosComponent implements OnInit {
  @Input() seccionesKeys!: string[];
  @Input() seccionesLabels!: Record<string, string>;
  @Input() seccionesVisibles!: Record<string, boolean>;

  @Output() dropEvent = new EventEmitter();

  // Representantes
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

  ngOnInit(): void {
    this.representantes$.subscribe((lista) => {
      this.representanteOptions = lista.map((r) => ({
        label: r.nombre,
        value: r.nombre,
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

  emitirRepresentantesSeleccionados() {
    this.representantesSeleccionadosChange.emit(
      this.representantesSeleccionados
    );
  }

  emitirRegionesSeleccionadas(): void {
    this.regionesChange.emit(this.regionesSeleccionadas);
  }

  emitirSeccionesSeleccionadas(): void {
    this.seccionesSeleccionadasChange.emit(this.seccionesSeleccionadas);
  }

  emitirFuerzasSeleccionadas(): void {
    this.fuerzasSeleccionadasChange.emit(this.fuerzasSeleccionadas);
  }

  dropSeccion(event: unknown) {
    this.dropEvent.emit(event);
  }
}
