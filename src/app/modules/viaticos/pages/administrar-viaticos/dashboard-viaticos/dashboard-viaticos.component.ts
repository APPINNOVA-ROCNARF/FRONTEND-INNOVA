import { Component, computed, OnInit, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { CicloSelectDTO } from '../../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { map, Observable } from 'rxjs';
import { CiclotateService } from '../../../../../shared/services/ciclos-service/ciclo-state.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import {
  EstadisticaSolicitudViatico,
  SolicitudViatico,
} from '../../../interfaces/viatico-api-response';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../../../../core/services/ui-service/ui.service';
import { SolicitudViaticoStateService } from '../../../services/solicitudViatico/solicitudViatico-state.service';
import { TablaSolicitudViaticoComponent } from '../../../components/dashboard-viaticos/tabla-solicitud-viatico/tabla-solicitud-viatico.component';
import { EstadisticaSolicitudViaticoComponent } from '../../../components/dashboard-viaticos/estadistica-solicitud-viatico/estadistica-solicitud-viatico.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UsuarioAppSelect } from '../../../../../shared/services/asesores-service/Interfaces/asesores-api-response';
import { AsesoresStateService } from '../../../../../shared/services/asesores-service/asesores-state.service';

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
  // permisos
  canEdit = true;
  canDelete = true;

  // señal para el ciclo seleccionado
  cicloSeleccionado = signal<number | null>(null);

  // datos derivados
  solicitudViatico = computed<SolicitudViatico[]>(() => {
    const id = this.cicloSeleccionado();
    return id !== null
      ? this.solicitudState.solicitudViatico$(id)()
      : [];
  });

  loading$ = computed<boolean>(() => {
    const id = this.cicloSeleccionado();
    return id !== null
      ? this.solicitudState.getSolicitudViaticosLoading(id)()
      : false;
  });

  estadisticas = computed<EstadisticaSolicitudViatico | null>(() => {
    const id = this.cicloSeleccionado();
    return id !== null
      ? this.solicitudState.estadisticaSolicitudViatico$(id)()
      : null;
  });

  // filtros
  representantesSeleccionados = signal<string[]>([]);
  estadosSeleccionados = signal<string[]>([]);

  // computado de lista filtrada
  solicitudesFiltradas = computed<SolicitudViatico[]>(() => {
    const data = this.solicitudViatico();
    const reps = this.representantesSeleccionados();
    const estados = this.estadosSeleccionados();
    return data.filter((item) => {
      const okRep = reps.length === 0 || reps.includes(item.usuarioNombre);
      const okEst = estados.length === 0 || estados.includes(item.estado);
      return okRep && okEst;
    });
  });

  // otros streams y configuraciones
  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Signal<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;

  asesores$!: Observable<UsuarioAppSelect[]>;
  asesoresLoading$!: Signal<boolean>;

  sortFns: Record<
    string,
    (a: SolicitudViatico, b: SolicitudViatico) => number
  > = {};

  constructor(
    private cicloState: CiclotateService,
    private solicitudState: SolicitudViaticoStateService,
    private asesoresState: AsesoresStateService,
    private uiService: UiService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.ciclosLoading$ = this.cicloState.getCiclosLoading();
    this.asesoresLoading$ = this.asesoresState.getAsesoresLoading();
  }

  ngOnInit(): void {
    // fetch inicial
    this.asesores$ = this.asesoresState.asesores$;
    this.asesoresState.fetchAsesores();

    this.ciclos$ = this.cicloState.ciclos$;
    this.cicloState.fetchCiclos();

    // auto-selección de ciclo activo
    this.ciclos$.subscribe((ciclos) => {
      const activo = ciclos.find(c => c.estado);
      if (activo) {
        this.onCicloChange(activo.id);
      }
    });

    // opciones para select
    this.cicloOpciones$ = this.ciclos$.pipe(
      map(ciclos => ciclos.map(c => ({ label: c.nombre, value: c.id })))
    );

    // funciones de ordenamiento
    this.sortFns['usuarioNombre'] = (a, b) =>
      String(a.usuarioNombre ?? '').localeCompare(String(b.usuarioNombre ?? ''));

    this.sortFns['fechaRegistro'] = (a, b) =>
      new Date(a.fechaRegistro ?? '').getTime() - new Date(b.fechaRegistro ?? '').getTime();

    this.sortFns['fechaModificacion'] = (a, b) =>
      new Date(a.fechaModificacion ?? '').getTime() - new Date(b.fechaModificacion ?? '').getTime();

    this.sortFns['monto'] = (a, b) => (a.monto ?? 0) - (b.monto ?? 0);
  }

  onCicloChange(id: number): void {
    this.cicloSeleccionado.set(id);
    this.solicitudState.fetchSolicitudViaticos(id);
    this.solicitudState.fetchEstadisticaSolicitudViatico(id);
  }

  onRepresentantesSeleccionadosChange(nombres: string[]) {
    this.representantesSeleccionados.set(nombres);
  }

  onEstadosSeleccionadosChange(estados: string[]) {
    this.estadosSeleccionados.set(estados);
  }
}
