import { Component, OnInit, signal, Signal } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { map, Observable } from 'rxjs';
import { CicloSelectDTO } from '../../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { CiclotateService } from '../../../../../shared/services/ciclos-service/ciclo-state.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { TablaReportesComponent } from '../../../components/dashboard-reportes/tabla-reportes/tabla-reportes.component';
import { ViaticoStateService } from '../../../services/viatico/viatico-state.service';
import { ViaticoReporte } from '../../../interfaces/viatico-api-response';
import { toObservable } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import { ViaticoService } from '../../../services/viatico/viatico.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dashboard-reportes',
  standalone: true,
  imports: [
    NzCheckboxModule,
    NzTypographyModule,
    NzDividerModule,
    NzSelectModule,
    CommonModule,
    FormsModule,
    NzFormModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzGridModule,
    TablaReportesComponent,
    NzIconModule,
  ],
  templateUrl: './dashboard-reportes.component.html',
  styleUrl: './dashboard-reportes.component.less',
})
export class DashboardReportesComponent implements OnInit {
  filtroForm!: FormGroup;

  cicloSeleccionado: number | null = null;

  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Signal<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;

  reporte!: Observable<ViaticoReporte[]>;
  reporteLoading$!: Signal<boolean>;

  exportarHabilitado$!: Observable<boolean>;
  formularioValido$!: Observable<boolean>;

  exportandoExcel = signal(false);

  constructor(
    private cicloState: CiclotateService,
    private stateViatico: ViaticoStateService,
    private viatico: ViaticoService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.reporte = toObservable(this.stateViatico.reporte).pipe(
      map((data) => data ?? [])
    );

    this.exportarHabilitado$ = toObservable(this.stateViatico.reporte).pipe(
      map((reporte) => !!reporte && reporte.length > 0)
    );
  }

  ngOnInit(): void {
    this.ciclos$ = this.cicloState.ciclos$;
    this.ciclosLoading$ = this.cicloState.getCiclosLoading();
    this.cicloState.fetchCiclos();

    this.ciclos$.subscribe((ciclos) => {
      const cicloActivo = ciclos.find((c) => c.estado);
      if (cicloActivo) {
        this.cicloSeleccionado = cicloActivo.id;
        this.filtroForm.get('ciclo')?.setValue(cicloActivo.id);
        this.fetchReporte();
      }
    });

    this.cicloOpciones$ = this.ciclos$.pipe(
      map((ciclos) =>
        ciclos.map((c) => ({
          label: c.nombre,
          value: c.id,
        }))
      )
    );

    this.filtroForm = this.fb.group({
      usarRangoFechas: [false],
      ciclo: [null],
      rangoFechas: [null],
    });

    this.formularioValido$ = this.filtroForm.valueChanges.pipe(
      map((val) => {
        if (val.usarRangoFechas) {
          return !!val.rangoFechas && val.rangoFechas.length === 2;
        } else {
          return val.ciclo !== null && val.ciclo !== undefined;
        }
      })
    );

    this.reporteLoading$ = this.stateViatico.reporteLoading;
  }

  fetchReporte() {
    const usarRango = this.filtroForm.value.usarRangoFechas;
    const filtros: {
      cicloId?: number;
      fechaInicio?: string;
      fechaFin?: string;
    } = {};

    if (usarRango) {
      const rango = this.filtroForm.value.rangoFechas;

      if (!rango || rango.length !== 2) return;

      const [inicio, fin] = rango;
      filtros.fechaInicio = dayjs(inicio).format('YYYY-MM-DD');
      filtros.fechaFin = dayjs(fin).format('YYYY-MM-DD');
    } else {
      const cicloId = this.filtroForm.value.ciclo;
      if (!cicloId) return;
      filtros.cicloId = cicloId;
    }
    this.stateViatico.fetchReporteViaticos(filtros, true);
  }

  exportarExcel(): void {
    const usarRango = this.filtroForm.value.usarRangoFechas;
    const filtros: {
      cicloId?: number;
      fechaInicio?: string;
      fechaFin?: string;
    } = {};

    if (usarRango) {
      const rango = this.filtroForm.value.rangoFechas;
      if (!rango || rango.length !== 2) return;

      const [inicio, fin] = rango;
      filtros.fechaInicio = dayjs(inicio).format('YYYY-MM-DD');
      filtros.fechaFin = dayjs(fin).format('YYYY-MM-DD');
    } else {
      const cicloId = this.filtroForm.value.ciclo;
      if (!cicloId) return;

      filtros.cicloId = cicloId;
    }

    this.exportandoExcel.set(true);

    this.viatico.exportarExcel(filtros).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resumen_viaticos.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.message.success('Archivo descargado correctamente');
      },
      error: () => {
        this.message.error('Error al generar el archivo');
      },
      complete: () => {
        this.exportandoExcel.set(false); 
      },
    });
  }
}
