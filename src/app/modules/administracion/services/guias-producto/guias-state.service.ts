import { Injectable, computed, signal } from '@angular/core';
import { GuiaProducto, GuiaProductoDetalle } from '../../interfaces/guias-api-response';
import { tap, finalize } from 'rxjs';
import { GuiaProductoService } from './guias.service';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';

@Injectable({ providedIn: 'root' })
export class GuiaProductoStateService {
  private guiasSignal = signal<GuiaProducto[]>([]);
  private guiaLoadingSignal = signal(false);

  private guiaDetalleSignal = signal<GuiaProductoDetalle | null>(null);
  private guiaDetalleLoadingSignal = signal(false);

  constructor(
    private guiaService: GuiaProductoService,
    private loadingService: LoadingService
  ) {}

  guias = computed(() => this.guiasSignal());

  guiaLoading = computed(() => this.guiaLoadingSignal());

  fetchGuias(forceRefresh = false): void {
    const loadingKey = 'fetchGuias';

    if (!forceRefresh && this.guiaLoadingSignal()) {
      return;
    }

    this.loadingService.setLoading(loadingKey, true);

    this.guiaService
      .getGuiasProducto()
      .pipe(
        tap((guias) => {
          this.guiasSignal.set(guias);
          this.guiaLoadingSignal.set(true);
        }),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getGuiasLoading() {
    return this.loadingService.getLoading('fetchGuias');
  }

  // GUIA DETALLE

  readonly guia = computed(() => this.guiaDetalleSignal());
  readonly cargado = computed(() => this.guiaDetalleLoadingSignal());

  fetchGuiaDetalle(id: number, forceRefresh = false): void {
    const loadingKey = `fetchGuiaDetalle-${id}`;

    if (!forceRefresh && this.guiaDetalleLoadingSignal()) {
      return;
    }

    this.loadingService.setLoading(loadingKey, true);

    this.guiaService
      .getGuiaProductoDetalle(id)
      .pipe(
        tap((guia) => {
          this.guiaDetalleSignal.set(guia);
          this.guiaDetalleLoadingSignal.set(true);
        }),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getGuiaDetalleLoading(id: number) {
    return this.loadingService.getLoading(`fetchGuiaDetalle-${id}`);
  }
}
