import { Routes } from '@angular/router';

export const CLIENTES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'cobertura',
    pathMatch: 'full',
  },
  {
    path: 'cobertura',
    loadComponent: () =>
      import(
        './pages/cobertura-clientes/cobertura-clientes-main'
      ).then((c) => c.CoberturaClientesMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/cobertura-clientes/dashboard/dashboard-cobertura-clientes.component').then(
            (c) => c.DashboardCoberturaClientesComponent
          ),
        title: 'Cobertura a Clientes',
      }
    ],
  },
];
