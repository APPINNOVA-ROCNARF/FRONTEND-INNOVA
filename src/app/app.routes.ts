import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/desktop/main-layout/main-layout.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { RolGuard } from './core/auth/guards/rol.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.routes').then((m) => m.LOGIN_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/login' },
      {
        path: 'welcome',
        loadChildren: () =>
          import('./pages/welcome/welcome.routes').then(
            (m) => m.WELCOME_ROUTES
          ),
        canActivate: [AuthGuard, RolGuard],
      },
      {
        path: 'viaticos',
        loadChildren: () =>
          import('./modules/viaticos/viaticos.routes').then(
            (m) => m.VIATICOS_ROUTES
          ),
        canActivate: [AuthGuard, RolGuard],
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./modules/usuarios/usuarios.routes').then(
            (m) => m.USUARIOS_ROUTES
          ),
        canActivate: [AuthGuard, RolGuard],
      },
    ],
  },
];

