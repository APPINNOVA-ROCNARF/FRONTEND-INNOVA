import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.routes').then(m => m.LOGIN_ROUTES)
  },
  {
    path: '',
    component: MainLayoutComponent, 
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/login' },
      { 
        path: 'welcome',
        loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES)
      },
      { 
        path: 'viaticos',
        loadChildren: () => import('./modules/viaticos/viaticos.routes').then(m => m.VIATICOS_ROUTES)
      },
            {
        path: 'usuarios',
        loadChildren: () => import('./modules/usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES)
      }
    ]
  }
];

