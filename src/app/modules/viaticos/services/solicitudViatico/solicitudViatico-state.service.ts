import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SolicitudViatico } from '../../interfaces/viatico-api-response';
import { SolicitudViaticoService } from './solicitudViatico.service';

@Injectable({ providedIn: 'root' })
export class SolicitudViaticoStateService {
  private solicitudesMap = new BehaviorSubject<Map<number, SolicitudViatico[]>>(new Map());

  constructor(
    private solicitudService: SolicitudViaticoService,
    private loadingService: LoadingService,
    private message: NzMessageService
  ) {}

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

    this.solicitudService.getSolicitudViaticos(cicloId)
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
}
