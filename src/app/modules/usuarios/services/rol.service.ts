import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { RolDetalle, RolSimple } from '../interfaces/rol-api-response';
import { API_BASE_URL } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../../core/services/loading-service/loading.service';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private rolesSubject = new BehaviorSubject<RolSimple[]>([]);
  private rolDetalleSubject = new BehaviorSubject<RolDetalle | null>(null);
  roles$ = this.rolesSubject.asObservable();
  rolDetalle$ = this.rolDetalleSubject.asObservable();

  private apiUrl = inject(API_BASE_URL);
  private rolUrl = '/rol';

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  fetchRoles(): Observable<RolSimple[]> {
    const loadingKey = 'fetchRoles';
    this.loadingService.setLoading(loadingKey, true);

    return this.http.get<RolSimple[]>(`${this.apiUrl}${this.rolUrl}`).pipe(
      tap((rolsimple) => this.rolesSubject.next(rolsimple)),
      finalize(() => this.loadingService.setLoading(loadingKey, false))
    );
  }

  fetchRolDetalle(rolId: number): Observable<RolDetalle> {
    const loadingKey = `fetchRolDetalle-${rolId}`;
    this.loadingService.setLoading(loadingKey, true);

    return this.http
      .get<RolDetalle>(`${this.apiUrl}${this.rolUrl}/${rolId}`)
      .pipe(
        tap((detalle) => this.rolDetalleSubject.next(detalle)),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      );
  }

  getRolesLoading(): Observable<boolean> {
    return this.loadingService.getLoading('fetchRoles');
  }

  getRolDetalleLoading(rolId: number): Observable<boolean> {
    return this.loadingService.getLoading(`getRolDetalle-${rolId}`);
  }

  getRolDetalleSnapshot(): RolDetalle | null {
    return this.rolDetalleSubject.getValue();
  }
}
