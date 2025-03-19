import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ModuloDTO } from './Interfaces/moduloDTO';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../app.config';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private moduloCache: ModuloDTO[] | null = null;
  private apiUrl = inject(API_BASE_URL);
  private moduloUrl = 'http://localhost:5000/api/usuarios/menu';

  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  sidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

  constructor(private http: HttpClient) {}

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  setSidebarState(state: boolean): void {
    this.sidebarOpenSubject.next(state);
  }

  getMenu(): Observable<ModuloDTO[]> {
    if (this.moduloCache) {
      return of(this.moduloCache);
    } else {
      return this.http
        .get<ModuloDTO[]>(this.moduloUrl)
        .pipe(tap((menu) => (this.moduloCache = menu)));
    }
  }

  refreshMenu(): Observable<ModuloDTO[]> {
    return this.http
      .get<ModuloDTO[]>(this.moduloUrl)
      .pipe(tap((menu) => (this.moduloCache = menu)));
  }
}
