import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// NG Zorro
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TablaBaseComponent } from '../../../../shared/components/tabla-base/tabla-base.component';
import { TableColumn } from '../../../../shared/components/tabla-base/Interfaces/TablaColumna.interface';
import { RolService } from '../../services/rol.service';
import { RolSimple } from '../../interfaces/rol-api-response';
import { combineLatest, map, Observable } from 'rxjs';
import { UiService } from '../../../../core/services/ui-service/ui.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { RolFormComponent } from '../../components/formulario-roles/formulario-roles.component';
import { RolDetalle } from '../../interfaces/rol-api-response';
@Component({
  selector: 'app-roles-permisos',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzTypographyModule,
    NzIconModule,
    TablaBaseComponent,
    NzTagModule,
    RolFormComponent,
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
  loading$!: Observable<boolean>;
  isMobile$: Observable<boolean>;

  private fieldLabels: Record<string, string> = {
    rolId: 'ID',
    nombreRol: 'Nombre',
    descripcion: 'Descripción',
    estado: 'Estado',
  };

  // Variables Modal

  selectedRolId: number | null = null;
  isRolModalVisible = false;

  constructor(private rolService: RolService, private uiService: UiService) {
    this.isMobile$ = this.uiService.isMobile$;
  }

  ngOnInit(): void {
    combineLatest([this.rolService.fetchRoles(), this.isMobile$]).subscribe(
      ([roles, isMobile]) => {
        if (roles.length > 0) {
          this.columns = this.generateColumnsFromData(roles[0], isMobile);
        }
      }
    );

    this.roles$ = this.rolService.roles$.pipe(map((roles) => roles || []));
    this.loading$ = this.rolService
      .getRolesLoading()
      .pipe(map((loading) => loading ?? false));
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

  showRolModal() {
    this.selectedRolId = 1;
    this.isRolModalVisible = true;
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
