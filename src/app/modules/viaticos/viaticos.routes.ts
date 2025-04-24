import { Routes } from '@angular/router';
import { AdministrarViaticosComponent } from './pages/administrar-viaticos/dashboard-viaticos/dashboard-viaticos.component';

export const VIATICOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import(
        './pages/administrar-viaticos/administrar-viaticos-main'
      ).then((c) => c.AdministrarViaticosMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/administrar-viaticos/dashboard-viaticos/dashboard-viaticos.component').then(
            (c) => c.AdministrarViaticosComponent
          ),
        title: 'Roles y Permisos',
      },
      {
        path: 'detalle/:id',
        loadComponent: () =>
          import(
            './pages/administrar-viaticos/detalle-viaticos/detalle-viaticos.component'
          ).then((c) => c.DetalleViaticosComponent),
        title: 'Detalle Viático',
      },
    ],
  },
];
