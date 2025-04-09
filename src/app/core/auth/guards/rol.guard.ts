import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { UiService } from '../../services/ui-service/ui.service';

@Injectable({
  providedIn: 'root',
})
export class RolGuard implements CanActivate {
  constructor(private uiService: UiService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.uiService.menu$.pipe(
      filter((menu) => menu.length > 0),
      map((menu) => {
        const rutaSolicitada = state.url;
        const tienePermiso = menu.some((modulo) =>
          modulo.permisos.some((permiso) =>
            rutaSolicitada.startsWith(permiso.ruta)
          )
        );

        if (!tienePermiso) {
          this.router.navigate(['/']);
        }

        return tienePermiso;
      })
    );
  }
}
