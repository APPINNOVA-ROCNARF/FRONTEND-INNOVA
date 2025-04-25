import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { Viatico } from '../../interfaces/viatico-api-response';
import { ViaticoService } from './viatico.service';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({ providedIn: 'root' })
export class ViaticoStateService {
  private viaticosSubject = new BehaviorSubject<Viatico[]>([]);

  viaticos$ = this.viaticosSubject.asObservable();

  constructor(
    private viaticoService: ViaticoService,
    private loadingService: LoadingService,
    private message: NzMessageService
  ) {}

  fetchViaticos(forceRefresh: boolean = false, solicitudId: number): void {
    const loadingKey = `fetchViaticos-${solicitudId}`;

    if (!forceRefresh && this.viaticosSubject.value.length > 0) return;

    this.loadingService.setLoading(loadingKey, true);

    this.viaticoService
      .getViaticos(solicitudId)
      .pipe(
        tap((viatico) => this.viaticosSubject.next(viatico)),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }
}
