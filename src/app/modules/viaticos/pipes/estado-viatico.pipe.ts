// estado-viatico.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoViatico'
})
export class EstadoViaticoPipe implements PipeTransform {
  private readonly estadoViaticoTags: Record<string, { texto: string; color: string }> = {
    Borrador: { texto: 'Borrador', color: 'default' },
    EnRevision: { texto: 'En revisión', color: 'blue' },
    Aprobado: { texto: 'Aprobado', color: 'green' },
    Rechazado: { texto: 'Rechazado', color: 'red' },
    Devuelto: { texto: 'Devuelto', color: 'orange'}
  };

  transform(estado: string): { texto: string; color: string } | null {
    return this.estadoViaticoTags[estado] ?? null;
  }
}
