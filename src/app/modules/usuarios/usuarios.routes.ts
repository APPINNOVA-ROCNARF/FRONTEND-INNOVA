import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'roles-permisos',
    pathMatch: 'full',
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
