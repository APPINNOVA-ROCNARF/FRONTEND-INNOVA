import { Injectable, computed, signal } from '@angular/core';
import {
  GuiaProducto,
  GuiaProductoDetalle,
  SelectItemDTO,
} from '../../interfaces/guias-api-response';
import { tap, finalize } from 'rxjs';
import { GuiaProductoService } from './guias.service';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';

@Injectable({ providedIn: 'root' })
export class GuiaProductoStateService {
  private guiasSignal = signal<GuiaProducto[]>([]);
  private guiaLoadingSignal = signal(false);

  private guiaDetalleSignal = signal<GuiaProductoDetalle | null>(null);
  private guiaDetalleLoadingSignal = signal(false);

  private guiasNombresSignal = signal<SelectItemDTO[]>([]);
  private guiasMarcasSignal = signal<SelectItemDTO[]>([]);
  private guiasSelectLoadingSignal = signal<boolean>(false);

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

  readonly guiaMarca = computed(() => this.guiasMarcasSignal());
  readonly guiaNombre = computed(() => this.guiasNombresSignal());


  fetchGuiaSelect(forceRefresh = false): void {
    const loadingKey = 'fetchGuiaSelect';

    if (!forceRefresh && this.guiasSelectLoadingSignal()) {
      return;
    }

    this.loadingService.setLoading(loadingKey, true);
    this.guiasSelectLoadingSignal.set(true);

    this.guiaService
      .getGuiaSelect()
      .pipe(
        tap((res) => {
          this.guiasNombresSignal.set(res.nombres);
          this.guiasMarcasSignal.set(res.marcas);
        }),
        finalize(() => {
          this.loadingService.setLoading(loadingKey, false);
          this.guiasSelectLoadingSignal.set(false);
        })
      )
      .subscribe();
  }

  getGuiasSelectLoading() {
    return this.loadingService.getLoading('fetchGuiaSelect');
  }
}
