import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, OnDestroy } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ConsolidadoVisitasMedicasService } from '../../../services/consolidado-visitas-medicas.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TablaCoberturaMedicosComponent } from '../../../components/tabla-cobertura-medicos/tabla-cobertura-medicos.component';
import { ConsolidadoMedico } from '../../../Interfaces/consolidado-medicos-api-response';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { CiclotateService } from '../../../../../shared/services/ciclos-service/ciclo-state.service';
import { CicloSelectDTO } from '../../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { map, Observable, Subscription } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { FiltrosCoberturaMedicosComponent } from '../../../components/filtros-cobertura-medicos/filtros-cobertura-medicos.component';
import { UsuarioAppSelect } from '../../../../../shared/services/asesores-service/Interfaces/asesores-api-response';
import { SeccionesSelect } from '../../../../../shared/services/secciones-service/Interfaces/secciones-api-response';
import { AsesoresStateService } from '../../../../../shared/services/asesores-service/asesores-state.service';
import { SeccionesStateService } from '../../../../../shared/services/secciones-service/secciones-state.service';

@Component({
  selector: 'app-dashboard-cobertura-medicos',
  standalone: true,
  imports: [
    NzDividerModule,
    NzDrawerModule,
    NzGridModule,
    NzTypographyModule,
    CommonModule,
    NzFormModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzButtonModule,
    FormsModule,
    NzRadioModule,
    NzSelectModule,
    NzIconModule,
    TablaCoberturaMedicosComponent,
    FiltrosCoberturaMedicosComponent,
  ],
  templateUrl: './dashboard-cobertura-medicos.component.html',
  styleUrl: './dashboard-cobertura-medicos.component.less',
})
export class DashboardCoberturaMedicosComponent implements OnInit, OnDestroy {
  dataOriginal: ConsolidadoMedico[] = [];
  data: ConsolidadoMedico[] = [];
  filtrosForm!: FormGroup;
  isLoading = false;
  modoFiltroFechas: 'ciclo' | 'rango' = 'ciclo';
  visible = false;

  // Ciclos

  cicloSeleccionado: number | null = null;

  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Signal<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;
  allCiclos: CicloSelectDTO[] = [];

  private ciclosSubscription: Subscription | undefined;

  // ASESORES

  asesores$!: Observable<UsuarioAppSelect[]>;
  asesoresLoading$!: Signal<boolean>;

  // SECCIONES

  secciones$!: Observable<SeccionesSelect[]>;
  seccionesLoading$!: Signal<boolean>;

  //Puntos

  seccionesKeys = ['total', 'rv', 'a', 'b', 'c', 'pc'];

  sortFns: Record<
    string,
    (a: ConsolidadoMedico, b: ConsolidadoMedico) => number
  > = {};

  // FILTRO REPRESENTANTE
  representantesSeleccionados: string[] = [];

  // FILTRO REGIONES
  regionesSeleccionadas: string[] = [];

  // FILTRO SECCIONES
  seccionesSeleccionadas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private consolidadoService: ConsolidadoVisitasMedicasService,
    private cicloState: CiclotateService,
    private asesoresState: AsesoresStateService,
    private seccionesState: SeccionesStateService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.asesores$ = this.asesoresState.asesores$;
    this.asesoresLoading$ = this.asesoresState.getAsesoresLoading();
    this.asesoresState.fetchAsesores();

    this.secciones$ = this.seccionesState.secciones$;
    this.seccionesLoading$ = this.seccionesState.getSeccionesLoading();
    this.seccionesState.fetchSecciones();

    this.ciclos$ = this.cicloState.ciclos$;
    this.ciclosLoading$ = this.cicloState.getCiclosLoading();
    this.cicloState.fetchCiclos();

    this.ciclosSubscription = this.ciclos$.subscribe((ciclos) => {
      this.allCiclos = ciclos;
    });

    this.cicloOpciones$ = this.ciclos$.pipe(
      map((ciclos) =>
        ciclos.map((c) => ({
          label: c.nombre,
          value: c.id,
        }))
      )
    );

    this.filtrosForm = this.fb.group({
      rangoFechas: [{ value: null, disabled: true }, Validators.required],
      ciclo: [{ value: null, disabled: false }],
    });

    this.toggleModoFechas();

    for (const key of this.seccionesKeys) {
      this.sortFns[`${key}Puntos`] = (a, b) =>
        Number(a[`${key}Puntos`] ?? 0) - Number(b[`${key}Puntos`] ?? 0);
    }

    this.sortFns[`representante`] = (a, b) =>
      String(a[`representante`] ?? '').localeCompare(
        String(b[`representante`] ?? '')
      );

    this.sortFns[`region`] = (a, b) =>
      String(a[`region`] ?? '').localeCompare(String(b[`region`] ?? ''));

    this.sortFns[`seccion`] = (a, b) =>
      String(b[`seccion`] ?? '').localeCompare(String(a[`seccion`] ?? ''));

    this.sortFns['fuerzaVenta'] = (a, b) => {
      const numA = parseInt(a.fuerzaVenta?.replace(/\D/g, '') || '0', 10);
      const numB = parseInt(b.fuerzaVenta?.replace(/\D/g, '') || '0', 10);
      return numA - numB;
    };
  }

  ngOnDestroy(): void {
    if (this.ciclosSubscription) {
      this.ciclosSubscription.unsubscribe();
    }
  }

  toggleModoFechas(): void {
    if (this.modoFiltroFechas === 'rango') {
      this.filtrosForm.get('ciclo')?.disable();
      this.filtrosForm.get('ciclo')?.clearValidators();
      this.filtrosForm.get('ciclo')?.setValue(null);

      this.filtrosForm.get('rangoFechas')?.enable();
      this.filtrosForm.get('rangoFechas')?.setValidators(Validators.required);
    } else {
      this.filtrosForm.get('rangoFechas')?.disable();
      this.filtrosForm.get('rangoFechas')?.clearValidators();
      this.filtrosForm.get('rangoFechas')?.setValue(null);

      this.filtrosForm.get('ciclo')?.enable();
      this.filtrosForm.get('ciclo')?.setValidators(Validators.required);
    }
    this.filtrosForm.get('ciclo')?.updateValueAndValidity();
    this.filtrosForm.get('rangoFechas')?.updateValueAndValidity();
  }

  // DRAWER

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  onRepresentantesSeleccionadosChange(nombres: string[]) {
    this.representantesSeleccionados = nombres;
    this.filtrarData();
  }

  onRegionesSeleccionadasChange(regiones: string[]): void {
    this.regionesSeleccionadas = regiones;
    this.filtrarData();
  }

  onSeccionesSeleccionadasChange(secciones: string[]): void {
    this.seccionesSeleccionadas = secciones;
    this.filtrarData();
  }

  filtrarData(): void {
    this.data = this.dataOriginal.filter(
      (item) =>
        (this.representantesSeleccionados.length === 0 ||
          this.representantesSeleccionados.includes(item.representante)) &&
        (this.regionesSeleccionadas.length === 0 ||
          this.regionesSeleccionadas.includes(item.region)) &&
        (this.seccionesSeleccionadas.length === 0 ||
          this.seccionesSeleccionadas.includes(item.seccion))
    );
  }

  buscar(): void {
    if (this.filtrosForm.invalid) {
      this.message.warning('Por favor, complete todos los campos requeridos.');
      this.filtrosForm.markAllAsTouched();
      return;
    }

    let fechaInicial: Date;
    let fechaFinal: Date;

    if (this.modoFiltroFechas === 'ciclo') {
      const cicloId = this.filtrosForm.value.ciclo;
      const selectedCiclo = this.allCiclos.find((c) => c.id === cicloId);

      if (
        selectedCiclo &&
        selectedCiclo.fechaInicio &&
        selectedCiclo.fechaFin
      ) {
        fechaInicial = new Date(selectedCiclo.fechaInicio);
        fechaFinal = new Date(selectedCiclo.fechaFin);
      } else {
        this.message.error(
          'No se pudieron obtener las fechas para el ciclo seleccionado.'
        );
        return;
      }
    } else {
      // modoFiltroFechas === 'rango'
      const { rangoFechas } = this.filtrosForm.value;
      if (!rangoFechas || rangoFechas.length !== 2) {
        this.message.error('Por favor, seleccione un rango de fechas válido.');
        return;
      }
      fechaInicial = rangoFechas[0];
      fechaFinal = rangoFechas[1];
    }

    this.isLoading = true;

    this.consolidadoService.getConsolidado(fechaInicial, fechaFinal).subscribe({
      next: (result) => {
        this.dataOriginal = result;
        this.filtrarData();
      },
      error: (error) => {
        this.message.error('Error al obtener cobertura médica');
        console.log(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
