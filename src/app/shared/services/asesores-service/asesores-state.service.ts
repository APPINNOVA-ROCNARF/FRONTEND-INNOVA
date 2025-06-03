import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { LoadingService } from '../../../core/services/loading-service/loading.service';
import { UsuarioAppSelect } from './Interfaces/asesores-api-response';
import { AsesoresService } from './asesores.service';

@Injectable({ providedIn: 'root' })
export class AsesoresStateService {
  private asesoresSubject = new BehaviorSubject<UsuarioAppSelect[]>([]);


  asesores$ = this.asesoresSubject.asObservable();


  constructor(
    private asesoresService: AsesoresService,
    private loadingService: LoadingService
  ) {}

  fetchAsesores(forceRefresh = false): void {
    const loadingKey = 'fetchAsesores';

    if (!forceRefresh && this.asesoresSubject.value.length > 0) return;

    this.loadingService.setLoading(loadingKey, true);

    this.asesoresService
      .getAsesores()
      .pipe(
        tap((asesores) => this.asesoresSubject.next(asesores)),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getAsesoresLoading() {
    return this.loadingService.getLoading('fetchAsesores');
  }

}
