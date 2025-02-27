import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // 🔹 Envuelve toda la app con sidebar y header
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/welcome' },
      { 
        path: 'welcome',
        loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES)
      },
      { 
        path: 'viaticos',
        loadChildren: () => import('./modules/viaticos/viaticos.routes').then(m => m.VIATICOS_ROUTES)
      },
    ]
  }
];

