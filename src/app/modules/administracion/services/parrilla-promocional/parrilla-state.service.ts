import { Injectable, computed, signal } from '@angular/core';
import { tap, finalize } from 'rxjs';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';
import { ParrillaPromocionalDTO } from '../../interfaces/parrilla-api.response';
import { ParrillaPromocionalService } from './parrilla.service';

@Injectable({ providedIn: 'root' })
export class ParrillaPromocionalStateService {
  private parrillaSignal = signal<ParrillaPromocionalDTO | null>(null);
  private parrillaLoadingSignal = signal(false);

  constructor(
    private parrillaService: ParrillaPromocionalService,
    private loadingService: LoadingService
  ) {}

  parrilla = computed(() => this.parrillaSignal());

  guiaLoading = computed(() => this.parrillaLoadingSignal());

  fetchParrilla(forceRefresh = false): void {
    const loadingKey = 'fetchParrilla';

    if (!forceRefresh && this.parrillaLoadingSignal()) {
      return;
    }

    this.loadingService.setLoading(loadingKey, true);

    this.parrillaService
      .getParrillaPromocional()
      .pipe(
        tap((parrilla) => {
          this.parrillaSignal.set(parrilla);
          this.parrillaLoadingSignal.set(true);
        }),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getParrillaLoading() {
    return this.loadingService.getLoading('fetchParrilla');
  }
}