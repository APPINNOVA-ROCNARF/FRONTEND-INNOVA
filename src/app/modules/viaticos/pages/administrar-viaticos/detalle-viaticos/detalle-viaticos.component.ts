import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerComponent, NzDividerModule } from 'ng-zorro-antd/divider';
import { DatosSolicitudComponent } from "../../../components/detalle-viaticos/datos-solicitud/datos-solicitud.component";
import { EstadisticaViaticoComponent } from "../../../components/detalle-viaticos/estadistica-viatico/estadistica-viatico.component";
import { TablaViaticoComponent } from "../../../components/detalle-viaticos/tabla-viatico/tabla-viatico.component";


@Component({
  selector: 'app-detalle-viaticos',
  standalone: true,
  imports: [NzPageHeaderModule,
    NzIconModule,
    NzCardModule,
    NzDescriptionsModule,
    NzTypographyModule,
    NzTagModule,
    NzBadgeModule,
    NzTableModule,
    CommonModule,
    NzProgressModule,
    NzGridModule,
    NzToolTipModule,
    NzCollapseModule,
    NzDividerModule,
    DatosSolicitudComponent, EstadisticaViaticoComponent, TablaViaticoComponent],
  templateUrl: './detalle-viaticos.component.html',
  styleUrl: './detalle-viaticos.component.less'
})
export class DetalleViaticosComponent {
  viaticoId!: number;


  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.viaticoId = +this.route.snapshot.paramMap.get('id')!;
    // Aquí puedes llamar a tu servicio para obtener el viático por ID
  }

}
