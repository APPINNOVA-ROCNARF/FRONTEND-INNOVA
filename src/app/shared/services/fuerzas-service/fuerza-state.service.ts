import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { LoadingService } from '../../../core/services/loading-service/loading.service';
import { FuerzaSelectDTO } from './Interfaces/FuerzaSelectDTO';
import { FuerzaService } from './fuerza.service';

@Injectable({ providedIn: 'root' })
export class FuerzaStateService {
  private fuerzasSubject = new BehaviorSubject<FuerzaSelectDTO[]>([]);

  fuerzas$ = this.fuerzasSubject.asObservable();

  constructor(
    private fuerzaService: FuerzaService,
    private loadingService: LoadingService
  ) {}

  fetchFuerzas(forceRefresh = false): void {
    const loadingKey = 'fetchFuerzas';

    if (!forceRefresh && this.fuerzasSubject.value.length > 0) return;

    this.loadingService.setLoading(loadingKey, true);

    this.fuerzaService
      .getFuerzas()
      .pipe(
        tap((fuerzas) => this.fuerzasSubject.next(fuerzas)),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getFuerzasLoading() {
    return this.loadingService.getLoading('fetchFuerzas');
  }
}
