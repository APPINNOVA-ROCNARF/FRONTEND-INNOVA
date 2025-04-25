import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { SolicitudViaticoStateService } from '../../../services/solicitudViatico/solicitudViatico-state.service';
import { EstadisticaSolicitudViatico } from '../../../interfaces/viatico-api-response';
import { TotalSolicitudViaticoComponent} from '../total-solicitud-viatico/total-solicitud-viatico.component';
import { EstadoSolicitudViaticoComponent } from '../estado-solicitud-viatico/estado-viaticos.component';
import { EstadoCicloComponent } from '../estado-ciclo/estado-ciclo.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-estadistica-solicitud-viatico',
  standalone: true,
  imports: [
    CommonModule,
    TotalSolicitudViaticoComponent,
    EstadoSolicitudViaticoComponent,
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
  successCiclo$!: Observable<number>;
  tooltipCiclo$!: Observable<string>;
  estadoTextoCiclo$!: Observable<string>;
  estadoTextoColor$!: Observable<string>;

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
            color: '#B7EB8F',
          },
          {
            nombre: 'Rechazado',
            monto: e?.total_rechazado ?? 0,
            color: '#FFA39E',
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

      this.porcentajeCiclo$ = this.estadistica$.pipe(
        map((e) => {
          const total = (e?.cantidad_aprobado ?? 0) + (e?.cantidad_en_revision ?? 0) + (e?.cantidad_rechazado ?? 0);
          const completados = (e?.cantidad_aprobado ?? 0) + (e?.cantidad_rechazado ?? 0);
          return total > 0 ? Math.round((completados / total) * 100) : 0;
        })
      );
      
      this.successCiclo$ = this.estadistica$.pipe(
        map((e) => {
          const total = (e?.cantidad_aprobado ?? 0) + (e?.cantidad_en_revision ?? 0) + (e?.cantidad_rechazado ?? 0);
          return total > 0 ? Math.round((e?.cantidad_aprobado ?? 0) / total * 100) : 0;
        })
      );
      
      this.tooltipCiclo$ = this.estadistica$.pipe(
        map((e) => {
          const enRevision = e?.cantidad_en_revision ?? 0;
          const aprobado = e?.cantidad_aprobado ?? 0;
          const rechazado = e?.cantidad_rechazado ?? 0;
          return `${aprobado} aprobados / ${enRevision} en revisión / ${rechazado} rechazados`;
        })
      );

      this.estadoTextoCiclo$ = this.estadistica$.pipe(
        map((e) => {
          const total = (e?.cantidad_en_revision ?? 0) +
                        (e?.cantidad_aprobado ?? 0) +
                        (e?.cantidad_rechazado ?? 0);
          const aprobados = e?.cantidad_aprobado ?? 0;
      
          if (total > 0 && aprobados === total) {
            return 'Ciclo Completo';
          }
      
          return 'Ciclo en proceso';
        })
      );

      this.estadoTextoColor$ = this.estadistica$.pipe(
        map((e) => {
          const total = (e?.cantidad_en_revision ?? 0) +
                        (e?.cantidad_aprobado ?? 0) +
                        (e?.cantidad_rechazado ?? 0);
          const aprobados = e?.cantidad_aprobado ?? 0;
      
          if (total > 0 && aprobados === total) {
            return 'green';
          }
      
          return 'blue';
        })
      );
      
    }

    if (this.cicloId != null) {
      this.estadisticaLoading$ =
        this.state.getEstadisticaSolicitudViaticoLoading(this.cicloId);
    }
  }
}
