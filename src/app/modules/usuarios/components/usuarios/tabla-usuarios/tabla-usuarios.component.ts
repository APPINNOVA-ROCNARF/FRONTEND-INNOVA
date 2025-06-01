import { Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UsuarioDTO } from '../../../interfaces/usuario-api-response';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [NzTableModule, NzIconModule, NzButtonModule, NzTagModule, CommonModule],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.less'
})
export class TablaUsuariosComponent {
  @Input() datos: UsuarioDTO[] = [];
  @Input() loading = false;
}
