import { Pipe, PipeTransform } from '@angular/core';
import { Accion } from '../interfaces/roles/rol-api-response';

@Pipe({
  name: 'permiso',
  standalone: true,
  pure: true,
})
export class PermisosPipe implements PipeTransform {
  transform(
    acciones: Accion[]
  ): 'Lectura' | 'Edición' | 'Control total' | 'Sin acceso' {
    const seleccionadas = acciones
      .filter((a) => a.seleccionado)
      .map((a) => a.nombreAccion.toLowerCase());

    const has = (n: string) => seleccionadas.includes(n);

    if (has('leer') && has('actualizar') && has('crear') && has('eliminar'))
      return 'Control total';
    if (has('leer') && has('actualizar')) return 'Edición';
    if (has('leer')) return 'Lectura';

    return 'Sin acceso';
  }
}
