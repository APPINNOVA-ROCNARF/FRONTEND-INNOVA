import { Component, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ConsolidadoCoberturaClientesService } from '../../../services/consolidado-clientes.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ResumenCoberturaClientes } from '../../../interfaces/consolidado-clientes-api-response';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Observable } from 'rxjs';
import { CicloSelectDTO } from '../../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CiclotateService } from '../../../../../shared/services/ciclos-service/ciclo-state.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard-cobertura-clientes',
  standalone: true,
  imports: [
    DragDropModule,
    NzSelectModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzDropDownModule,
    NzMenuModule,
    NzInputModule,
    NzSpaceModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzTypographyModule,
    NzDividerModule,
    NzDatePickerModule,
    NzFormModule,
    ReactiveFormsModule,
    NzTableModule,
    CommonModule,
    NzButtonModule,
    FormsModule,
  ],
  templateUrl: './dashboard-cobertura-clientes.component.html',
  styleUrl: './dashboard-cobertura-clientes.component.less',
})
export class DashboardCoberturaClientesComponent implements OnInit {
  dataOriginal: ResumenCoberturaClientes[] = [];
  data: ResumenCoberturaClientes[] = [];
  filtrosForm!: FormGroup;
  isLoading = false;
  usarRangoFechas = false;

  // CICLOS

  cicloSeleccionado: number | null = null;

  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Signal<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;

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
    total: true,
  };

  sortFns: Record<
    string,
    (a: ResumenCoberturaClientes, b: ResumenCoberturaClientes) => number
  > = {};

  // FILTRO REPRESENTANTE
  filtroRepresentante = '';
  filtroRegion = '';
  filtroSeccion = '';

  constructor(
    private fb: FormBuilder,
    private consolidadoService: ConsolidadoCoberturaClientesService,
    private cicloState: CiclotateService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.filtrosForm = this.fb.group({
      rangoFechas: [null, Validators.required],
    });

    for (const key of this.seccionesKeys) {
      this.sortFns[`porcentaje_Venta_${key}`] = (a, b) =>
        Number(a[`porcentaje_Venta_${key}`] ?? 0) -
        Number(b[`porcentaje_Venta_${key}`] ?? 0);

      this.sortFns[`porcentaje_Visita_${key}`] = (a, b) =>
        Number(a[`porcentaje_Visita_${key}`] ?? 0) -
        Number(b[`porcentaje_Visita_${key}`] ?? 0);
    }
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

  toggleModoFechas(): void {
    if (this.usarRangoFechas) {
      this.filtrosForm.get('ciclo')?.disable();
      this.filtrosForm.get('rangoFechas')?.enable();
    } else {
      this.filtrosForm.get('rangoFechas')?.disable();
      this.filtrosForm.get('ciclo')?.enable();
    }
  }
  getColspan(): number {
    let span = 0;
    if (this.columnasVisibles.visita) span += 2;
    if (this.columnasVisibles.venta) span += 2;
    span += 1;
    return span;
  }

  validarVisibilidad(campo: 'visita' | 'venta'): void {
    if (!this.columnasVisibles.visita && !this.columnasVisibles.venta) {
      this.columnasVisibles[campo] = true;
    }
  }

  get filtrosActivos(): string[] {
    const filtros: string[] = [];

    // Columnas
    const columnas = [];
    if (this.columnasVisibles.visita) columnas.push('Visita');
    if (this.columnasVisibles.venta) columnas.push('Venta');
    if (columnas.length) filtros.push(`Columnas: ${columnas.join(', ')}`);

    // Secciones visibles
    const seccionesActivas = this.seccionesKeys.filter(
      (k) => this.seccionesVisibles[k]
    );
    if (seccionesActivas.length) {
      const etiquetas = seccionesActivas.map((k) => this.seccionesLabels[k]);
      filtros.push(`Secciones: ${etiquetas.join(', ')}`);
    }

    return filtros;
  }

  buscar(): void {
    if (this.filtrosForm.invalid) return;

    const { rangoFechas } = this.filtrosForm.value;
    const fechaInicial: Date = rangoFechas[0];
    const fechaFinal: Date = rangoFechas[1];

    this.isLoading = true;

    this.consolidadoService.getConsolidado(fechaInicial, fechaFinal).subscribe({
      next: (result) => {
        this.dataOriginal = result;
        this.filtrarData(); // Aplica el filtro si hay uno
      },
      error: (error) => {
        this.message.error('Error al obtener cobertura de clientes');
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  filtrarData(): void {
    const rep = this.filtroRepresentante.trim().toLowerCase();
    const reg = this.filtroRegion.trim().toLowerCase();
    const sec = this.filtroSeccion.trim().toLowerCase();

    this.data = this.dataOriginal.filter(
      (item) =>
        (!rep || item.representante.toLowerCase().includes(rep)) &&
        (!reg || item.region.toLowerCase().includes(reg)) &&
        (!sec || item.seccion.toLowerCase().includes(sec))
    );
  }
}
