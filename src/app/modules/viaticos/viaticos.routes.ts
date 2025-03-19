import { Routes } from '@angular/router';
import { AdministrarViaticosComponent } from './pages/administrar-viaticos/administrar-viaticos.component';

export const VIATICOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/administrar-viaticos/administrar-viaticos.component').then(
        (c) => c.AdministrarViaticosComponent
      ),
    title: 'Administrar Viáticos',
  },
];
