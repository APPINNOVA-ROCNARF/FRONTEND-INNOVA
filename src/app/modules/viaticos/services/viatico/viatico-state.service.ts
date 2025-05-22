import { computed, Injectable, signal } from '@angular/core';
import { finalize, map, Observable, tap } from 'rxjs';
import { EditarViaticoDTO, HistorialViatico, Viatico, ViaticoReporte } from '../../interfaces/viatico-api-response';
import { ViaticoService } from './viatico.service';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';
import { ActualizarEstadoViaticoRequest, ActualizarViaticoItem } from '../../interfaces/actualizar-estado-viatico-request';
import { AccionViatico } from '../../enums/accion-viatico.enum';

@Injectable({ providedIn: 'root' })
export class ViaticoStateService {
  private viaticosMapSignal = signal<Map<number, Viatico[]>>(new Map());
  private historialMapSignal = signal<Map<number, HistorialViatico[]>>(new Map());
  private reporteSignal = signal<ViaticoReporte[] | null>(null);

  constructor(
    private viaticoService: ViaticoService,
    private loadingService: LoadingService,
  ) { }

  //VIATICOS

  viaticos = (solicitudId: number) =>
    computed(() => this.viaticosMapSignal().get(solicitudId) ?? []);

  fetchViaticos(solicitudId: number, forceRefresh = false): void {
    const loadingKey = `fetchViaticos-${solicitudId}`;

    const currentMap = this.viaticosMapSignal();

    if (!forceRefresh && currentMap.has(solicitudId)) {
      return;
    }

    this.loadingService.setLoading(loadingKey, true);

    this.viaticoService
      .getViaticos(solicitudId)
      .pipe(
        tap((viaticos) => {
          const updatedMap = new Map(this.viaticosMapSignal());
          updatedMap.set(solicitudId, viaticos);
          this.viaticosMapSignal.set(updatedMap);
        }),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getViaticosLoading(solicitudId: number) {
    return this.loadingService.getLoading(`fetchViaticos-${solicitudId}`);
  }

  // APROBAR VIATICOS

  aprobarViaticos(
    ids: number[],
    solicitudId: number
  ): Observable<void> {
    const request: ActualizarEstadoViaticoRequest = {
      accion: AccionViatico.Aprobado,
      viaticos: ids.map((id) => ({ id })),
    };

    return this.viaticoService.actualizarEstadoViaticos(request).pipe(
      tap(() => this.fetchViaticos(solicitudId, true)),
      map(() => void 0)
    );
  }

  // RECHAZAR VIATICO

  rechazarViatico(
    viatico: ActualizarViaticoItem,
    solicitudId: number
  ): Observable<void> {
    const request: ActualizarEstadoViaticoRequest = {
      accion: AccionViatico.Rechazado,
      viaticos: [viatico],
    };

    return this.viaticoService.actualizarEstadoViaticos(request).pipe(
      tap(() => this.fetchViaticos(solicitudId, true)),
      map(() => void 0)
    );
  }

  // EDITAR VIATICO

  editarFacturaViatico(
    viaticoId: number,
    solicitudId: number,
    data: EditarViaticoDTO
  ): Observable<void> {
    return this.viaticoService.editarViatico(viaticoId, data).pipe(
      tap(() => {
        const currentMap = this.viaticosMapSignal();
        const viaticos = currentMap.get(solicitudId);
        if (!viaticos) return;

        const index = viaticos.findIndex(v => v.id === viaticoId);
        if (index === -1) return;

        // eslint-disable-next-line security/detect-object-injection
        const updatedViatico = { ...viaticos[index] };

        if (data.numeroFactura !== undefined) {
          updatedViatico.facturas[0].numeroFactura = data.numeroFactura;
        }
        if (data.nombreProveedor !== undefined) {
          updatedViatico.facturas[0].proveedorNombre = data.nombreProveedor;
        }

        const updatedViaticos = [...viaticos];
        // eslint-disable-next-line security/detect-object-injection
        updatedViaticos[index] = updatedViatico;

        const updatedMap = new Map(currentMap);
        updatedMap.set(solicitudId, updatedViaticos);
        this.viaticosMapSignal.set(updatedMap);
      })
    );
  }

  // HISTORIAL VIATICO

  historial = (viaticoId: number) =>
    computed(() => this.historialMapSignal().get(viaticoId) ?? []);

  fetchHistorial(viaticoId: number, forceRefresh = false): void {
    const loadingKey = 'fetchHistorial-${viaticoId}';
    const currentMap = this.historialMapSignal();

    if (!forceRefresh && currentMap.has(viaticoId)) {
      return;
    }

    this.loadingService.setLoading(loadingKey, true);

    this.viaticoService
      .getHistorialViaticos(viaticoId)
      .pipe(
        tap((historial: HistorialViatico[]) => {
          const updatedMap = new Map(this.historialMapSignal());
          updatedMap.set(viaticoId, historial);
          this.historialMapSignal.set(updatedMap);
        }),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getHistorialLoading(viaticoId: number) {
    return this.loadingService.getLoading(`fetchHistorial-${viaticoId}`);
  }

  // REPORTE VIATICOS

  reporte = computed(() => this.reporteSignal() ?? []);

  fetchReporteViaticos(filtros: { cicloId?: number; fechaInicio?: string; fechaFin?: string }, forceRefresh = false): void {
    const key = JSON.stringify(filtros);

    if (!forceRefresh && this.reporteSignal()) {
      return;
    }

    this.loadingService.setLoading(`fetchReporte-${key}`, true);

    this.viaticoService.getReporteViaticos(filtros).pipe(
      tap((reporte) => this.reporteSignal.set(reporte)),
      finalize(() => this.loadingService.setLoading(`fetchResumen-${key}`, false))
    ).subscribe();
  }

  getReporteLoading(filtros: { cicloId?: number; fechaInicio?: string; fechaFin?: string }) {
    const key = JSON.stringify(filtros);
    return this.loadingService.getLoading(`fetchResumen-${key}`);
  }
}
