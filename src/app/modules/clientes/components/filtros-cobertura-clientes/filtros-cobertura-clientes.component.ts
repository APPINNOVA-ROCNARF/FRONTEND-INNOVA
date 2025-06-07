import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { UsuarioAppSelect } from '../../../../shared/services/asesores-service/Interfaces/asesores-api-response';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SeccionesSelect } from '../../../../shared/services/secciones-service/Interfaces/secciones-api-response';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-filtros-cobertura-clientes',
  standalone: true,
  imports: [
    NzTypographyModule,
    NzButtonModule,
    NzSelectModule,
    NzCollapseModule,
    NzSwitchModule,
    NzInputModule,
    NzCheckboxModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzDropDownModule,
    NzIconModule,
    DragDropModule,
  ],
  templateUrl: './filtros-cobertura-clientes.component.html',
  styleUrl: './filtros-cobertura-clientes.component.less',
})
export class FiltrosCoberturaClientesComponent implements OnInit {
  hover = '';
  @Input() columnasVisibles!: Record<string, boolean>;
  @Input() seccionesVisibles!: Record<string, boolean>;
  @Input() seccionesKeys!: string[];
  @Input() seccionesLabels!: Record<string, string>;

  @Output() columnasVisiblesChange = new EventEmitter();
  @Output() seccionesVisiblesChange = new EventEmitter();
  @Output() filtroChange = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() drop = new EventEmitter();

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
  }

validarVisibilidad(campo: 'visita' | 'venta' | 'cobranza') {
  const visibles = this.columnasVisibles;
  const otrosCampos = Object.entries(visibles)
    .filter(([key]) => key !== campo)
    .map(([_, v]) => v);

  // Si todos los demás están desactivados, vuelve a activar este
  if (!otrosCampos.some(v => v)) {
    this.columnasVisibles[campo] = true;
  }

  this.columnasVisiblesChange.emit(this.columnasVisibles);
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

  dropSeccion(event: unknown) {
    this.drop.emit(event);
  }

  filtrarData() {
    this.filtroChange.emit();
  }
}
