import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EstadisticaSolicitudViatico, SolicitudViatico } from '../../interfaces/viatico-api-response';
import { SolicitudViaticoService } from './solicitudViatico.service';

@Injectable({ providedIn: 'root' })
export class SolicitudViaticoStateService {
  private solicitudesMap = new BehaviorSubject<Map<number, SolicitudViatico[]>>(new Map());
  private estadisticasMap = new BehaviorSubject<Map<number, EstadisticaSolicitudViatico>>(new Map());

  constructor(
    private solicitudService: SolicitudViaticoService,
    private loadingService: LoadingService,
    private message: NzMessageService
  ) {}

  // SOLICITUD VIATICO
  solicitudViatico$(cicloId: number): Observable<SolicitudViatico[]> {
    return this.solicitudesMap.asObservable().pipe(
      map((mapa) => mapa.get(cicloId) ?? [])
    );
  }

  fetchSolicitudViaticos(cicloId: number, forceRefresh: boolean = false): void {
    const key = `fetchSolicitudViatico-${cicloId}`;
    const currentMap = this.solicitudesMap.value;

    if (!forceRefresh && currentMap.has(cicloId)) return;

    this.loadingService.setLoading(key, true);

    this.solicitudService.getSolicitudViatico(cicloId)
      .pipe(
        tap((solicitudes) => {
          const updated = new Map(currentMap);
          updated.set(cicloId, solicitudes);
          this.solicitudesMap.next(updated);
        }),
        finalize(() => this.loadingService.setLoading(key, false)),
        catchError(error => {
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

  estadisticaSolicitudViatico$(cicloId: number): Observable<EstadisticaSolicitudViatico | null> {
    return this.estadisticasMap.asObservable().pipe(
      map((mapa) => mapa.get(cicloId) ?? null)
    );
  }

  fetchEstadisticaSolicitudViatico(cicloId: number, forceRefresh: boolean = false): void {
    const key = `fetchEstadisticaSolicitudViatico-${cicloId}`;
    const currentMap = this.estadisticasMap.value;

    if (!forceRefresh && currentMap.has(cicloId)) return;

    this.loadingService.setLoading(key, true);

    this.solicitudService.getEstadisticaSolicitudViatico(cicloId)
      .pipe(
        tap((estadistica) => {
          const updated = new Map(currentMap);
          updated.set(cicloId, estadistica);
          this.estadisticasMap.next(updated);
        }),
        finalize(() => this.loadingService.setLoading(key, false)),
        catchError(error => {
          this.message.error('Error al obtener estadísticas de solicitudes');
          return of(null); 
        })
      )
      .subscribe();
  }

  getEstadisticaSolicitudViaticoLoading(cicloId: number): Observable<boolean> {
    return this.loadingService.getLoading(`fetchEstadisticaSolicitudViatico-${cicloId}`);
  }

}
