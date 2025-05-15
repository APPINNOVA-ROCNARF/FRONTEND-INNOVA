import { Component, Input } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { EstadoViaticoComponent } from "../estado-viatico/estado-viaticos.component";
import { EstadisticaViatico } from '../../../interfaces/viatico-api-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadistica-viatico',
  standalone: true,
  imports: [
    NzGridModule,
    EstadoViaticoComponent,
    CommonModule
  ],
  templateUrl: './estadistica-viatico.component.html',
  styleUrl: './estadistica-viatico.component.less'
})
export class EstadisticaViaticoComponent {
  @Input() estadistica: EstadisticaViatico[] = [];

  readonly coloresPorCategoria: Record<string, string> = {
    'Movilización': '#ef8b83',
    'Alimentación': '#c082ed',
    'Hospedaje': '#87E8DE',
    'Total General': '#66b4f4',
  };

  readonly categoriasFijas = ['Movilización', 'Alimentación', 'Hospedaje'];


  get estadisticaCompleta() {
    const data = this.estadistica;

    if (!data) return [];

    const mapa = new Map(data.map(d => [d.categoria, d]));

    const listaFinal: EstadisticaViatico[] = [];

    for (const nombre of this.categoriasFijas) {
      listaFinal.push(
        mapa.get(nombre) ?? {
          categoria: nombre,
          total_aprobado: 0,
          total_registrado: 0,
          total_acreditado: 0,
          diferencia: 0,
          porcentaje_ejecucion: 0,
        }
      );
    }

    // Agregar Total General si existe
    const total = data.find(d => d.categoria === 'Total General');
    if (total) {
      listaFinal.push(total);
    }

    return listaFinal;
  }

}
