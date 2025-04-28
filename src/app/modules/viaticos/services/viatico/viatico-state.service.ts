import { Injectable, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { Viatico } from '../../interfaces/viatico-api-response';
import { ViaticoService } from './viatico.service';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';

@Injectable({ providedIn: 'root' })
export class ViaticoStateService {
  private viaticosSignal = signal<Viatico[]>([]);

  readonly viaticos = this.viaticosSignal.asReadonly();

  constructor(
    private viaticoService: ViaticoService,
    private loadingService: LoadingService
  ) {}

  fetchViaticos(solicitudId: number, forceRefresh: boolean = false): void {
    const loadingKey = `fetchViaticos-${solicitudId}`;

    if (!forceRefresh && this.viaticosSignal().length > 0) return;

    this.loadingService.setLoading(loadingKey, true);

    this.viaticoService
      .getViaticos(solicitudId)
      .pipe(
        tap((viaticos) => this.viaticosSignal.set(viaticos)),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getViaticosLoading(solicitudId: number) {
    return this.loadingService.getLoading(`fetchViaticos-${solicitudId}`);
  }
}
