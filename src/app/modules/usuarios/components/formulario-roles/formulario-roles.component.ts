import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';

// NG Zorro
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Modulo, RolDetalle } from '../../interfaces/rol-api-response';
import { RolService } from '../../services/rol.service';
import { BehaviorSubject, combineLatest, map, Observable, take, tap } from 'rxjs';
import { PermisosPipe } from '../../pipes/PermisosPipe';

@Component({
  selector: 'app-rol-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzTypographyModule,
    NzIconModule,
    NzTableModule,
    NzTagModule,
    NzSelectModule,
    NzSwitchModule,
    NzDividerModule,
    NzCollapseModule,
    NzRadioModule,
    NzToolTipModule,
    NzInputModule,
    PermisosPipe,
  ],
  templateUrl: './formulario-roles.component.html',
  styleUrls: ['./formulario-roles.component.less'],
})
export class RolFormComponent implements OnInit {
  @Input() visible = false;
  @Input() rolId: number | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  rolForm!: FormGroup;

  private filtroModuloIdSubject = new BehaviorSubject<number>(0);
  filtroModuloId$ = this.filtroModuloIdSubject.asObservable();

  setFiltroModulo(id: number): void {
    this.filtroModuloIdSubject.next(id);
  }

  filtroModulos$!: Observable<Modulo[]>;

  private expandedPanelsSubject = new BehaviorSubject<Record<number, boolean>>(
    {}
  );
  expandedPanels$ = this.expandedPanelsSubject.asObservable();

  constructor(private fb: FormBuilder, public rolService: RolService) {}

ngOnInit(): void {
  this.rolService.fetchRolDetalle(1).subscribe();

  this.filtroModulos$ = combineLatest([
    this.rolService.rolDetalle$.pipe(map(r => r?.modulos ?? [])),
    this.filtroModuloId$
  ]).pipe(
    tap(([modulos, filtro]) => {
      console.log('🔍 Modulos originales:', modulos);
      console.log('🔍 Filtro aplicado:', filtro);
    }),
    map(([modulos, filtroId]) =>
      filtroId === 0 ? modulos : modulos.filter(m => m.moduloId === filtroId)
    )
  );

    this.initForm();
  }

  private initForm(): void {
    this.rolForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      status: [true],
    });
  }

  // Leer el valor actual (snapshot)
  getExpandedState(): Record<number, boolean> {
    return this.expandedPanelsSubject.getValue();
  }

  // Actualizar un solo panel
  setExpandedPanel(id: number, state: boolean): void {
    const current = this.getExpandedState();
    this.expandedPanelsSubject.next({ ...current, [id]: state });
  }

  toggleAllPanels(modulos: Modulo[]): void {
    const current = this.getExpandedState();
    const allExpanded = modulos.every((m) => current[m.moduloId]);

    const updated: Record<number, boolean> = {};
    modulos.forEach((m) => {
      updated[m.moduloId] = !allExpanded;
    });

    this.expandedPanelsSubject.next(updated);
  }

  expandAllPanels(): void {
    this.filtroModulos$.pipe(take(1)).subscribe((modulos) => {
      this.toggleAllPanels(modulos);
    });
  }

  setPermissionAccessLevel(
    permisoId: number,
    nivel: 'Lectura' | 'Edición' | 'Control total' | null
  ): void {
    const detalle = this.rolService.getRolDetalleSnapshot();
    if (!detalle) return;

    const accionesPorNivel: Record<string, string[]> = {
      Lectura: ['Leer'],
      Edición: ['Leer', 'Actualizar'],
      'Control total': ['Leer', 'Actualizar', 'Crear', 'Eliminar'],
    };

    const nuevasAcciones = accionesPorNivel[nivel ?? ''] ?? [];

    for (const modulo of detalle.modulos) {
      const permiso = modulo.permisos.find((p) => p.permisoId === permisoId);
      if (permiso) {
        permiso.acciones.forEach((accion) => {
          accion.seleccionado = nuevasAcciones.includes(accion.nombreAccion);
        });
        break;
      }
    }
  }

  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  submitForm(): void {}
}
