import { Component } from '@angular/core';

import { Role, Permission, Module } from '../../interfaces/roles-permisos.interface';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// NG Zorro
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TablaRolesComponent } from "../../components/tabla-roles/tabla-roles.component";
import { FormularioRolesComponent } from "../../components/formulario-roles/formulario-roles.component";

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
    TablaRolesComponent,
    FormularioRolesComponent
],
  templateUrl: './roles-permisos.component.html',
  styleUrl: './roles-permisos.component.less'
})
export class RolesPermisosComponent  {

  roles: Role[] = [];
  modules: Module[] = [];
  loading = false;
  isRoleModalVisible = false;
  isPermissionModalVisible = false;
  roleForm!: FormGroup;
  selectedRole: Role | null = null;
  permissionsByModule: { [key: number]: Permission[] } = {};

expandedPanels: { [key: number]: boolean } = {};
showOnlyAssigned: boolean = false;
filteredModules: Module[] = [];
tempRole: Role | null = null; 

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMockData();
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null]
    });
  }

  loadMockData(): void {
  
    // Datos de ejemplo para roles
    this.roles = [
      {
        id: 1,
        name: 'Administrador',
        description: 'Acceso completo al sistema',
        state: true,
        permissions: [
          {
            id: 1,
            name: 'Ver Usuarios',
            moduleId: 1,
            action: 'Listar todos los usuarios del sistema',
          },
          {
            id: 2,
            name: 'Crear Usuario',
            moduleId: 1,
            action: 'Crear nuevos usuarios en el sistema',
          },
          {
            id: 3,
            name: 'Editar Usuario',
            moduleId: 1,
            action: 'Modificar datos de usuarios existentes',
          },
          {
            id: 4,
            name: 'Eliminar Usuario',
            moduleId: 1,
            action: 'Eliminar usuarios del sistema',
          },
          {
            id: 5,
            name: 'Ver Productos',
            moduleId: 2,
            action: 'Listar todos los productos',
          },
          {
            id: 9,
            name: 'Ver Ventas',
            moduleId: 3,
            action: 'Acceder al historial de ventas',
          },
        ],
      },
      {
        id: 2,
        name: 'Vendedor',
        description: 'Gestión de ventas y consulta de productos',
        state: true,
        permissions: [
          {
            id: 5,
            name: 'Ver Productos',
            moduleId: 2,
            action: 'Listar todos los productos',
          },
          {
            id: 9,
            name: 'Ver Ventas',
            moduleId: 3,
            action: 'Acceder al historial de ventas',
          },
          {
            id: 10,
            name: 'Crear Venta',
            moduleId: 3,
            action: 'Registrar nuevas ventas',
          },
        ],
      },
      {
        id: 3,
        name: 'Inventario',
        description: 'Gestión de productos y stock',
        state: false,
        permissions: [
          {
            id: 5,
            name: 'Ver Productos',
            moduleId: 2,
            action: 'Listar todos los productos',
          },
          {
            id: 6,
            name: 'Crear Producto',
            moduleId: 2,
            action: 'Añadir nuevos productos',
          },
          {
            id: 7,
            name: 'Editar Producto',
            moduleId: 2,
            action: 'Modificar productos existentes',
          },
        ],
      },
    ];

    // Organizar permisos por módulo
    this.modules.forEach(module => {
      this.permissionsByModule[module.id] = module.permissions;
    });
  }

  initializePermissionsInterface(): void {
    // Inicializar todos los paneles como expandidos
    this.modules.forEach(module => {
      this.expandedPanels[module.id] = true;
    });
    
    // Inicializar módulos filtrados
    this.filteredModules = [...this.modules];
  }
  
  openEditRoleModal(role: Role): void {
    this.selectedRole = role;
    this.isRoleModalVisible = true;
  }

  // Sobreescribir el método showRoleModal
  showRoleModal(): void {
    this.roleForm.reset();
    this.selectedRole = null;
    this.tempRole = null;
    this.isRoleModalVisible = true;
    this.initializePermissionsInterface();
  }
  
  deleteRole(id: number): void {
    this.modalService.confirm({
      nzTitle: '¿Está seguro de eliminar este rol?',
      nzContent: 'Esta acción no se puede deshacer',
      nzOkText: 'Sí',
      nzOkDanger: true,
      nzOnOk: () => {
        this.roles = this.roles.filter(r => r.id !== id);
        this.message.success('Rol eliminado exitosamente');
      },
      nzCancelText: 'No'
    });
  }
  
    // Método para manejar la presentación del formulario
onFormSubmit(formData: any): void {
  console.log('Datos del formulario recibidos:', formData);
  
  // Aquí normalmente llamarías a tu servicio para guardar los datos
  // Por ahora solo mostraremos los datos en consola y cerraremos el modal
  if (formData.id) {
    // Es una actualización
    console.log(`Actualizando rol ${formData.id}: ${formData.name}`);
    console.log(`Permisos asignados: ${formData.permissions.length}`);
  } else {
    // Es una creación
    console.log(`Creando nuevo rol: ${formData.name}`);
    console.log(`Permisos asignados: ${formData.permissions.length}`);
  }
  
  // Opcional: Mostrar mensaje de éxito
  // Si tienes NzMessageService importado:
  // this.message.success(`Rol ${formData.id ? 'actualizado' : 'creado'} exitosamente`);
  
  this.isRoleModalVisible = false;
}

// Método para manejar la cancelación del formulario
onFormCancel(): void {
  console.log('Formulario cancelado');
  this.isRoleModalVisible = false;
}
}