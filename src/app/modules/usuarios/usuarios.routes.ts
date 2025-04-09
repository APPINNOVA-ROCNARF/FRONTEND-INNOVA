import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import(
        './pages/administrar-usuarios/list-usuarios/administrar-usuarios.component'
      ).then((c) => c.AdministrarUsuariosComponent),
    title: 'Administrar Usuarios',
  },
  {
    path: 'roles-permisos',
    loadComponent: () =>
      import(
        './pages/roles-permisos/roles-permiso-main'
      ).then((c) => c.RolesPermisosMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/roles-permisos/list-roles/roles-permisos.component').then(
            (c) => c.RolesPermisosComponent
          ),
        title: 'Roles y Permisos',
      },
      {
        path: 'nuevo-rol',
        loadComponent: () =>
          import(
            './components/formulario-roles/formulario-roles.component'
          ).then((c) => c.RolFormComponent),
        title: 'Nuevo Rol',
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import(
            './components/formulario-roles/formulario-roles.component'
          ).then((c) => c.RolFormComponent),
        title: 'Editar Rol',
      },
    ],
  },
];
