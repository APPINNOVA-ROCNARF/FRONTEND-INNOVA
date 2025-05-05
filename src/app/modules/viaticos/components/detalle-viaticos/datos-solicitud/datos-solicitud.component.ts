import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { DetalleSolicitudViatico } from '../../../interfaces/viatico-api-response';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EstadoViaticoPipe } from "../../../pipes/estado-viatico.pipe";

@Component({
  selector: 'app-datos-solicitud',
  standalone: true,
  imports: [
    NzCardModule,
    NzDescriptionsModule,
    NzPageHeaderModule,
    NzTypographyModule,
    NzTagModule,
    NzSkeletonModule,
    CommonModule,
    NzSpinModule,
    EstadoViaticoPipe
],
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.less',
})
export class DatosSolicitudComponent {
  @Input() datos: DetalleSolicitudViatico | null = null;
  @Input() loading = false;

  get usuarioNombre(): string {
    return this.datos?.usuarioNombre ?? '';
  }

  get fechaRegistro(): string {
    return this.datos?.fechaRegistro ?? '';
  }

  get fechaModificacion(): string {
    return this.datos?.fechaModificacion ?? '';
  }

  get estado(): string {
    return this.datos?.estado ?? '';
  }

  get cicloNombre(): string {
    return this.datos?.cicloNombre ?? '';
  }

}
