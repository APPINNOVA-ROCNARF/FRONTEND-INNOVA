import { Routes } from '@angular/router';

export const MEDICOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'cobertura',
    pathMatch: 'full',
  },
  {
    path: 'cobertura',
    loadComponent: () =>
      import(
        './pages/cobertura-medicos/cobertura-medicos-main'
      ).then((c) => c.CoberturaMedicosMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/cobertura-medicos/dashboard/dashboard-cobertura-medicos.component').then(
            (c) => c.DashboardCoberturaMedicosComponent
          ),
        title: 'Cobertura a Médicos',
      }
    ],
  },
];
