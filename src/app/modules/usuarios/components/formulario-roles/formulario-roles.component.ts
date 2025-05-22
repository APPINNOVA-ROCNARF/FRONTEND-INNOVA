import { Component, OnInit, Input } from '@angular/core';
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
import { Modulo } from '../../interfaces/roles/rol-api-response';
import { RolStateService } from '../../services/roles/rol-state.service';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  take,
} from 'rxjs';
import { PermisosPipe } from '../../pipes/PermisosPipe';
import { ActivatedRoute } from '@angular/router';

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
  tituloFormulario = '';
  @Input() rolId: number | null = null;

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

  constructor(
    private fb: FormBuilder,
    public rolState: RolStateService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.rolId = Number(this.route.snapshot.paramMap.get('id'));
    this.tituloFormulario = this.rolId ? 'Editar Rol' : 'Nuevo Rol';

    if (this.rolId) {
      this.rolState.fetchRolDetalle(this.rolId);
    }

    this.rolState.fetchModulos();

    this.filtroModulos$ = combineLatest([
      this.rolState.modulo$,
      this.filtroModuloId$,
    ]).pipe(
      map(([modulos, filtroId]) =>
        filtroId === 0
          ? modulos
          : modulos.filter((m) => m.moduloId === filtroId)
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

  getExpandedState(): Record<number, boolean> {
    return this.expandedPanelsSubject.getValue();
  }

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

  setPermissionAccessLevel(permisoId: number, nivel: string): void {
    const accionesPorNivel: Record<string, string[]> = {
      Lectura: ['Leer'],
      Edición: ['Leer', 'Actualizar'],
      'Control total': ['Crear', 'Leer', 'Actualizar', 'Eliminar'],
    };

    const nuevasAcciones = accionesPorNivel[nivel ?? ''] ?? [];

    // Detectar si es edición o creación
    if (this.rolId) {
      const detalle = this.rolState.getRolDetalleSnapshot();
      if (!detalle) return;

      detalle.modulos.forEach((modulo) => {
        const permiso = modulo.permisos.find((p) => p.permisoId === permisoId);
        if (permiso) {
          permiso.acciones.forEach((accion) => {
            accion.seleccionado = nuevasAcciones.includes(accion.nombreAccion);
          });
        }
      });
    } else {
      const modulos = this.rolState.getModulosSnapshot();

      const actualizados = modulos.map((modulo) => ({
        ...modulo,
        permisos: modulo.permisos.map((permiso) => {
          if (permiso.permisoId !== permisoId) return permiso;
          return {
            ...permiso,
            acciones: permiso.acciones.map((accion) => ({
              ...accion,
              seleccionado: nuevasAcciones.includes(accion.nombreAccion),
            })),
          };
        }),
      }));

      this.rolState.setModulos(actualizados);
    }
  }

  submitForm(): void {
    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }

    const formValue = this.rolForm.value;

    this.rolState.modulo$.pipe(take(1)).subscribe((modulos) => {
      const modulosFiltrados = modulos
        .map((modulo) => {
          const permisosFiltrados = modulo.permisos
            .map((permiso) => {
              const accionesFiltradas = permiso.acciones.filter(
                (accion) => accion.seleccionado
              );

              return {
                permisoId: permiso.permisoId,
                nombrePermiso: permiso.nombrePermiso,
                seleccionado: accionesFiltradas.length > 0,
                acciones: accionesFiltradas,
              };
            })
            .filter((permiso) => permiso.seleccionado);

          return {
            moduloId: modulo.moduloId,
            nombreModulo: modulo.nombreModulo,
            seleccionado: permisosFiltrados.length > 0,
            permisos: permisosFiltrados,
          };
        })
        .filter((modulo) => modulo.seleccionado);

      const payload = {
        nombreRol: formValue.name,
        descripcion: formValue.description,
        modulos: modulosFiltrados,
      };

      this.rolState.crearRol(payload);

    });
  }
}
