import { Routes } from '@angular/router';

export const VISITAS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'planificadas',
    pathMatch: 'full',
  },
  {
    path: 'planificadas',
    loadComponent: () =>
      import('./pages/visitas-planificadas/visitas-planificadas-main').then(
        (c) => c.VisitasPlanificadasMainComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/visitas-planificadas/dashboard/dashboard-visitas-planificadas.component'
          ).then((c) => c.DashboardVisitasPlanificadasComponent),
        title: 'Visitas Planificadas',
      },
    ],
  }
];
