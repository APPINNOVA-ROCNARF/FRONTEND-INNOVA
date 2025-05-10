import { computed, Injectable, signal } from '@angular/core';
import {
  catchError,
  finalize,
  of,
  tap,
} from 'rxjs';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  DetalleSolicitudViatico,
  EstadisticaSolicitudViatico,
  SolicitudViatico,
} from '../../interfaces/viatico-api-response';
import { SolicitudViaticoService } from './solicitudViatico.service';

@Injectable({ providedIn: 'root' })
export class SolicitudViaticoStateService {
  private solicitudesMap = signal<Map<number, SolicitudViatico[]>>(new Map());
  private estadisticasMap = signal<Map<number, EstadisticaSolicitudViatico>>(
    new Map()
  );
  private detalleSolicitudMap = signal<Map<number, DetalleSolicitudViatico>>(new Map());

  constructor(
    private solicitudService: SolicitudViaticoService,
    private loadingService: LoadingService,
    private message: NzMessageService
  ) {}

  // SOLICITUD VIATICO

  solicitudViatico$(cicloId: number) {
    return computed(() => this.solicitudesMap().get(cicloId) ?? []);
  }

  fetchSolicitudViaticos(cicloId: number, forceRefresh = false): void {
    const key = `fetchSolicitudViatico-${cicloId}`;
    const currentMap = this.solicitudesMap();

    if (!forceRefresh && currentMap.has(cicloId)) return;

    this.loadingService.setLoading(key, true);

    this.solicitudService
      .getSolicitudViatico(cicloId)
      .pipe(
        tap((solicitudes) => {
          const updated = new Map(this.solicitudesMap());
          updated.set(cicloId, solicitudes);
          this.solicitudesMap.set(updated);
        }),
        finalize(() => this.loadingService.setLoading(key, false)),
        catchError((error) => {
          console.log(error);
          this.message.error('Error al obtener solicitudes de viático');
          return of([]);
        })
      )
      .subscribe();
  }

  getSolicitudViaticosLoading(cicloId: number) {
    return this.loadingService.getLoading(`fetchSolicitudViatico-${cicloId}`);
  }

  // ESTADISTICAS SOLICITUD VIATICO

  estadisticaSolicitudViatico$(cicloId: number) {
    return computed(() => this.estadisticasMap().get(cicloId) ?? null);
  }

  fetchEstadisticaSolicitudViatico(
    cicloId: number,
    forceRefresh = false
  ): void {
    const key = `fetchEstadisticaSolicitudViatico-${cicloId}`;
    const currentMap = this.estadisticasMap();

    if (!forceRefresh && currentMap.has(cicloId)) return;

    this.loadingService.setLoading(key, true);

    this.solicitudService
      .getEstadisticaSolicitudViatico(cicloId)
      .pipe(
        tap((estadistica) => {
          const updated = new Map(this.estadisticasMap());
          updated.set(cicloId, estadistica);
          this.estadisticasMap.set(updated);
        }),
        finalize(() => this.loadingService.setLoading(key, false)),
        catchError((error) => {
          console.log(error);
          this.message.error('Error al obtener estadísticas de solicitudes');
          return of(null);
        })
      )
      .subscribe();
  }

  getEstadisticaSolicitudViaticoLoading(cicloId: number) {
    return this.loadingService.getLoading(
      `fetchEstadisticaSolicitudViatico-${cicloId}`
    );
  }

  // DETALLE SOLICITUD VIATICO

  detalleSolicitudViatico = (solicitudId: number) =>
    computed(() => this.detalleSolicitudMap().get(solicitudId) ?? null);

  fetchDetalleSolicitudViatico(solicitudId: number, forceRefresh = false): void {
    const key = `fetchDetalleSolicitudViatico-${solicitudId}`;

    const currentMap = this.detalleSolicitudMap();

    if (!forceRefresh && currentMap.has(solicitudId)) {
      return;
    }

    this.loadingService.setLoading(key, true);

    this.solicitudService
      .getDetalleSolicitudViatico(solicitudId)
      .pipe(
        tap((detalle) => {
          const updatedMap = new Map(this.detalleSolicitudMap());
          updatedMap.set(solicitudId, detalle);
          this.detalleSolicitudMap.set(updatedMap);
        }),
        finalize(() => this.loadingService.setLoading(key, false)),
        catchError((error) => {
          console.log(error);
          this.message.error('Error al obtener detalle de solicitud de viático');
          return of(null);
        })
      )
      .subscribe();
  }

  getDetalleSolicitudViaticoLoading(solicitudId: number) {
    return this.loadingService.getLoading(
      `fetchDetalleSolicitudViatico-${solicitudId}`
    );
  }
}
