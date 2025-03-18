import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// NG Zorro
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { Role, Permission, Module } from '../../interfaces/roles-permisos.interface';

@Component({
  selector: 'app-formulario-roles',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzSwitchModule,
    NzDividerModule,
    NzTabsModule,
    NzButtonModule,
    NzIconModule,
    NzCollapseModule,
    NzTagModule,
    NzTableModule,
    NzModalModule
  ],
  templateUrl: './formulario-roles.component.html',
  styleUrl: './formulario-roles.component.less'
})
export class FormularioRolesComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() role: Role | null = null;
  @Input() modules: Module[] = [];
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  roleForm!: FormGroup;
  tempRole: Role | null = null;
  
  // Propiedades para filtrado y control de permisos
  permissionSearchText: string = '';
  selectedModuleFilter: number = 0;
  expandedPanels: { [key: number]: boolean } = {};
  showOnlyAssigned: boolean = false;
  filteredModules: Module[] = [];
  permissionsByModule: { [key: number]: Permission[] } = {};
  
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.initializeMockData(); // Solo para demostración
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] && this.roleForm) {
      this.resetForm();
    }
    
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.resetForm();
    }
  }
  
  initForm(): void {
    this.roleForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null]
    });
  }
  
  resetForm(): void {
    if (this.role) {
      this.roleForm.patchValue({
        name: this.role.name,
        description: this.role.description
      });
      
      this.tempRole = { 
        ...this.role,
        permissions: [...this.role.permissions]
      };
    } else {
      this.roleForm.reset();
      this.tempRole = null;
    }
  }
  
  // Inicializar datos simulados
  initializeMockData(): void {
    // Datos de ejemplo para módulos
    this.modules = [
      {
        id: 1,
        name: 'Usuarios',
        permissions: [
          { id: 1, name: 'Ver Usuarios', moduleId: 1, action: 'Listar todos los usuarios del sistema' },
          { id: 2, name: 'Crear Usuario', moduleId: 1, action: 'Crear nuevos usuarios en el sistema' },
          { id: 3, name: 'Editar Usuario', moduleId: 1, action: 'Modificar datos de usuarios existentes' },
          { id: 4, name: 'Eliminar Usuario', moduleId: 1, action: 'Eliminar usuarios del sistema' }
        ]
      },
      {
        id: 2,
        name: 'Productos',
        permissions: [
          { id: 5, name: 'Ver Productos', moduleId: 2, action: 'Listar todos los productos' },
          { id: 6, name: 'Crear Producto', moduleId: 2, action: 'Añadir nuevos productos' },
          { id: 7, name: 'Editar Producto', moduleId: 2, action: 'Modificar productos existentes' },
          { id: 8, name: 'Eliminar Producto', moduleId: 2, action: 'Eliminar productos del sistema' }
        ]
      }
    ];
    
    // Inicializar permisos por módulo
    this.permissionsByModule = {};
    this.modules.forEach(module => {
      this.permissionsByModule[module.id] = module.permissions;
      this.expandedPanels[module.id] = false;
    });
    
    this.filteredModules = [...this.modules];
    
    // Rol de ejemplo para pruebas
    if (!this.role) {
      this.tempRole = {
        id: 0,
        name: '',
        description: '',
        state: false,
        permissions: []
      };
    }
  }
  
  // Gestión de la visibilidad modal
  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit();
  }
  
  // Enviar formulario
  submitForm(): void {
    if (this.roleForm.invalid) {
      // Marcar campos como tocados para mostrar errores
      Object.values(this.roleForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
      return;
    }
    
    const formData = this.roleForm.value;
    const permissions = this.tempRole ? this.tempRole.permissions : [];
    
    const roleData = {
      id: this.role ? this.role.id : 0,
      name: formData.name,
      description: formData.description,
      permissions: permissions
    };
    
    this.formSubmit.emit(roleData);
    this.closeModal();
  }
  
  // Obtener o crear un rol temporal para trabajar
  getOrCreateTempRole(): Role {
    if (!this.tempRole) {
      this.tempRole = {
        id: this.role ? this.role.id : 0,
        name: this.roleForm.get('name')?.value || 'Nuevo Rol',
        description: this.roleForm.get('description')?.value || '',
        state: this.roleForm.get('state')?.value || '',
        permissions: this.role ? [...this.role.permissions] : []
      };
    }
    return this.tempRole;
  }
  
  // Métodos para gestión de permisos
  hasPermission(role: Role, permissionId: number): boolean {
    return role.permissions.some(p => p.id === permissionId);
  }
  
  togglePermission(permissionId: number): void {
    const tempRole = this.getOrCreateTempRole();
    
    const hasPermission = this.hasPermission(tempRole, permissionId);
    const allPermissions = this.modules.flatMap(m => m.permissions);
    const permission = allPermissions.find(p => p.id === permissionId);
    
    if (!permission) return;
    
    if (hasPermission) {
      // Remover permiso
      tempRole.permissions = tempRole.permissions.filter(p => p.id !== permissionId);
    } else {
      // Agregar permiso
      tempRole.permissions = [...tempRole.permissions, permission];
    }
  }
  
  // Métodos para filtrado y control de UI
  filterPermissionsByModule(): void {
    if (this.selectedModuleFilter === 0) {
      this.filteredModules = [...this.modules];
    } else {
      this.filteredModules = this.modules.filter(m => m.id === this.selectedModuleFilter);
    }
  }
  
  getFilteredPermissions(moduleId: number): Permission[] {
    const modulePermissions = this.permissionsByModule[moduleId] || [];
    
    // Filtrar por texto de búsqueda
    let filtered = modulePermissions;
    if (this.permissionSearchText) {
      const searchText = this.permissionSearchText.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchText) || 
        p.action.toLowerCase().includes(searchText)
      );
    }
    
    // Filtrar por permisos asignados
    if (this.showOnlyAssigned) {
      const tempRole = this.getOrCreateTempRole();
      filtered = filtered.filter(p => this.hasPermission(tempRole, p.id));
    }
    
    return filtered;
  }
  
  toggleShowOnlyAssigned(): void {
    this.showOnlyAssigned = !this.showOnlyAssigned;
  }
  
  getAssignedPermissionsCount(module: Module): number {
    const tempRole = this.getOrCreateTempRole();
    
    return module.permissions.filter(p => 
      tempRole.permissions.some(rp => rp.id === p.id)
    ).length;
  }
  
  toggleAllPermissionsInModule(module: Module, isAssigned: boolean): void {
    const tempRole = this.getOrCreateTempRole();
    
    module.permissions.forEach(permission => {
      const hasPermission = this.hasPermission(tempRole, permission.id);
      
      if (isAssigned && !hasPermission) {
        // Agregar permiso
        tempRole.permissions = [...tempRole.permissions, permission];
      } else if (!isAssigned && hasPermission) {
        // Remover permiso
        tempRole.permissions = tempRole.permissions.filter(p => p.id !== permission.id);
      }
    });
  }

}
