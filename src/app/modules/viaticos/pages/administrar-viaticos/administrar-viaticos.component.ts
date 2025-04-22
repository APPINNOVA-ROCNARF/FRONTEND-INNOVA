import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CicloSelectDTO } from '../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { combineLatest, map, Observable } from 'rxjs';
import { CiclotateService } from '../../../../shared/services/ciclos-service/ciclo-state.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TablaBaseComponent } from "../../../../shared/components/tabla-base/tabla-base.component";
import { TableColumn } from '../../../../shared/components/tabla-base/Interfaces/TablaColumna.interface';
import { SolicitudViatico } from '../../interfaces/viatico-api-response';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from '../../../../core/services/ui-service/ui.service';
import { SolicitudViaticoStateService } from '../../services/solicitudViatico/solicitudViatico-state.service';

@Component({
  selector: 'app-administrar-viaticos',
  standalone: true,
  imports: [
    FormsModule,
    NzSelectModule,
    CommonModule,
    NzCardModule,
    NzFormModule,
    NzRadioModule,
    NzButtonModule,
    NzTypographyModule,
    NzIconModule,
    NzTagModule,
    NzProgressModule,
    NzDividerModule,
    NzToolTipModule,
    TablaBaseComponent
],
  templateUrl: './administrar-viaticos.component.html',
  styleUrl: './administrar-viaticos.component.less',
})
export class AdministrarViaticosComponent implements OnInit {
  @ViewChild('stateTemplate') stateTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];
  canEdit = true;
  canDelete = true;

  solicitudViatico$!: Observable<SolicitudViatico[]>;
  loading$!: Observable<boolean>;
  isMobile$: Observable<boolean>;

  asesorSeleccionado: string | null = null;
  cicloSeleccionado: number | null = null;
  estadoSeleccionado: number | null = null;

  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Observable<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;

  totalViaticos = 0;
  totalRegistros = 0;

  private fieldLabels: Record<string, string> = {
    Id: 'ID',
    usuarioNombre: 'Asesor',
    cicloNombre: 'Ciclo',
    fechaRegistro: 'Fecha Registro',
    fechaModificacion: 'Fecha Modificación',
    monto: 'Monto',
    estado: 'Estado',
  };

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
      map((ciclos) =>
        ciclos.map((c) => ({
          label: c.nombre,
          value: c.id,
        }))
      )
    );
  }

  onCicloChange(): void {
    if (!this.cicloSeleccionado) return;

    this.solicitudViatico$ = this.solicitudState.solicitudViatico$(this.cicloSeleccionado);
    this.loading$ = this.solicitudState.getSolicitudViaticosLoading(this.cicloSeleccionado);

    this.solicitudState.fetchSolicitudViaticos(this.cicloSeleccionado);

    combineLatest([this.solicitudViatico$, this.isMobile$]).subscribe(([data, isMobile]) => {
      this.totalRegistros = data.length;
      this.totalViaticos = data.reduce((acc, curr) => acc + curr.Monto, 0);

      if (data.length > 0) {
        this.columns = this.generateColumnsFromData(data[0], isMobile);
      }
    });
  }

  generateColumnsFromData(sample: SolicitudViatico, isMobile: boolean): TableColumn[] {
    const visibleFields = Object.keys(sample).filter((key) => {
      if (key === 'id') return false;
      if (isMobile) return ['usuarioNombre', 'estado'].includes(key);
      return true;
    });

    return visibleFields.map((key) => {
      const column: TableColumn = {
        title: this.fieldLabels[key] || key,
        dataIndex: key,
      };

      if (key === 'Estado') {
        column.renderFn = this.stateTemplate;
      }

      return column;
    });
  }

  getTotalViaticosTexto(): string {
    return `${this.totalRegistros} registros — $${this.totalViaticos.toFixed(2)} total`;
  }

  handleEdit(id: number): void {
    console.log('Editar solicitud:', id);
  }

  handleDelete(id: number): void {
    console.log('Eliminar solicitud:', id);
  }
}

