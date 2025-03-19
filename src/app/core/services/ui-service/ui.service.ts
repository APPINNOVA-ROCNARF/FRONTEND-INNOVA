import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ModuloDto } from './Interfaces/moduloDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private moduloCache: ModuloDto[] | null = null;
  private moduloUrl = 'http://localhost:5000/api/usuario/menu';

  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  sidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

  constructor(private http: HttpClient) {}

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  setSidebarState(state: boolean): void {
    this.sidebarOpenSubject.next(state);
  }

  getMenu(): Observable<ModuloDto[]> {
    if (this.moduloCache) {
      return of(this.moduloCache);
    } else {
      return this.http
        .get<ModuloDto[]>(this.moduloUrl)
        .pipe(tap((menu) => (this.moduloCache = menu)));
    }
  }

  refreshMenu(): Observable<ModuloDto[]> {
    return this.http
      .get<ModuloDto[]>(this.moduloUrl)
      .pipe(tap((menu) => (this.moduloCache = menu)));
  }
}
