import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, take, tap } from 'rxjs';
import { ModuloDTO } from './Interfaces/moduloDTO';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../app.config';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private apiUrl = inject(API_BASE_URL);
  private moduloUrl = '/usuario/menu';

  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  sidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

  private menuSubject = new BehaviorSubject<ModuloDTO[]>([]);
  menu$: Observable<ModuloDTO[]> = this.menuSubject.asObservable();

  constructor(private http: HttpClient) {}

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  setSidebarState(state: boolean): void {
    this.sidebarOpenSubject.next(state);
  }

  loadMenu(): void {
    this.menu$
      .pipe(
        take(1), 
        switchMap((menu) =>
          menu.length > 0 ? [] : this.http.get<ModuloDTO[]>(`${this.apiUrl}${this.moduloUrl}`)
        ),
        tap((menu) => {
          if (menu.length > 0) {
            this.menuSubject.next(menu);
          }
        })
      )
      .subscribe();
  }

  refreshMenu(): void {
    this.http
      .get<ModuloDTO[]>(`${this.apiUrl}${this.moduloUrl}`)
      .pipe(tap((menu) => this.menuSubject.next(menu)))
      .subscribe();
  }

  hasPermission(route: string): boolean {
    const menu = this.menuSubject.value;
    return menu
      ? menu.some((modulo) =>
          modulo.permisos.some((permiso) => permiso.ruta === route)
        )
      : false;
  }
}
