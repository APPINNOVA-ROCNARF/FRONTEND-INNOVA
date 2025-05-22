import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { RolService } from './rol.service';
import { RolSimple, RolDetalle, Modulo, NuevoRol } from '../../interfaces/roles/rol-api-response';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({ providedIn: 'root' })
export class RolStateService {
  private rolesSubject = new BehaviorSubject<RolSimple[]>([]);
  private rolDetalleSubject = new BehaviorSubject<RolDetalle | null>(null);
  private moduloSubject = new BehaviorSubject<Modulo[]>([]);

  roles$ = this.rolesSubject.asObservable();
  rolDetalle$ = this.rolDetalleSubject.asObservable();
  modulo$ = this.moduloSubject.asObservable();

  constructor(
    private rolService: RolService,
    private loadingService: LoadingService,
    private message: NzMessageService
  ) {}

  fetchRoles(forceRefresh = false): void {
    const loadingKey = 'fetchRoles';

    if (!forceRefresh && this.rolesSubject.value.length > 0) return;

    this.loadingService.setLoading(loadingKey, true);

    this.rolService
      .getRoles()
      .pipe(
        tap((roles) => this.rolesSubject.next(roles)),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  fetchModulos(forceRefresh = false): void {
    const loadingKey = 'fetchModulos';

    if (!forceRefresh && this.moduloSubject.value.length > 0) return;

    this.loadingService.setLoading(loadingKey, true);

    this.rolService
      .getModulos()
      .pipe(
        tap((modulos) => this.moduloSubject.next(modulos)),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  fetchRolDetalle(rolId: number): void {
    const loadingKey = `fetchRolDetalle-${rolId}`;

    this.loadingService.setLoading(loadingKey, true);

    this.rolService
      .getRolDetalle(rolId)
      .pipe(
        tap((detalle) => this.rolDetalleSubject.next(detalle)),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  crearRol(payload: NuevoRol): void {
    this.rolService
      .crearRol(payload)
      .pipe(
        tap(() => {
          this.message.success('Rol creado correctamente');
          this.fetchRoles(true);
        })
      )
      .subscribe();
  }

  getRolesLoading() {
    return this.loadingService.getLoading('fetchRoles');
  }

  getRolDetalleLoading(rolId: number) {
    return this.loadingService.getLoading(`fetchRolDetalle-${rolId}`);
  }

  getRolDetalleSnapshot(): RolDetalle | null {
    return this.rolDetalleSubject.getValue();
  }

  setModulos(modulos: Modulo[]): void {
    this.moduloSubject.next(modulos);
  }

  getModulosSnapshot(): Modulo[] {
    return this.moduloSubject.getValue();
  }
}
