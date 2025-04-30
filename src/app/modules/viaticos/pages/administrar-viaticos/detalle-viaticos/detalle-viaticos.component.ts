import { Component, Signal, ViewChild } from '@angular/core';
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalRechazoComponent } from "../../../components/detalle-viaticos/modal-rechazo/modal-rechazo.component";
import { ActualizarViaticoItem } from '../../../interfaces/actualizar-estado-viatico-request';



@Component({
  selector: 'app-detalle-viaticos',
  standalone: true,
  imports: [
    CommonModule,
    DatosSolicitudComponent,
    EstadisticaViaticoComponent,
    TablaViaticoComponent,
    NzModalModule,
    ModalRechazoComponent
  ],
  templateUrl: './detalle-viaticos.component.html',
  styleUrl: './detalle-viaticos.component.less',
})
export class DetalleViaticosComponent {
  @ViewChild(TablaViaticoComponent) tablaViaticoComponent!: TablaViaticoComponent;


  solicitudId!: number;

  viatico!: Signal<Viatico[]>;
  loadingViatico!: Signal<Boolean>;

  detalleSolicitudViatico!: Signal<DetalleSolicitudViatico | null>;
  loadingDetalleSolicitudViatico!: Signal<Boolean>;

  // MODAL APROBAR
  modalAprobacionVisible = false;
  modoAprobacion: 'individual' | 'masivo' = 'individual';

  idAprobacionActual: number | null = null;
  idsAprobacionMasiva: number[] = [];
  viaticosEnProceso = new Set<number>();

  // MODAL RECHAZAR
  modalRechazoVisible = false;
  viaticoIdRechazoActual: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private viaticoState: ViaticoStateService,
    private solicitudViaticoState: SolicitudViaticoStateService,
    private message: NzMessageService
  ) { }

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

  refresh(): void {
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

  abrirModalAprobacionIndividual(id: number): void {
    this.modoAprobacion = 'individual';
    this.idAprobacionActual = id;
    this.modalAprobacionVisible = true;
  }
  
  abrirModalAprobacionMasiva(ids: number[]): void {
    this.modoAprobacion = 'masivo';
    this.idsAprobacionMasiva = ids;
    this.modalAprobacionVisible = true;
  }

  confirmarAprobacion(): void {
    if (this.modoAprobacion === 'individual' && this.idAprobacionActual !== null) {
      const id = this.idAprobacionActual;
      this.viaticosEnProceso.add(id);
  
      this.viaticoState.aprobarViaticos([id], this.solicitudId).subscribe({
        next: () => {
          this.message.success('Viático aprobado exitosamente.');
          this.viaticosEnProceso.delete(id);
          this.cerrarModalAprobacion();
          this.refresh();
        },
        error: () => {
          this.viaticosEnProceso.delete(id);
        }
      });
    }
  
    if (this.modoAprobacion === 'masivo' && this.idsAprobacionMasiva.length > 0) {
      this.idsAprobacionMasiva.forEach(id => this.viaticosEnProceso.add(id));
  
      this.viaticoState.aprobarViaticos(this.idsAprobacionMasiva, this.solicitudId).subscribe({
        next: () => {
          this.message.success('Viáticos aprobados exitosamente.');
          this.idsAprobacionMasiva.forEach(id => this.viaticosEnProceso.delete(id));
          this.tablaViaticoComponent.limpiarSeleccion();
          this.cerrarModalAprobacion();
          this.refresh();
        },
        error: () => {
          this.idsAprobacionMasiva.forEach(id => this.viaticosEnProceso.delete(id));
        }
      });
    }
  }
  
  cerrarModalAprobacion(): void {
    this.modalAprobacionVisible = false;
    this.idAprobacionActual = null;
    this.idsAprobacionMasiva = [];
  }

  abrirModalRechazo(viaticoId: number): void {
    this.viaticoIdRechazoActual = viaticoId;
    this.modalRechazoVisible = true;
  }

  cerrarModalRechazo(): void {
    this.modalRechazoVisible = false;
    this.viaticoIdRechazoActual = null;
  }

  onConfirmarRechazo(item: ActualizarViaticoItem): void {
    if (!this.viaticoIdRechazoActual) return;
  
    this.viaticoState.rechazarViatico(item, this.solicitudId).subscribe({
      next: () => {
        this.message.success('Viático rechazado exitosamente.');
        this.cerrarModalRechazo();
        this.refresh();
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Error al rechazar viático.';
        this.message.error(msg);
      }
    });
  }
}
