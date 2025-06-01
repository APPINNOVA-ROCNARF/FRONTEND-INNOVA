import { Component, OnInit, Signal } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {NzDividerModule } from 'ng-zorro-antd/divider';
import { UsuarioStateService } from '../../../services/usuarios/usuario-state.service';
import { UsuarioDTO } from '../../../interfaces/usuario-api-response';
import { TablaUsuariosComponent } from "../../../components/usuarios/tabla-usuarios/tabla-usuarios.component";

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [NzCardModule, NzTagModule, NzTypographyModule, NzButtonModule, NzDividerModule, NzIconModule, TablaUsuariosComponent],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.less',
})
export class AdministrarUsuariosComponent implements OnInit{

  usuarios!: Signal<UsuarioDTO[]>
  usuariosLoading!: Signal<boolean>

  constructor(
    private usuarioState: UsuarioStateService
  ) {}

  ngOnInit(): void {
    this.usuarios = this.usuarioState.usuarios;
    this.usuarioState.fetchUsuarios();
    this.usuariosLoading = this.usuarioState.getUsuariosLoading();
  }
}
