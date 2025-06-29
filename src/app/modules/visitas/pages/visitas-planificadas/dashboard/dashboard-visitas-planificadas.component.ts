import { CommonModule } from '@angular/common';
import { Component, Signal, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { CiclotateService } from '../../../../../shared/services/ciclos-service/ciclo-state.service';
import { map, Observable, Subscription } from 'rxjs';
import { CicloSelectDTO } from '../../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { VisitasPlanificadasService } from '../../../services/visitas-planificadas.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  ResumenVisitaPlanificadaAgregado,
  ResumenVisitasPlanificada,
  VisitasPlanificadasFiltros,
} from '../../../interfaces/visitas-planificadas-response';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TablaVisitasPlanificadasComponent } from '../../../components/tabla-visitas-planificadas/tabla-visitas-planificadas.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { FiltrosVisitasPlanificadasComponent } from '../../../components/filtros-visitas-planificadas/filtros-visitas-planificadas.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { TablaVisitasAgregadoComponent } from '../../../components/tabla-visitas-agregado/tabla-visitas-agregado.component';
import { UsuarioAppSelect } from '../../../../../shared/services/asesores-service/Interfaces/asesores-api-response';
import { SeccionesSelect } from '../../../../../shared/services/secciones-service/Interfaces/secciones-api-response';
import { FuerzaSelectDTO } from '../../../../../shared/services/fuerzas-service/Interfaces/FuerzaSelectDTO';
import { AsesoresStateService } from '../../../../../shared/services/asesores-service/asesores-state.service';
import { SeccionesStateService } from '../../../../../shared/services/secciones-service/secciones-state.service';
import { FuerzaStateService } from '../../../../../shared/services/fuerzas-service/fuerza-state.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import saveAs from 'file-saver';

@Component({
  selector: 'app-dashboard-visitas-planificadas',
  standalone: true,
  imports: [
    NzTypographyModule,
    NzDividerModule,
    NzFormModule,
    NzButtonModule,
    NzRadioModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    TablaVisitasPlanificadasComponent,
    NzDrawerModule,
    FiltrosVisitasPlanificadasComponent,
    NzTabsModule,
    TablaVisitasAgregadoComponent,
    NzDropDownModule,
  ],
  templateUrl: './dashboard-visitas-planificadas.component.html',
  styleUrl: './dashboard-visitas-planificadas.component.less',
})
export class DashboardVisitasPlanificadasComponent
  implements OnInit, OnDestroy
{
  modoFiltroFechas: 'ciclo' | 'rango' = 'ciclo';
  filtrosForm!: FormGroup;
  isLoading = false;
  visible = false;
  data: ResumenVisitasPlanificada[] = [];
  dataAgregado: ResumenVisitaPlanificadaAgregado[] = [];
  isLoadingAgregado = false;
  totalItems = 0;
  pageIndex = 1;
  pageSize = 50;

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

  mostrarClienteZ = true;
  mostrarMedico = true;
  mostrarClienteGenerico = true;
  observacion = true;
  acompanado = true;

  filtroClienteZ = true;
  filtroMedico = true;
  filtroClienteGenerico = true;

  // FILTRO REPRESENTANTE
  representantesSeleccionados: string[] = [];

  // FILTRO REGIONES
  seccionesSeleccionadas: string[] = [];

  // FILTRO SECCIONES
  regionesSeleccionadas: string[] = [];

  // FILTRO FUERZAS
  fuerzasSeleccionadas: string[] = [];

  tiposClientesSeleccionados: string | undefined = 'CLI Z, MEDICO, GENERICO';

  // EXPORTAR
  isExporting = false;

  constructor(
    private fb: FormBuilder,
    private cicloState: CiclotateService,
    private consolidadoService: VisitasPlanificadasService,
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
  }

  ngOnDestroy(): void {
    if (this.ciclosSubscription) {
      this.ciclosSubscription.unsubscribe();
    }
  }

  onRepresentantesSeleccionadosChange(nombres: string[]) {
    this.representantesSeleccionados = nombres;
  }

  onRegionesSeleccionadasChange(regiones: string[]): void {
    this.regionesSeleccionadas = regiones;
  }

  onSeccionesSeleccionadasChange(secciones: string[]): void {
    this.seccionesSeleccionadas = secciones;
  }

  onFuerzasSeleccionadasChange(fuerzas: string[]): void {
    this.fuerzasSeleccionadas = fuerzas;
  }

  onAplicarFiltros(f: VisitasPlanificadasFiltros): void {
    // Visibilidad de columnas, como antes
    this.tiposClientesSeleccionados = f.tipos.join(', ');
    this.mostrarClienteZ = f.tipos.includes('CLI Z');
    this.mostrarMedico = f.tipos.includes('MEDICO');
    this.mostrarClienteGenerico = f.tipos.includes('GENERICO');

    // Guardar filtros auxiliares (si luego los usas)
    this.representantesSeleccionados = f.representantes
      ? f.representantes.split(',')
      : [];
    this.seccionesSeleccionadas = f.secciones ? f.secciones.split(',') : [];
    this.regionesSeleccionadas = f.regiones ? f.regiones.split(',') : [];
    this.fuerzasSeleccionadas = f.fuerzas ? f.fuerzas.split(',') : [];

    this.observacion = f.observacion;
    this.acompanado = f.acompanado;

    // Si estos filtros no afectan la consulta, omite this.buscar();
    this.buscar(1);
  }

  // DRAWER
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

  buscar(page = 1): void {
    this.pageIndex = page;

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

    const representantesStr = this.representantesSeleccionados.join(',');
    const seccionesStr = this.seccionesSeleccionadas.join(',');
    const regionesStr = this.regionesSeleccionadas.join(',');
    const fuerzasStr = this.fuerzasSeleccionadas.join(',');

    this.isLoading = true;

    this.consolidadoService
      .getResumen(
        fechaInicial,
        fechaFinal,
        /* codigoCliente */ undefined,
        /* nombreCliente */ undefined,
        representantesStr,
        seccionesStr,
        regionesStr,
        fuerzasStr,
        this.tiposClientesSeleccionados,
        this.pageIndex,
        this.pageSize
      )
      .subscribe({
        next: (result) => {
          this.data = result.items;
          this.totalItems = result.totalItems;
          this.isLoading = false;
        },
        error: (error) => {
          this.message.error('Sin registros');
          this.data = [];
          console.error(error);
          this.isLoading = false;
        },
      });

    this.isLoadingAgregado = true;

    this.consolidadoService
      .getResumenAgregado(
        fechaInicial,
        fechaFinal,
        undefined,
        undefined,
        representantesStr,
        seccionesStr,
        regionesStr,
        fuerzasStr,
        this.tiposClientesSeleccionados
      )
      .subscribe({
        next: (result) => {
          this.dataAgregado = result;
          this.isLoadingAgregado = false;
          console.log(this.dataAgregado);
        },
        error: (error) => {
          this.message.error('Error al obtener cobertura de clientes');
          console.error(error);
          this.isLoadingAgregado = false;
        },
      });
  }
  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.buscar(this.pageIndex);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.buscar(1);
  }

  descargarExcel(): void {
    if (this.isExporting) return;
    this.isExporting = true;

    // 1) Calcula rango de fechas igual que en buscar()
    let fechaInicial: Date;
    let fechaFinal: Date;

    if (this.modoFiltroFechas === 'ciclo') {
      const selected = this.allCiclos.find(
        (c) => c.id === this.filtrosForm.value.ciclo
      );
      if (selected?.fechaInicio && selected?.fechaFin) {
        fechaInicial = new Date(selected.fechaInicio);
        fechaFinal = new Date(selected.fechaFin);
      } else {
        this.message.error('No se pudieron obtener las fechas del ciclo.');
        this.isExporting = false;
        return;
      }
    } else {
      const rango = this.filtrosForm.value.rangoFechas;
      if (!rango || rango.length !== 2) {
        this.message.error('Seleccione un rango de fechas válido.');
        this.isExporting = false;
        return;
      }
      fechaInicial = rango[0];
      fechaFinal = rango[1];
    }

    // 2) Ensambla los strings de filtros
    const representantes = this.representantesSeleccionados.join(',');
    const secciones = this.seccionesSeleccionadas.join(',');
    const regiones = this.regionesSeleccionadas.join(',');
    const fuerzas = this.fuerzasSeleccionadas.join(',');
    const tipos = this.tiposClientesSeleccionados;

    // 3) Llama al servicio que devuelve un Blob
    this.consolidadoService
      .exportarResumenExcel(
        fechaInicial,
        fechaFinal,
        /* codigoCliente */ undefined,
        /* nombreCliente */ undefined,
        representantes,
        secciones,
        regiones,
        fuerzas,
        tipos
      )
      .subscribe({
        next: (blob) => {
          const ahora = new Date();
          const nombre = `ResumenVisitas_${ahora.getFullYear()}${String(
            ahora.getMonth() + 1
          ).padStart(2, '0')}${String(ahora.getDate()).padStart(2, '0')}.xlsx`;
          saveAs(blob, nombre);
          this.message.success(`Descarga iniciada: ${nombre}`);
        },
        error: (err) => {
          console.error(err);
          this.message.error('Error al descargar el Excel.');
        },
        complete: () => {
          this.isExporting = false;
        },
      });
  }

  exportarResumenExcel(): void {
    if (this.isExporting) return;
    if (!this.dataAgregado || this.dataAgregado.length === 0) {
      this.message.warning('No hay datos para exportar.');
      return;
    }
    this.isExporting = true;

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Resumen Visitas');

    // 1) Columnas fijas
    const fixedHeaders = ['Sección', 'Representante', 'Región', 'Fuerza'];
    fixedHeaders.forEach((h, i) => {
      const col = i + 1;
      ws.mergeCells(1, col, 3, col);
      ws.getCell(1, col).value = h;
      ws.getCell(1, col).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      ws.getColumn(col).width = 20;
    });

    // 2) Definición de grupos dinámicos
    interface Grupo {
      title: string;
      fields: string[]; // sufijos de propiedad (sin _Planificado/_Ejecutado)
    }
    const grupos: Grupo[] = [];
    if (this.mostrarClienteZ) {
      grupos.push({
        title: 'Clientes Z',
        fields: [
          'clienteZ_CajasVacias',
          'clienteZ_VisitaPromocional',
          'clienteZ_PuntoContacto',
          'clienteZ_EntregaPremios',
        ],
      });
    }
    if (this.mostrarMedico) {
      grupos.push({
        title: 'Médicos',
        fields: ['medico_VisitaPromocional', 'medico_PuntoContacto'],
      });
    }
    if (this.mostrarClienteGenerico) {
      grupos.push({
        title: 'Clientes',
        fields: [
          'cliente_CajasVacias',
          'cliente_SiembraProductos',
          'cliente_VisitaPromocional',
          'cliente_PuntoContacto',
          'cliente_EntregaPremios',
          'cliente_Devolucion',
          'cliente_Pedido',
          'cliente_Cobro',
        ],
      });
    }

    // 3) Cabeceras dinámicas en filas 1–3
    let colIndex = fixedHeaders.length + 1;
    grupos.forEach((grupo) => {
      const totalCols = grupo.fields.length * 2;
      // fila 1: título del grupo
      ws.mergeCells(1, colIndex, 1, colIndex + totalCols - 1);
      ws.getCell(1, colIndex).value = grupo.title;
      ws.getCell(1, colIndex).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      // fila 2: cada subgrupo
      grupo.fields.forEach((field) => {
        ws.mergeCells(2, colIndex, 2, colIndex + 1);
        ws.getCell(2, colIndex).value = field
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
        ws.getCell(2, colIndex).alignment = { horizontal: 'center' };
        // fila 3: Planificado / Ejecutado
        ws.getCell(3, colIndex).value = 'Planificado';
        ws.getCell(3, colIndex + 1).value = 'Ejecutado';
        ws.getCell(3, colIndex).alignment = { horizontal: 'center' };
        ws.getCell(3, colIndex + 1).alignment = { horizontal: 'center' };
        // anchura de cada columna de datos
        ws.getColumn(colIndex).width = 12;
        ws.getColumn(colIndex + 1).width = 12;
        colIndex += 2;
      });
    });

    // 4) Rellenar datos a partir de la fila 4
    this.dataAgregado.forEach((item) => {
      const row: any[] = [
        item.seccion,
        item.representante,
        item.region,
        item.fuerza,
      ];
      grupos.forEach((grupo) => {
        grupo.fields.forEach((f) => {
          row.push(item[`${f}_Planificado`] ?? 0);
          row.push(item[`${f}_Ejecutado`] ?? 0);
        });
      });
      ws.addRow(row);
    });

    // 5) Generar el archivo con fecha en el nombre
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, '0');
    const dd = String(ahora.getDate()).padStart(2, '0');
    const nombre = `ResumenVisitas_${yyyy}${mm}${dd}.xlsx`;

    workbook.xlsx
      .writeBuffer()
      .then((buf) => {
        FileSaver.saveAs(new Blob([buf]), nombre);
        this.message.success(`Archivo generado: ${nombre}`);
      })
      .catch((err) => {
        console.error(err);
        this.message.error('Error al exportar.');
      })
      .finally(() => {
        this.isExporting = false;
      });
  }
}
