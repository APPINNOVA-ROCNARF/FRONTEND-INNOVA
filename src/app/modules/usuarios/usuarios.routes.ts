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
      import('./pages/administrar-usuarios/administrar-usuarios.component').then(
        (c) => c.AdministrarUsuariosComponent
      ),
    title: 'Administrar Usuarios',
  },
  {
    path: 'roles-permisos',
    loadComponent: () =>
      import('./pages/roles-permisos/roles-permisos.component').then(
        (c) => c.RolesPermisosComponent
      ),
    title: 'Roles y Permisos',
  },
];
