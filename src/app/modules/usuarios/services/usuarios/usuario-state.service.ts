import { Injectable, computed, signal } from '@angular/core';
import { tap, finalize } from 'rxjs';
import { LoadingService } from '../../../../core/services/loading-service/loading.service';
import { UsuarioDTO } from '../../interfaces/usuario-api-response';
import { UsuarioService } from './usuario.service';

@Injectable({ providedIn: 'root' })
export class UsuarioStateService {
  private usuarioSignal = signal<UsuarioDTO[] | []>([]);
  private usuarioLoadingSignal = signal(false);

  constructor(
    private usuarioService: UsuarioService,
    private loadingService: LoadingService
  ) {}

  usuarios = computed(() => this.usuarioSignal());

  fetchUsuarios(forceRefresh = false): void {
    const loadingKey = 'fetchUsuarios';

    if (!forceRefresh && this.usuarioLoadingSignal()) {
      return;
    }

    this.loadingService.setLoading(loadingKey, true);

    this.usuarioService
      .getUsuarios()
      .pipe(
        tap((usuarios) => {
          this.usuarioSignal.set(usuarios);
          this.usuarioLoadingSignal.set(true);
        }),
        finalize(() => this.loadingService.setLoading(loadingKey, false))
      )
      .subscribe();
  }

  getUsuariosLoading() {
    return this.loadingService.getLoading('fetchUsuarios');
  }
}