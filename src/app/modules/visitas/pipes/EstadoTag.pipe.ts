import { Pipe, PipeTransform } from '@angular/core';

export interface EstadoTag {
  label: string;
  color: string;
}

@Pipe({ name: 'estadoTag' })
export class EstadoTagPipe implements PipeTransform {
  transform(value: string): EstadoTag {
    switch (value) {
      case 'EFECT':
        return { label: 'Efectivo', color: 'green' };
      case 'PLANI':
        return { label: 'Planificado', color: 'yellow' };
      case 'NOEFE':
        return { label: 'No efectivo', color: 'yellow' };
      case 'PEFECT':
        return { label: 'Primera efectiva', color: 'orange' };
      default:
        return { label: value || 'Desconocido', color: 'default' };
    }
  }
}