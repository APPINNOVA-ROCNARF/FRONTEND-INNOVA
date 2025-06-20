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
import ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { FuerzaSelectDTO } from '../../../../../shared/services/fuerzas-service/Interfaces/FuerzaSelectDTO';
import { FuerzaStateService } from '../../../../../shared/services/fuerzas-service/fuerza-state.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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

  // FUERZAS
  fuerzas$!: Observable<FuerzaSelectDTO[]>;
  fuerzasLoading$!: Signal<boolean>;

  //Puntos

  seccionesKeys = ['total', 'rv', 'a', 'b', 'c', 'pc'];

  seccionesLabels: Record<string, string> = {
    total: 'Total',
    rv: 'Revisitas',
    a: 'Clase A',
    b: 'Clase B',
    c: 'Clase C',
    pc: 'Por Categorizar',
  };

  seccionesVisibles: Record<string, boolean> = {
    total: true,
    rv: true,
    a: true,
    b: true,
    c: true,
    pc: true,
  };

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

  // FILTRO FUERZAS
  fuerzasSeleccionadas: string[] = [];

  // EXPORTAR
  isExporting = false;

  constructor(
    private fb: FormBuilder,
    private consolidadoService: ConsolidadoVisitasMedicasService,
    private cicloState: CiclotateService,
    private asesoresState: AsesoresStateService,
    private seccionesState: SeccionesStateService,
    private fuerzaState: FuerzaStateService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.asesores$ = this.asesoresState.asesores$;
    this.asesoresLoading$ = this.asesoresState.getAsesoresLoading();
    this.asesoresState.fetchAsesores();

    this.secciones$ = this.seccionesState.secciones$;
    this.seccionesLoading$ = this.seccionesState.getSeccionesLoading();
    this.seccionesState.fetchSecciones();

    this.fuerzas$ = this.fuerzaState.fuerzas$;
    this.fuerzasLoading$ = this.fuerzaState.getFuerzasLoading();
    this.fuerzaState.fetchFuerzas();

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

  // Drag
  dropSeccion(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.seccionesKeys,
      event.previousIndex,
      event.currentIndex
    );
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

  onFuerzasSeleccionadasChange(fuerzas: string[]): void {
    this.fuerzasSeleccionadas = fuerzas;
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
          this.seccionesSeleccionadas.includes(item.seccion)) &&
        (this.fuerzasSeleccionadas.length === 0 ||
          this.fuerzasSeleccionadas.includes(item.fuerzaVenta))
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

  exportarExcel(): void {
    if (this.isExporting) return;

    if (this.data.length === 0) {
      this.message.warning('No hay datos para exportar.');
      return;
    }

    this.isExporting = true;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cobertura Médica');

    // Encabezados agrupados
    worksheet.mergeCells('A1:A2');
    worksheet.getCell('A1').value = 'Sección';
    worksheet.mergeCells('B1:B2');
    worksheet.getCell('B1').value = 'Representante';
    worksheet.mergeCells('C1:C2');
    worksheet.getCell('C1').value = 'Región';
    worksheet.mergeCells('D1:D2');
    worksheet.getCell('D1').value = 'Fuerza';

    const grupos = [
      'Total',
      'Revisitas',
      'Clase A',
      'Clase B',
      'Clase C',
      'Por Categorizar',
    ];
    let col = 5;

    for (const grupo of grupos) {
      worksheet.mergeCells(1, col, 1, col + 3);
      worksheet.getCell(1, col).value = grupo;
      worksheet.getCell(2, col).value = 'Med';
      worksheet.getCell(2, col + 1).value = 'Efect';
      worksheet.getCell(2, col + 2).value = 'Pot';
      worksheet.getCell(2, col + 3).value = 'Pts';
      col += 4;
    }

    // Datos
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.data.length; i++) {
      const d = this.data[i];
      worksheet.addRow([
        d.seccion,
        d.representante,
        d.region,
        d.fuerzaVenta,
        d.totalMed,
        d.totalEfect,
        d.potencial,
        d.totalPuntos,
        d.rvMed,
        d.rvEfect,
        d.rvPot,
        d.rvPuntos,
        d.aMed,
        d.aEfect,
        d.aPot,
        d.aPuntos,
        d.bMed,
        d.bEfect,
        d.bPot,
        d.bPuntos,
        d.cMed,
        d.cEfect,
        d.cPot,
        d.cPuntos,
        d.pcMed,
        d.pcEfect,
        d.pcPot,
        d.pcPuntos,
      ]);
    }

    // Estilo básico
    worksheet.columns.forEach((column) => {
      column.width = 12;
    });
    ['A1', 'B1', 'C1', 'D1'].forEach(
      (cell) =>
        (worksheet.getCell(cell).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        })
    );

    // Obtener fechas para el nombre del archivo
    let fechaInicial: Date;
    let fechaFinal: Date;

    if (this.modoFiltroFechas === 'ciclo') {
      const cicloId = this.filtrosForm.value.ciclo;
      const ciclo = this.allCiclos.find((c) => c.id === cicloId);
      fechaInicial = new Date(ciclo?.fechaInicio ?? new Date());
      fechaFinal = new Date(ciclo?.fechaFin ?? new Date());
    } else {
      const rango = this.filtrosForm.value.rangoFechas;
      fechaInicial = new Date(rango?.[0] ?? new Date());
      fechaFinal = new Date(rango?.[1] ?? new Date());
    }

    const formatDate = (d: Date): string =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
        .getDate()
        .toString()
        .padStart(2, '0')}`;

    const nombreArchivo = `CoberturaMedicos_${formatDate(
      fechaInicial
    )}_a_${formatDate(fechaFinal)}.xlsx`;

    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        FileSaver.saveAs(new Blob([buffer]), nombreArchivo);
        this.message.success(`Archivo generado con éxito: ${nombreArchivo}`);
      })
      .catch((err) => {
        console.error('Error al exportar:', err);
        this.message.error('Error al exportar el archivo.');
      })
      .finally(() => {
        this.isExporting = false;
      });
  }
}
