import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import { ModuloDTO } from './Interfaces/moduloDTO';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../app.config';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private apiUrl = inject(API_BASE_URL);
  private moduloUrl = '/usuario/menu';

  // Sidebar Desktop
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  sidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

  // Menu 
  private menuSubject = new BehaviorSubject<ModuloDTO[]>([]);
  menu$: Observable<ModuloDTO[]> = this.menuSubject.asObservable();

  // Drawer Mobile
  private drawerVisibleSubject = new BehaviorSubject<boolean>(false);
  drawerVisible$: Observable<boolean> = this.drawerVisibleSubject.asObservable();
  isMobile$: Observable<boolean>;

  constructor(private http: HttpClient, private breakpointObserver: BreakpointObserver) {
    this.isMobile$ = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map(result => result.matches));
    
    this.isMobile$.subscribe(isMobile => {
      if (isMobile) {
        this.sidebarOpenSubject.next(false);
      }
    });
  }

  toggleSidebar(): void {
    this.isMobile$.pipe(take(1)).subscribe(isMobile => {
      if (isMobile) {
        this.drawerVisibleSubject.next(!this.drawerVisibleSubject.value);
      } else {
        this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
      }
    });  }

  setSidebarState(state: boolean): void {
    this.sidebarOpenSubject.next(state);
  }

  closeDrawer(): void {
    this.drawerVisibleSubject.next(false);
  }

  openDrawer(): void {
    this.drawerVisibleSubject.next(true);
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
}
