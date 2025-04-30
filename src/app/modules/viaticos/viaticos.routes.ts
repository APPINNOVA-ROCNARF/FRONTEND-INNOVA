import { Routes } from '@angular/router';

export const VIATICOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
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
        title: 'Gestión de Viáticos',
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
  {
    path: 'presupuesto',
    loadComponent: () =>
      import(
        './pages/presupuesto-viaticos/presupuesto-viaticos-main'
      ).then((c) => c.PresupuestoViaticosMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/presupuesto-viaticos/presupuesto-viaticos.component').then(
            (c) => c.PresupuestoViaticosComponent
          ),
        title: 'Presupuesto Viáticos',
      }
    ],
  },
];
