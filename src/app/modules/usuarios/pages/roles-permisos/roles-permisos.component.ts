import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// NG Zorro
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TablaBaseComponent } from '../../../../shared/components/tabla-base/tabla-base.component';
import { TableColumn } from '../../../../shared/components/tabla-base/Interfaces/TablaColumna.interface';
import { RolService } from '../../services/rol.service';
import { RolSimple } from '../../interfaces/rol-api-response';
import { combineLatest, map, Observable } from 'rxjs';
import { UiService } from '../../../../core/services/ui-service/ui.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Module, Role, RoleFormComponent } from '../../components/formulario-roles/formulario-roles.component';

@Component({
  selector: 'app-roles-permisos',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzTypographyModule,
    NzIconModule,
    TablaBaseComponent,
    NzTagModule,
    RoleFormComponent,
  ],
  templateUrl: './roles-permisos.component.html',
  styleUrl: './roles-permisos.component.less',
})
export class RolesPermisosComponent implements OnInit {
  @ViewChild('stateTemplate') stateTemplate!: TemplateRef<any>;

  MOCK_MODULES: Module[] = [
    {
      id: 1,
      name: 'Usuarios',
      permissions: [
        {
          id: 101,
          name: 'Administrar Usuarios',
          moduleId: 1,
          availableActions: ['create', 'read', 'update', 'delete'],
        },
        {
          id: 102,
          name: 'Roles y Permisos',
          moduleId: 1,
          availableActions: ['create', 'read', 'update', 'delete'],
        },
        {
          id: 103,
          name: 'Perfiles de Usuario',
          moduleId: 1,
          availableActions: ['read', 'update'],
        },
      ],
    },
    {
      id: 2,
      name: 'Viáticos',
      permissions: [
        {
          id: 201,
          name: 'Solicitudes de Viáticos',
          moduleId: 2,
          availableActions: ['create', 'read', 'update', 'delete'],
        },
        {
          id: 202,
          name: 'Aprobación de Viáticos',
          moduleId: 2,
          availableActions: ['read', 'update'],
        },
        {
          id: 203,
          name: 'Reportes de Viáticos',
          moduleId: 2,
          availableActions: ['read', 'create'],
        },
      ],
    },
    {
      id: 3,
      name: 'Configuración',
      permissions: [
        {
          id: 301,
          name: 'Parámetros del Sistema',
          moduleId: 3,
          availableActions: ['read', 'update'],
        },
        {
          id: 302,
          name: 'Configuración de Correo',
          moduleId: 3,
          availableActions: ['read', 'update'],
        },
      ],
    },
    {
      id: 4,
      name: 'Reportes',
      permissions: [
        {
          id: 401,
          name: 'Reportes de Usuarios',
          moduleId: 4,
          availableActions: ['read'],
        },
        {
          id: 402,
          name: 'Reportes Financieros',
          moduleId: 4,
          availableActions: ['read'],
        },
        {
          id: 403,
          name: 'Exportar Datos',
          moduleId: 4,
          availableActions: ['read', 'create'],
        },
      ],
    },
  ];

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

  constructor(
    private rolService: RolService,
    private uiService: UiService,
    private modalService: NzModalService
  ) {
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

          this.modules = [...this.MOCK_MODULES];

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

  handleEdit(role: any) {
    console.log('Editar rol:', role);
    // Lógica para editar el rol
  }

  handleDelete(id: number) {
    console.log('Eliminar rol:', id);
    // Lógica para eliminar el rol
  }

  isRoleModalVisible = false;
  selectedRole: Role | null = null;
  modules: Module[] = [
    // Define tus módulos y permisos aquí
  ];

  showRoleModal() {
    this.selectedRole = null; // Para crear un nuevo rol
    this.isRoleModalVisible = true;
  }

  editRole(role: Role) {
    this.selectedRole = role; // Para editar un rol existente
    this.isRoleModalVisible = true;
  }

  onRoleSaved(savedRole: Role) {
    console.log('Rol guardado:', savedRole);
    // Aquí manejarías la lógica para guardar el rol
  }
}
