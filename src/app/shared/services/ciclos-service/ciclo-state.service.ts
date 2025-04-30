import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { CicloSelectDTO } from './Interfaces/CicloSelectDTO';
import { LoadingService } from '../../../core/services/loading-service/loading.service';
import { CicloService } from './ciclo.service';

@Injectable({ providedIn: 'root' })
export class CiclotateService {
  private ciclosSubject = new BehaviorSubject<CicloSelectDTO[]>([]);


  ciclos$ = this.ciclosSubject.asObservable();


  constructor(
    private cicloService: CicloService,
    private loadingService: LoadingService
  ) {}

  fetchCiclos(forceRefresh = false): void {
    const loadingKey = 'fetchCiclos';

    if (!forceRefresh && this.ciclosSubject.value.length > 0) return;

    this.loadingService.setLoading(loadingKey, true);

    this.cicloService
      .getCiclos()
      .pipe(
        tap((ciclos) => this.ciclosSubject.next(ciclos)),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getCiclosLoading() {
    return this.loadingService.getLoading('fetchCiclos');
  }

}
