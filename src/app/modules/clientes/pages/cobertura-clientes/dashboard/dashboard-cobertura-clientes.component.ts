import { Component, OnInit, Signal, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ConsolidadoCoberturaClientesService } from '../../../services/consolidado-clientes.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ResumenCoberturaClientes } from '../../../interfaces/consolidado-clientes-api-response';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { map, Observable, Subscription } from 'rxjs';
import { CicloSelectDTO } from '../../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { CiclotateService } from '../../../../../shared/services/ciclos-service/ciclo-state.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { TablaCoberturaClientesComponent } from '../../../components/tabla-cobertura-clientes/tabla-cobertura-clientes.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FiltrosCoberturaClientesComponent } from '../../../components/filtros-cobertura-clientes/filtros-cobertura-clientes.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AsesoresStateService } from '../../../../../shared/services/asesores-service/asesores-state.service';
import { UsuarioAppSelect } from '../../../../../shared/services/asesores-service/Interfaces/asesores-api-response';
import { SeccionesSelect } from '../../../../../shared/services/secciones-service/Interfaces/secciones-api-response';
import { SeccionesStateService } from '../../../../../shared/services/secciones-service/secciones-state.service';
import FileSaver from 'file-saver';
import ExcelJS from 'exceljs';
import { FuerzaStateService } from '../../../../../shared/services/fuerzas-service/fuerza-state.service';
import { FuerzaSelectDTO } from '../../../../../shared/services/fuerzas-service/Interfaces/FuerzaSelectDTO';

@Component({
  selector: 'app-dashboard-cobertura-clientes',
  standalone: true,
  imports: [
    DragDropModule,
    NzIconModule,
    NzTagModule,
    NzSpaceModule,
    NzTypographyModule,
    NzDividerModule,
    NzFormModule,
    ReactiveFormsModule,
    CommonModule,
    NzButtonModule,
    FormsModule,
    NzDrawerModule,
    NzRadioModule,
    NzDatePickerModule,
    NzSelectModule,
    TablaCoberturaClientesComponent,
    FiltrosCoberturaClientesComponent,
  ],
  templateUrl: './dashboard-cobertura-clientes.component.html',
  styleUrl: './dashboard-cobertura-clientes.component.less',
})
export class DashboardCoberturaClientesComponent implements OnInit, OnDestroy {
  dataOriginal: ResumenCoberturaClientes[] = [];
  data: ResumenCoberturaClientes[] = [];
  filtrosForm!: FormGroup;
  isLoading = false;
  visible = false;
  modoFiltroFechas: 'ciclo' | 'rango' = 'ciclo';

  // CICLOS

  cicloSeleccionado: number | null = null;

  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Signal<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;
  allCiclos: CicloSelectDTO[] = [];

  // ASESORES

  asesores$!: Observable<UsuarioAppSelect[]>;
  asesoresLoading$!: Signal<boolean>;

  // SECCIONES

  secciones$!: Observable<SeccionesSelect[]>;
  seccionesLoading$!: Signal<boolean>;

  // FUERZAS
  fuerzas$!: Observable<FuerzaSelectDTO[]>;
  fuerzasLoading$!: Signal<boolean>;

  seccionesKeys = ['CLACT', 'CLINC', 'CONTA', 'CLIZ'];

  seccionesLabels: Record<string, string> = {
    CLACT: 'Clientes Activos',
    CLINC: 'Clientes Inactivos',
    CONTA: 'Clientes Contado',
    CLIZ: 'Clientes Z',
  };

  columnasVisibles = {
    visita: true,
    venta: true,
    cobranza: true,
    total: true,
  };

  sortFns: Record<
    string,
    (a: ResumenCoberturaClientes, b: ResumenCoberturaClientes) => number
  > = {};

  // FILTRO REPRESENTANTE
  representantesSeleccionados: string[] = [];

  // FILTRO REGIONES
  regionesSeleccionadas: string[] = [];

  // FILTRO SECCIONES
  seccionesSeleccionadas: string[] = [];

  // FILTRO FUERZAS
  fuerzasSeleccionadas: string[] = [];

  private ciclosSubscription: Subscription | undefined;

  // EXPORTAR
  isExporting = false;

  constructor(
    private fb: FormBuilder,
    private consolidadoService: ConsolidadoCoberturaClientesService,
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
      this.sortFns[`porcentaje_Venta_${key}`] = (a, b) =>
        Number(a[`porcentaje_Venta_${key}`] ?? 0) -
        Number(b[`porcentaje_Venta_${key}`] ?? 0);

      this.sortFns[`porcentaje_Visita_${key}`] = (a, b) =>
        Number(a[`porcentaje_Visita_${key}`] ?? 0) -
        Number(b[`porcentaje_Visita_${key}`] ?? 0);

      this.sortFns[`porcentaje_Cobro_${key}`] = (a, b) =>
        Number(a[`porcentaje_Cobro_${key}`] ?? 0) -
        Number(b[`porcentaje_Cobro_${key}`] ?? 0);
    }

    this.sortFns[`representante`] = (a, b) =>
      String(a[`representante`] ?? '').localeCompare(
        String(b[`representante`] ?? '')
      );

    this.sortFns[`region`] = (a, b) =>
      String(a[`region`] ?? '').localeCompare(String(b[`region`] ?? ''));

    this.sortFns[`seccion`] = (a, b) =>
      String(b[`seccion`] ?? '').localeCompare(String(a[`seccion`] ?? ''));

    this.sortFns['fuerza'] = (a, b) => {
      const numA = parseInt(a.fuerza?.replace(/\D/g, '') || '0', 10);
      const numB = parseInt(b.fuerza?.replace(/\D/g, '') || '0', 10);
      return numA - numB;
    };
  }

  ngOnDestroy(): void {
    if (this.ciclosSubscription) {
      this.ciclosSubscription.unsubscribe();
    }
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

  seccionesVisibles: Record<string, boolean> = {
    CLACT: true,
    CLINC: true,
    CONTA: true,
    CLIZ: true,
  };

  dropSeccion(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.seccionesKeys,
      event.previousIndex,
      event.currentIndex
    );
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
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

  get filtrosColumnas(): string[] {
    const columnas: string[] = [];
    if (this.columnasVisibles.visita) columnas.push('Visita');
    if (this.columnasVisibles.venta) columnas.push('Venta');
    if (this.columnasVisibles.cobranza) columnas.push('Cobranza');
    return columnas;
  }

  get filtrosSecciones(): string[] {
    return this.seccionesKeys
      .filter((k) => this.seccionesVisibles[k])
      .map((k) => this.seccionesLabels[k]);
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
        this.message.error('Error al obtener cobertura de clientes');
        console.error('Error al obtener cobertura de clientes:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
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
          this.fuerzasSeleccionadas.includes(item.fuerza))
    );
  }

  exportarExcel(): void {
    if (this.isExporting) return;

    if (this.data.length === 0) {
      this.message.warning('No hay datos para exportar.');
      return;
    }

    this.isExporting = true;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cobertura Clientes');

    const secciones = this.seccionesKeys;
    const columnasVisibles = this.columnasVisibles;

    const headersNivel1 = ['Sección', 'Representante', 'Región', 'Fuerza'];
    const headersNivel2 = ['', '', '', ''];
    const headersNivel3 = ['', '', '', ''];

    for (const key of secciones) {
      if (!this.seccionesVisibles[key]) continue;

      const label = this.seccionesLabels[key];

      if (columnasVisibles.visita) {
        headersNivel1.push(label, '');
        headersNivel2.push('Visita', '');
        headersNivel3.push('Cantidad', '%');
      }
      if (columnasVisibles.venta) {
        headersNivel1.push(label, '');
        headersNivel2.push('Venta', '');
        headersNivel3.push('Cantidad', '%');
      }
      if (columnasVisibles.cobranza) {
        headersNivel1.push(label, '');
        headersNivel2.push('Cobro', '');
        headersNivel3.push('Cantidad', '%');
      }
      if (columnasVisibles.total) {
        headersNivel1.push(label);
        headersNivel2.push('Total');
        headersNivel3.push('Total');
      }
    }

    worksheet.addRow(headersNivel1);
    worksheet.addRow(headersNivel2);
    worksheet.addRow(headersNivel3);

    // Combinar celdas para cabeceras multinivel
    let col = 5;
    for (const key of secciones) {
      if (!this.seccionesVisibles[key]) continue;

      const colspan =
        (columnasVisibles.visita ? 2 : 0) +
        (columnasVisibles.venta ? 2 : 0) +
        (columnasVisibles.cobranza ? 2 : 0) +
        (columnasVisibles.total ? 1 : 0);

      worksheet.mergeCells(1, col, 1, col + colspan - 1);

      if (columnasVisibles.visita) {
        worksheet.mergeCells(2, col, 2, col + 1);
        col += 2;
      }
      if (columnasVisibles.venta) {
        worksheet.mergeCells(2, col, 2, col + 1);
        col += 2;
      }
      if (columnasVisibles.cobranza) {
        worksheet.mergeCells(2, col, 2, col + 1);
        col += 2;
      }
      if (columnasVisibles.total) {
        worksheet.mergeCells(2, col, 3, col);
        col += 1;
      }
    }

    // Datos
    for (const row of this.data) {
      const fila = [row.seccion, row.representante, row.region, row.fuerza];

      for (const key of secciones) {
        if (!this.seccionesVisibles[key]) continue;

        const k = String(key); // aseguramos tipo string explícito

        if (columnasVisibles.visita) {
          fila.push(
            row[`visita_${k}` as keyof ResumenCoberturaClientes] ?? '',
            (row[`porcentaje_Visita_${k}` as keyof ResumenCoberturaClientes] ??
              '') + '%'
          );
        }

        if (columnasVisibles.venta) {
          fila.push(
            row[`venta_${k}` as keyof ResumenCoberturaClientes] ?? '',
            (row[`porcentaje_Venta_${k}` as keyof ResumenCoberturaClientes] ??
              '') + '%'
          );
        }

        if (columnasVisibles.cobranza) {
          fila.push(
            row[`cobro_${k}` as keyof ResumenCoberturaClientes] ?? '',
            (row[`porcentaje_Cobro_${k}` as keyof ResumenCoberturaClientes] ??
              '') + '%'
          );
        }

        if (columnasVisibles.total) {
          fila.push(row[`total_${k}` as keyof ResumenCoberturaClientes] ?? '');
        }
      }

      worksheet.addRow(fila);
    }

    worksheet.columns.forEach((column) => {
      column.width = 14;
    });

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

    const nombreArchivo = `CoberturaClientes_${formatDate(
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
