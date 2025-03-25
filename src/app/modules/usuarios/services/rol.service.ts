import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { RolSimple } from '../interfaces/rol-api-response';
import { API_BASE_URL } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../../core/services/loading-service/loading.service';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private rolesSubject = new BehaviorSubject<RolSimple[]>([]);
  roles$ = this.rolesSubject.asObservable();

  private apiUrl = inject(API_BASE_URL);
  private moduloUrl = '/rol';

  constructor(private http: HttpClient, private loadingService: LoadingService) {}

  fetchRoles(): Observable<RolSimple[]> {
    const loadingKey = 'fetchRoles';
    this.loadingService.setLoading(loadingKey, true);

    return this.http
      .get<RolSimple[]>(`${this.apiUrl}${this.moduloUrl}`)
      .pipe(tap((rolsimple) => this.rolesSubject.next(rolsimple)),
      finalize(() => this.loadingService.setLoading(loadingKey, false))   
    );
  }

  getRolesLoading(): Observable<boolean>{
    return this.loadingService.getLoading('fetchRoles');
  }

  getRolesSnapshot(): RolSimple[] {
    return this.rolesSubject.getValue();
  }
}
