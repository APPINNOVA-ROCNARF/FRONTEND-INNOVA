import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/desktop/main-layout/main-layout.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { RolGuard } from './core/auth/guards/rol.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const protectedGuards = [AuthGuard, RolGuard];

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.routes').then((m) => m.LOGIN_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: protectedGuards,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/welcome' },
      {
        path: 'welcome',
        loadChildren: () =>
          import('./pages/welcome/welcome.routes').then(
            (m) => m.WELCOME_ROUTES
          ),
      },
      {
        path: 'viaticos',
        loadChildren: () =>
          import('./modules/viaticos/viaticos.routes').then(
            (m) => m.VIATICOS_ROUTES
          ),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./modules/usuarios/usuarios.routes').then(
            (m) => m.USUARIOS_ROUTES
          ),
      },
      {
        path: 'medicos',
        loadChildren: () =>
          import('./modules/medicos/medicos.routes').then(
            (m) => m.MEDICOS_ROUTES
          ),
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];