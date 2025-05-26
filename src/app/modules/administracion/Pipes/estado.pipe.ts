// estado-activo.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado',
  standalone: true,
})
export class EstadoPipe implements PipeTransform {
  transform(value: boolean): string {
    if (value) {
      return `<nz-tag nzColor="green">Activo</nz-tag>`;
    } else {
      return `<nz-tag nzColor="red">Inactivo</nz-tag>`;
    }
  }
}
