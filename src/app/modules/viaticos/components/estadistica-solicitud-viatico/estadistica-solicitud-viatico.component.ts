import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { SolicitudViaticoStateService } from '../../services/solicitudViatico/solicitudViatico-state.service';
import { EstadisticaSolicitudViatico } from '../../interfaces/viatico-api-response';
import { TotalViaticosComponent } from '../total-viaticos/total-viaticos.component';
import { EstadoViaticosComponent } from '../estado-viaticos/estado-viaticos.component';
import { EstadoCicloComponent } from '../estado-ciclo/estado-ciclo.component';
import { NzGridModule } from 'ng-zorro-antd/grid';


@Component({
  selector: 'app-estadistica-solicitud-viatico',
  standalone: true,
  imports: [
    CommonModule,
    TotalViaticosComponent,
    EstadoViaticosComponent,
    EstadoCicloComponent,
    NzGridModule
  ],
  templateUrl: './estadistica-solicitud-viatico.component.html',
  styleUrl: './estadistica-solicitud-viatico.component.less'
})
export class EstadisticaSolicitudViaticoComponent implements OnChanges{
  @Input() cicloId: number | null = null;

  estadistica$!: Observable<EstadisticaSolicitudViatico | null>;
  totalViaticos$!: Observable<number>;
  totalRegistros$!: Observable<number>;
  distribucionEstado$!: Observable<any[]>;
  distribucionCategoria$!: Observable<any[]>;
  porcentajeCiclo$!: Observable<number>;
  tooltipCiclo$!: Observable<string>;
  estadoTextoCiclo$!: Observable<string>;

  constructor(private state: SolicitudViaticoStateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cicloId'] && this.cicloId != null) {
      this.state.fetchEstadisticaSolicitudViatico(this.cicloId);
      this.estadistica$ = this.state.estadisticaSolicitudViatico$(this.cicloId);

      this.totalViaticos$ = this.estadistica$.pipe(map(e => e?.totalMonto ?? 0));
      this.totalRegistros$ = this.estadistica$.pipe(map(e => e?.totalSolicitudes ?? 0));

      this.distribucionEstado$ = this.estadistica$.pipe(
        map(e => [
          { nombre: 'En revisión', monto: e?.totalEnRevision ?? 0, color: '#8ecaff' },
          { nombre: 'Aprobado', monto: e?.totalAprobado ?? 0, color: '#b2f2bb' },
          { nombre: 'Rechazado', monto: e?.totalRechazado ?? 0, color: '#e0e0e0' }
        ])
      );

      this.distribucionCategoria$ = this.estadistica$.pipe(
        map(e => [
          { nombre: 'Movilización', monto: e?.montoMovilizacion ?? 0, color: '#ef8b83' },
          { nombre: 'Hospedaje', monto: e?.montoHospedaje ?? 0, color: '#82edcd' },
          { nombre: 'Alimentación', monto: e?.montoAlimentacion ?? 0, color: '#c082ed' }
        ])
      );

      const totalViaticos$ = this.estadistica$.pipe(
        map(e =>
          (e?.viaticosAprobados ?? 0) +
          (e?.viaticosEnRevision ?? 0) +
          (e?.viaticosRechazados ?? 0)
        )
      );

      const aprobados$ = this.estadistica$.pipe(map(e => e?.viaticosAprobados ?? 0));

      this.porcentajeCiclo$ = combineLatest([totalViaticos$, aprobados$]).pipe(
        map(([total, aprobados]) => total > 0 ? Math.round((aprobados / total) * 100) : 0)
      );

      this.tooltipCiclo$ = combineLatest([totalViaticos$, aprobados$]).pipe(
        map(([total, aprobados]) => `${aprobados} completados / ${total - aprobados} pendientes`)
      );

      this.estadoTextoCiclo$ = this.porcentajeCiclo$.pipe(
        map(p => p === 100 ? 'Ciclo completado' : 'En progreso')
      );
    }
  }
}
