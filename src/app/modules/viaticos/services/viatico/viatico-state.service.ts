import { computed, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { Viatico } from '../../interfaces/viatico-api-response';
import { ViaticoService } from './viatico.service';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';
import { ActualizarEstadoViaticoRequest } from '../../interfaces/actualizar-estado-viatico-request';
import { AccionViatico } from '../../enums/accion-viatico.enum';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({ providedIn: 'root' })
export class ViaticoStateService {
  private viaticosMapSignal = signal<Map<number, Viatico[]>>(new Map());

  constructor(
    private viaticoService: ViaticoService,
    private loadingService: LoadingService,
    private message: NzMessageService
  ) {}

  //VIATICOS

  viaticos = (solicitudId: number) =>
    computed(() => this.viaticosMapSignal().get(solicitudId) ?? []);

  fetchViaticos(solicitudId: number, forceRefresh: boolean = false): void {
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
    solicitudId: number,
    mensajeExito: string = 'Viáticos aprobados exitosamente.'
  ): Observable<void> {
    const request: ActualizarEstadoViaticoRequest = {
      accion: AccionViatico.Aprobado,
      viaticos: ids.map((id) => ({ id })),
    };

    return this.viaticoService.actualizarEstadoViaticos(request).pipe(
      tap(() => {
        this.fetchViaticos(solicitudId, true);
        this.message.success(mensajeExito);
      }),
      catchError((error) => {
        const msg = error?.error?.message ?? 'Error al aprobar viáticos.';
        this.message.error(msg);
        return throwError(() => error);
      }),
      map(() => void 0)
    );
  }
}
