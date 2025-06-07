import {
  Component,
  OnInit,
  Signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// NG Zorro
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TableColumn } from '../../../../../shared/components/tabla-base/Interfaces/TablaColumna.interface';
import { RolStateService } from '../../../services/roles/rol-state.service';
import { RolSimple } from '../../../interfaces/rol-api-response';
import { combineLatest, Observable } from 'rxjs';
import { UiService } from '../../../../../core/services/ui-service/ui.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'app-roles-permisos',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzTypographyModule,
    NzIconModule,
    NzTagModule,
    NzDividerModule,
    NzSkeletonModule
  ],
  templateUrl: './roles-permisos.component.html',
  styleUrl: './roles-permisos.component.less',
})
export class RolesPermisosComponent implements OnInit {
  @ViewChild('stateTemplate') stateTemplate!: TemplateRef<any>;

  // Variables Tabla
  columns: TableColumn[] = [];
  canEdit = true;
  canDelete = true;

  roles$!: Observable<RolSimple[]>;
  loading$!: Signal<boolean>;
  isMobile$: Observable<boolean>;

  private fieldLabels: Record<string, string> = {
    rolId: 'ID',
    nombreRol: 'Nombre',
    descripcion: 'Descripción',
    tipo: "Tipo",
    estado: 'Estado',
  };


  constructor(
    private rolState: RolStateService,
    private uiService: UiService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.isMobile$ = this.uiService.isMobile$;
  }

  ngOnInit(): void {
    this.roles$ = this.rolState.roles$;
    this.loading$ = this.rolState.getRolesLoading();

    this.rolState.fetchRoles(); 

    combineLatest([this.roles$, this.isMobile$]).subscribe(
      ([roles, isMobile]) => {
        if (roles.length > 0) {
          this.columns = this.generateColumnsFromData(roles[0], isMobile);
        }
      }
    );
  }

  generateColumnsFromData(sample: RolSimple, isMobile: boolean): TableColumn[] {
    const visibleFields = Object.keys(sample).filter((key) => {
      if (key === 'rolId') return false;
      if (isMobile) {
        // En móvil, solo mostrar campos clave
        return ['nombreRol', 'estado'].includes(key);
      }
      return true;
    });

    return visibleFields.map((key) => {
      const column: TableColumn = {
        title: this.fieldLabels[key] || key,
        dataIndex: key,
      };

      if (key === 'estado') {
        column.renderFn = this.stateTemplate;
      }

      return column;
    });
  }

  handleEdit(rolId: number) {
    console.log('Editar rol:', rolId);
    // Lógica para editar el rol
  }

  handleDelete(rolId: number) {
    console.log('Eliminar rol:', rolId);
    // Lógica para eliminar el rol
  }
}
