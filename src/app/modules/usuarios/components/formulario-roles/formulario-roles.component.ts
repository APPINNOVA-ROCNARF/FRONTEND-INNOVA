import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';

// NG Zorro
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

// Interfaces
export interface Role {
  id: number;
  name: string;
  description: string;
  status: boolean;
  permissions: PermissionWithActions[];
}

export interface Module {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  moduleId: number;
  availableActions: string[];
}

export interface PermissionWithActions {
  id: number;
  actions: string[];
}

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzTypographyModule,
    NzIconModule,
    NzTableModule,
    NzTagModule,
    NzSelectModule,
    NzInputModule,
    NzSwitchModule,
    NzDividerModule,
    NzCollapseModule,
  ],
  templateUrl: './formulario-roles.component.html',
  styleUrls: ['./formulario-roles.component.less'],
})
export class RoleFormComponent implements OnInit {
  @Input() visible = false;
  @Input() role: Role | null = null;
  @Input() modules: Module[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Role>();

  roleForm!: FormGroup;
  filteredModules: Module[] = [];
  permissionSearchText = '';
  selectedModuleFilter = 0;
  showOnlyAssigned = false;
  expandedPanels: { [key: number]: boolean } = {};
  tempRole: Role | null = null;
  tempPermissions: PermissionWithActions[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.initTempRole();
    this.filterPermissions();
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      name: [this.role?.name || '', [Validators.required]],
      description: [this.role?.description || ''],
      status: [this.role?.status !== undefined ? this.role.status : true],
    });
  }

  initTempRole(): void {
    if (this.role) {
      this.tempPermissions = [...this.role.permissions];
    } else {
      this.tempPermissions = [];
    }

    // Inicializar todos los paneles como expandidos
    this.modules.forEach((module) => {
      this.expandedPanels[module.id] = true;
    });
  }

  filterPermissions(): void {
    // Filtrar por módulo
    if (this.selectedModuleFilter === 0) {
      this.filteredModules = [...this.modules];
    } else {
      this.filteredModules = this.modules.filter(
        (m) => m.id === this.selectedModuleFilter
      );
    }

    // Si hay filtro de texto, aplicarlo a cada módulo
    if (this.permissionSearchText) {
      this.filteredModules = this.filteredModules
        .map((module) => {
          return {
            ...module,
            permissions: module.permissions.filter((p) =>
              p.name
                .toLowerCase()
                .includes(this.permissionSearchText.toLowerCase())
            ),
          };
        })
        .filter((module) => module.permissions.length > 0);
    }
  }

  getFilteredPermissionsForModule(moduleId: number): Permission[] {
    const module = this.modules.find((m) => m.id === moduleId);
    if (!module) return [];

    let filteredPermissions = [...module.permissions];

    // Filtrar por texto de búsqueda
    if (this.permissionSearchText) {
      const searchText = this.permissionSearchText.toLowerCase();
      filteredPermissions = filteredPermissions.filter((p) =>
        p.name.toLowerCase().includes(searchText)
      );
    }

    // Filtrar solo asignados si está activo
    if (this.showOnlyAssigned) {
      filteredPermissions = filteredPermissions.filter((p) =>
        this.tempPermissions.some((tp) => tp.id === p.id)
      );
    }

    return filteredPermissions;
  }

  // Métodos para gestionar permisos y acciones
  hasPermissionAction(permissionId: number, action: string): boolean {
    const permissionWithActions = this.tempPermissions.find(
      (p) => p.id === permissionId
    );
    if (!permissionWithActions) return false;
    return permissionWithActions.actions.includes(action);
  }

  hasActionAvailable(permissionId: number, action: string): boolean {
    const permission = this.getAllPermissions().find(
      (p) => p.id === permissionId
    );
    if (!permission) return false;
    return permission.availableActions.includes(action);
  }

  togglePermissionAction(permissionId: number, action: string): void {
    // Verificar si esta acción está disponible
    if (!this.hasActionAvailable(permissionId, action)) return;

    let permissionWithActions = this.tempPermissions.find(
      (p) => p.id === permissionId
    );

    if (permissionWithActions) {
      // Ya existe este permiso, toggle de la acción
      if (permissionWithActions.actions.includes(action)) {
        // Quitar acción
        permissionWithActions.actions = permissionWithActions.actions.filter(
          (a) => a !== action
        );

        // Si no quedan acciones, quitar el permiso
        if (permissionWithActions.actions.length === 0) {
          this.tempPermissions = this.tempPermissions.filter(
            (p) => p.id !== permissionId
          );
        }
      } else {
        // Añadir acción
        permissionWithActions.actions.push(action);
      }
    } else {
      // No existe, añadir nuevo permiso con esta acción
      this.tempPermissions.push({
        id: permissionId,
        actions: [action],
      });
    }
  }

  hasAllPermissionActions(permissionId: number): boolean {
    const permission = this.getAllPermissions().find(
      (p) => p.id === permissionId
    );
    if (!permission) return false;

    const permissionWithActions = this.tempPermissions.find(
      (p) => p.id === permissionId
    );
    if (!permissionWithActions) return false;

    // Verificar si todas las acciones disponibles están asignadas
    return permission.availableActions.every((action) =>
      permissionWithActions.actions.includes(action)
    );
  }

  toggleAllPermissionActions(permissionId: number): void {
    const permission = this.getAllPermissions().find(
      (p) => p.id === permissionId
    );
    if (!permission) return;

    const hasAll = this.hasAllPermissionActions(permissionId);

    if (hasAll) {
      // Quitar todas las acciones (eliminar el permiso)
      this.tempPermissions = this.tempPermissions.filter(
        (p) => p.id !== permissionId
      );
    } else {
      // Asignar todas las acciones disponibles
      const existingIndex = this.tempPermissions.findIndex(
        (p) => p.id === permissionId
      );

      if (existingIndex > -1) {
        // Actualizar el existente
        this.tempPermissions[existingIndex].actions = [
          ...permission.availableActions,
        ];
      } else {
        // Crear nuevo
        this.tempPermissions.push({
          id: permissionId,
          actions: [...permission.availableActions],
        });
      }
    }
  }

  getModulePermissionCount(moduleId: number): {
    assigned: number;
    total: number;
  } {
    const module = this.modules.find((m) => m.id === moduleId);
    if (!module) return { assigned: 0, total: 0 };

    // Total de posibles acciones en todos los permisos del módulo
    let totalActions = 0;
    module.permissions.forEach((permission) => {
      totalActions += permission.availableActions.length;
    });

    // Acciones asignadas
    let assignedActions = 0;
    this.tempPermissions.forEach((permission) => {
      const modulePermission = module.permissions.find(
        (p) => p.id === permission.id
      );
      if (modulePermission) {
        assignedActions += permission.actions.length;
      }
    });

    return { assigned: assignedActions, total: totalActions };
  }

  toggleAllModulePermissions(moduleId: number): void {
    const module = this.modules.find((m) => m.id === moduleId);
    if (!module) return;

    const counts = this.getModulePermissionCount(moduleId);
    const shouldAssignAll = counts.assigned < counts.total;

    if (shouldAssignAll) {
      // Asignar todas las acciones a todos los permisos
      module.permissions.forEach((permission) => {
        const existingIndex = this.tempPermissions.findIndex(
          (p) => p.id === permission.id
        );

        if (existingIndex > -1) {
          // Actualizar existente
          this.tempPermissions[existingIndex].actions = [
            ...permission.availableActions,
          ];
        } else {
          // Crear nuevo
          this.tempPermissions.push({
            id: permission.id,
            actions: [...permission.availableActions],
          });
        }
      });
    } else {
      // Quitar todos los permisos de este módulo
      this.tempPermissions = this.tempPermissions.filter(
        (permission) => !module.permissions.some((p) => p.id === permission.id)
      );
    }
  }

  toggleShowOnlyAssigned(): void {
    this.showOnlyAssigned = !this.showOnlyAssigned;
    this.filterPermissions();
  }

  expandAllPanels(): void {
    const allExpanded = Object.values(this.expandedPanels).every((v) => v);

    this.modules.forEach((module) => {
      this.expandedPanels[module.id] = !allExpanded;
    });
  }

  getModuleIcon(moduleName: string): string {
    const iconMap: { [key: string]: string } = {
      Usuarios: 'user',
      Viáticos: 'dollar',
      Productos: 'shopping',
      Ventas: 'shopping-cart',
      Configuración: 'setting',
      Reportes: 'bar-chart',
    };

    return iconMap[moduleName] || 'appstore';
  }

  // Utilidades
  getAllPermissions(): Permission[] {
    let allPermissions: Permission[] = [];
    this.modules.forEach((module) => {
      allPermissions = [...allPermissions, ...module.permissions];
    });
    return allPermissions;
  }

  // Manejo del formulario
  submitForm(): void {
    if (this.roleForm.invalid) return;

    const savedRole: Role = {
      id: this.role?.id || 0,
      name: this.roleForm.get('name')?.value,
      description: this.roleForm.get('description')?.value,
      status: this.roleForm.get('status')?.value,
      permissions: [...this.tempPermissions],
    };

    this.save.emit(savedRole);
    this.closeModal();
  }

  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.tempPermissions = [];
  }
}
