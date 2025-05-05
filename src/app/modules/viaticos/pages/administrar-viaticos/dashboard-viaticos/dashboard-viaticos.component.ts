import { Component, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { CicloSelectDTO } from '../../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { map, Observable } from 'rxjs';
import { CiclotateService } from '../../../../../shared/services/ciclos-service/ciclo-state.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { EstadisticaSolicitudViatico, SolicitudViatico } from '../../../interfaces/viatico-api-response';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../../../../core/services/ui-service/ui.service';
import { SolicitudViaticoStateService } from '../../../services/solicitudViatico/solicitudViatico-state.service';
import { TablaSolicitudViaticoComponent } from "../../../components/dashboard-viaticos/tabla-solicitud-viatico/tabla-solicitud-viatico.component";
import { EstadisticaSolicitudViaticoComponent } from "../../../components/dashboard-viaticos/estadistica-solicitud-viatico/estadistica-solicitud-viatico.component";
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-administrar-viaticos',
  standalone: true,
  imports: [
    FormsModule,
    NzSelectModule,
    CommonModule,
    NzFormModule,
    NzTypographyModule,
    NzDividerModule,
    NzSwitchModule,
    NzGridModule,
    NzToolTipModule,
    NzCardModule,
    NzIconModule,
    TablaSolicitudViaticoComponent,
    EstadisticaSolicitudViaticoComponent,
  ],
  templateUrl: './dashboard-viaticos.component.html',
  styleUrl: './dashboard-viaticos.component.less',
})
export class AdministrarViaticosComponent implements OnInit {
  canEdit = true;
  canDelete = true;

  solicitudViatico!: Signal<SolicitudViatico[]>;
  estadisticas!: Signal<EstadisticaSolicitudViatico | null>;
  loading$!: Signal<boolean>;
  isMobile$: Observable<boolean>;

  cicloSeleccionado: number | null = null;

  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Signal<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;

  constructor(
    private cicloState: CiclotateService,
    private solicitudState: SolicitudViaticoStateService,
    private uiService: UiService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.isMobile$ = this.uiService.isMobile$;
  }

  ngOnInit(): void {
    this.cargarCiclos();
  }

  cargarCiclos(): void {
    this.ciclos$ = this.cicloState.ciclos$;
    this.ciclosLoading$ = this.cicloState.getCiclosLoading();
    this.cicloState.fetchCiclos();

    this.cicloOpciones$ = this.ciclos$.pipe(
      map((ciclos) => {
        const cicloActivo = ciclos.find((c) => c.estado);
        if (cicloActivo) {
          this.cicloSeleccionado = cicloActivo.id;
          this.onCicloChange();
        }

        return ciclos.map((c) => ({
          label: c.nombre,
          value: c.id,
        }));
      })
    );
  }

  onCicloChange(): void {
    if (!this.cicloSeleccionado) return;

    this.solicitudViatico = this.solicitudState.solicitudViatico$(
      this.cicloSeleccionado
    );
    this.loading$ = this.solicitudState.getSolicitudViaticosLoading(
      this.cicloSeleccionado
    );
    this.estadisticas = this.solicitudState.estadisticaSolicitudViatico$(
      this.cicloSeleccionado
    );

    this.solicitudState.fetchSolicitudViaticos(this.cicloSeleccionado);
    this.solicitudState.fetchEstadisticaSolicitudViatico(
      this.cicloSeleccionado
    );
  }
}

