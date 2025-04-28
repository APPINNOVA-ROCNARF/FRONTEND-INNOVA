import { Component, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatosSolicitudComponent } from '../../../components/detalle-viaticos/datos-solicitud/datos-solicitud.component';
import { EstadisticaViaticoComponent } from '../../../components/detalle-viaticos/estadistica-viatico/estadistica-viatico.component';
import { TablaViaticoComponent } from '../../../components/detalle-viaticos/tabla-viatico/tabla-viatico.component';
import { DetalleSolicitudViatico, Viatico } from '../../../interfaces/viatico-api-response';
import { ViaticoStateService } from '../../../services/viatico/viatico-state.service';
import { SolicitudViaticoStateService } from '../../../services/solicitudViatico/solicitudViatico-state.service';

@Component({
  selector: 'app-detalle-viaticos',
  standalone: true,
  imports: [
    CommonModule,
    DatosSolicitudComponent,
    EstadisticaViaticoComponent,
    TablaViaticoComponent,
  ],
  templateUrl: './detalle-viaticos.component.html',
  styleUrl: './detalle-viaticos.component.less',
})
export class DetalleViaticosComponent {
  solicitudId!: number;

  viatico!: Signal<Viatico[]>;
  loadingViatico!: Signal<Boolean>;

  detalleSolicitudViatico!: Signal<DetalleSolicitudViatico | null>;
  loadingDetalleSolicitudViatico!: Signal<Boolean>;

  constructor(private route: ActivatedRoute, private viaticoState: ViaticoStateService, private solicitudViaticoState: SolicitudViaticoStateService) {}

  ngOnInit(): void {
    this.solicitudId = +this.route.snapshot.paramMap.get('id')!;

    this.viatico = this.viaticoState.viaticos;
    this.loadingViatico = this.viaticoState.getViaticosLoading(this.solicitudId);
    this.viaticoState.fetchViaticos(this.solicitudId);

    this.detalleSolicitudViatico = this.solicitudViaticoState.detalleSolicitudViatico;
    this.loadingDetalleSolicitudViatico = this.solicitudViaticoState.getDetalleSolicitudViaticoLoading(this.solicitudId);
    this.solicitudViaticoState.fetchDetalleSolicitudViatico(this.solicitudId, true);
  }
}
