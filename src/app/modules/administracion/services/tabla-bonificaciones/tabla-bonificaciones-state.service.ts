import { Injectable, computed, signal } from '@angular/core';
import { tap, finalize } from 'rxjs';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';
import { TablaBonificacionesDTO } from '../../interfaces/tabla-bonificaciones-api.response';
import { TablaBonificacionesService } from './tabla-bonificaciones.service';


@Injectable({ providedIn: 'root' })
export class TablaBonificacionesStateService {
  private tablaBonificacionesSignal = signal<TablaBonificacionesDTO | null>(null);
  private tablaBonificacionesLoadingSignal = signal(false);

  constructor(
    private bonificacionesService: TablaBonificacionesService,
    private loadingService: LoadingService
  ) {}

  tablaBonificaciones = computed(() => this.tablaBonificacionesSignal());

  fetchTablaBonificaciones(forceRefresh = false): void {
    const loadingKey = 'fetchTablaBonificaciones';

    if (!forceRefresh && this.tablaBonificacionesLoadingSignal()) {
      return;
    }

    this.loadingService.setLoading(loadingKey, true);

    this.bonificacionesService
      .getTablaBonificaciones()
      .pipe(
        tap((tabla) => {
          this.tablaBonificacionesSignal.set(tabla);
          this.tablaBonificacionesLoadingSignal.set(true);
        }),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getTablaBonificacionesLoading() {
    return this.loadingService.getLoading('fetchTablaBonificaciones');
  }
}