import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { LoadingService } from '../../../core/services/loading-service/loading.service';
import { SeccionesSelect } from './Interfaces/secciones-api-response';
import { SeccionesService } from './secciones.service';

@Injectable({ providedIn: 'root' })
export class SeccionesStateService {
  private seccionesSubject = new BehaviorSubject<SeccionesSelect[]>([]);


  secciones$ = this.seccionesSubject.asObservable();


  constructor(
    private seccionesService: SeccionesService,
    private loadingService: LoadingService
  ) {}

  fetchSecciones(forceRefresh = false): void {
    const loadingKey = 'fetchSecciones';

    if (!forceRefresh && this.seccionesSubject.value.length > 0) return;

    this.loadingService.setLoading(loadingKey, true);

    this.seccionesService
      .getSecciones()
      .pipe(
        tap((secciones) => this.seccionesSubject.next(secciones)),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getSeccionesLoading() {
    return this.loadingService.getLoading('fetchSecciones');
  }

}
