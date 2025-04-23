import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { SolicitudViaticoStateService } from '../../services/solicitudViatico/solicitudViatico-state.service';
import { EstadisticaSolicitudViatico } from '../../interfaces/viatico-api-response';
import { TotalViaticosComponent } from '../total-viaticos/total-viaticos.component';
import { EstadoViaticosComponent } from '../estado-viaticos/estado-viaticos.component';
import { EstadoCicloComponent } from '../estado-ciclo/estado-ciclo.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-estadistica-solicitud-viatico',
  standalone: true,
  imports: [
    CommonModule,
    TotalViaticosComponent,
    EstadoViaticosComponent,
    EstadoCicloComponent,
    NzGridModule,
    NzSpinModule
  ],
  templateUrl: './estadistica-solicitud-viatico.component.html',
  styleUrl: './estadistica-solicitud-viatico.component.less',
})
export class EstadisticaSolicitudViaticoComponent implements OnChanges {
  @Input() cicloId: number | null = null;

  estadistica$!: Observable<EstadisticaSolicitudViatico | null>;
  totalViaticos$!: Observable<number>;
  totalRegistros$!: Observable<number>;
  distribucionEstado$!: Observable<any[]>;
  distribucionCategoria$!: Observable<any[]>;
  porcentajeCiclo$!: Observable<number>;
  tooltipCiclo$!: Observable<string>;
  estadoTextoCiclo$!: Observable<string>;

  estadisticaLoading$!: Observable<boolean>;

  constructor(private state: SolicitudViaticoStateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cicloId'] && this.cicloId != null) {
      this.state.fetchEstadisticaSolicitudViatico(this.cicloId, );
      this.estadistica$ = this.state.estadisticaSolicitudViatico$(this.cicloId);

      this.totalViaticos$ = this.estadistica$.pipe(
        map((e) => e?.total_monto ?? 0)
      );
      this.totalRegistros$ = this.estadistica$.pipe(
        map((e) => e?.total_solicitudes ?? 0)
      );

      this.distribucionEstado$ = this.estadistica$.pipe(
        map((e) => [
          {
            nombre: 'En revisión',
            monto: e?.total_en_revision ?? 0,
            color: '#8ecaff',
          },
          {
            nombre: 'Aprobado',
            monto: e?.total_aprobado ?? 0,
            color: '#b2f2bb',
          },
          {
            nombre: 'Rechazado',
            monto: e?.total_rechazado ?? 0,
            color: '#e0e0e0',
          },
        ])
      );

      this.distribucionCategoria$ = this.estadistica$.pipe(
        map((e) => [
          {
            nombre: 'Movilización',
            monto: e?.monto_movilizacion ?? 0,
            color: '#ef8b83',
          },
          {
            nombre: 'Hospedaje',
            monto: e?.monto_hospedaje ?? 0,
            color: '#82edcd',
          },
          {
            nombre: 'Alimentación',
            monto: e?.monto_alimentacion ?? 0,
            color: '#c082ed',
          },
        ])
      );
    }

    if (this.cicloId != null) {
      this.estadisticaLoading$ =
        this.state.getEstadisticaSolicitudViaticoLoading(this.cicloId);
    }
  }
}
