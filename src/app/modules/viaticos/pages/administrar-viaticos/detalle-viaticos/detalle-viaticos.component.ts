import { Component, OnInit, Signal, ViewChild } from '@angular/core';
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
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalRechazoComponent } from '../../../components/detalle-viaticos/modal-rechazo/modal-rechazo.component';
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
    ModalRechazoComponent,
  ],
  templateUrl: './detalle-viaticos.component.html',
  styleUrl: './detalle-viaticos.component.less',
})
export class DetalleViaticosComponent implements OnInit {
  @ViewChild(TablaViaticoComponent)
  tablaViaticoComponent!: TablaViaticoComponent;

  @ViewChild(ModalRechazoComponent)
  modalRechazoComponent!: ModalRechazoComponent;

  solicitudId!: number;

  viatico!: Signal<Viatico[]>;
  loadingViatico!: Signal<boolean>;

  detalleSolicitudViatico!: Signal<DetalleSolicitudViatico | null>;
  loadingDetalleSolicitudViatico!: Signal<boolean>;

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
    private message: NzMessageService,
    private modal : NzModalService
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
    if (
      this.modoAprobacion === 'individual' &&
      this.idAprobacionActual !== null
    ) {
      const id = this.idAprobacionActual;
      this.viaticosEnProceso.add(id);

      this.viaticoState.aprobarViaticos([id], this.solicitudId).subscribe({
        next: () => {
          this.message.success('Viático aprobado exitosamente.');
          this.cerrarModalAprobacion();
          this.refresh();
        },
        error: () => {
          this.message.error('Error al aprobar viático.');
        },
        complete: () => {
          this.viaticosEnProceso.delete(id);
        },
      });
    }

    if (
      this.modoAprobacion === 'masivo' &&
      this.idsAprobacionMasiva.length > 0
    ) {
      this.idsAprobacionMasiva.forEach((id) => this.viaticosEnProceso.add(id));

      this.viaticoState
        .aprobarViaticos(this.idsAprobacionMasiva, this.solicitudId)
        .subscribe({
          next: () => {
            this.message.success('Viáticos aprobados exitosamente.');
            this.tablaViaticoComponent.limpiarSeleccion();
            this.cerrarModalAprobacion();
            this.refresh();
          },
          error: () => {
            this.message.error('Error al aprobar viáticos.');
          },
          complete: () => {
            this.idsAprobacionMasiva.forEach((id) =>
              this.viaticosEnProceso.delete(id)
            );
          },
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
    if (!item.id) return;

    this.viaticosEnProceso.add(item.id);

    this.viaticoState.rechazarViatico(item, this.solicitudId).subscribe({
      next: () => {
        this.message.success('Viático rechazado exitosamente.');
        this.modalRechazoComponent.limpiarCampos();
        this.cerrarModalRechazo();
        this.refresh();
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Error al rechazar viático.';
        this.message.error(msg);
      },
      complete: () => {
        this.viaticosEnProceso.delete(item.id);
      },
    });
  }

  abrirModalEditar(cambios: {
    id: number;
    numeroFactura?: string;
    nombreProveedor?: string;
  }): void {
    const { id, numeroFactura, nombreProveedor } = cambios;
  
    if (!numeroFactura && !nombreProveedor) {
      return; 
    }
  
    this.modal.confirm({
      nzTitle: 'Editar viático',
      nzContent: '¿Está seguro de que desea editar este viático?',
      nzOkText: 'Aceptar',
      nzCancelText: 'Cancelar',
      nzOnOk: () =>
        this.viaticoState
          .editarFacturaViatico(id, this.solicitudId ,{ numeroFactura, nombreProveedor })
          .subscribe({
            next: () => {
              this.message.success(`Viático actualizado correctamente`);
              this.refresh()
            },
            error: () => {
              this.message.error(`Error al actualizar viático`);
            },
          }),
    });
  }
}

