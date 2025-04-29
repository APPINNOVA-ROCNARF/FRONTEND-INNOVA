import { Component, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatosSolicitudComponent } from '../../../components/detalle-viaticos/datos-solicitud/datos-solicitud.component';
import { EstadisticaViaticoComponent } from '../../../components/detalle-viaticos/estadistica-viatico/estadistica-viatico.component';
import { TablaViaticoComponent } from '../../../components/detalle-viaticos/tabla-viatico/tabla-viatico.component';
import {
  DetalleSolicitudViatico,
  Viatico,
} from '../../../interfaces/viatico-api-response';
import { ViaticoStateService } from '../../../services/viatico/viatico-state.service';
import { SolicitudViaticoStateService } from '../../../services/solicitudViatico/solicitudViatico-state.service';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-detalle-viaticos',
  standalone: true,
  imports: [
    CommonModule,
    DatosSolicitudComponent,
    EstadisticaViaticoComponent,
    TablaViaticoComponent,
    NzModalModule,
  ],
  templateUrl: './detalle-viaticos.component.html',
  styleUrl: './detalle-viaticos.component.less',
})
export class DetalleViaticosComponent {
  solicitudId!: number;

  viatico!: Signal<Viatico[]>;
  loadingViatico!: Signal<Boolean>;

  detalleSolicitudViatico!: Signal<DetalleSolicitudViatico | null>;
  loadingDetalleSolicitudViatico!: Signal<Boolean>;

  modalAprobacionVisible = false;
  idAprobacionActual: number | null = null;
  viaticosEnProceso = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private viaticoState: ViaticoStateService,
    private solicitudViaticoState: SolicitudViaticoStateService
  ) {}

  ngOnInit(): void {
    this.solicitudId = +this.route.snapshot.paramMap.get('id')!;

    this.viatico = this.viaticoState.viaticos(this.solicitudId);
    this.loadingViatico = this.viaticoState.getViaticosLoading(
      this.solicitudId
    );
    this.viaticoState.fetchViaticos(this.solicitudId);

    this.detalleSolicitudViatico =
      this.solicitudViaticoState.detalleSolicitudViatico(this.solicitudId);
    this.loadingDetalleSolicitudViatico =
      this.solicitudViaticoState.getDetalleSolicitudViaticoLoading(
        this.solicitudId
      );
    this.solicitudViaticoState.fetchDetalleSolicitudViatico(this.solicitudId);
  }

  refrescarTodo(): void {
    const detalle = this.detalleSolicitudViatico();

    if (!detalle) return;

    const cicloId = detalle.cicloId;

    this.viaticoState.fetchViaticos(this.solicitudId, true);
    this.solicitudViaticoState.fetchSolicitudViaticos(cicloId, true);
    this.solicitudViaticoState.fetchEstadisticaSolicitudViatico(cicloId, true);
    this.solicitudViaticoState.fetchDetalleSolicitudViatico(
      this.solicitudId,
      true
    );
  }

  abrirModalAprovar(id: number): void {
    this.idAprobacionActual = id;
    this.modalAprobacionVisible = true;
  }

  cerrarModalAprobacion(): void {
    this.modalAprobacionVisible = false;
    this.idAprobacionActual = null;
  }

  confirmarAprobacion(): void {
    if (this.idAprobacionActual == null) return;

    const id = this.idAprobacionActual;
    this.viaticosEnProceso.add(id);

    this.viaticoState
      .aprobarViaticos([id], this.solicitudId, 'Viático aprobado exitosamente.')
      .subscribe({
        next: () => {
          this.cerrarModalAprobacion();
          this.viaticosEnProceso.delete(id);
          this.refrescarTodo();
        },
        error: () => {
          this.viaticosEnProceso.delete(id);
        },
      });
  }
}
