import { Routes } from '@angular/router';
import { UnsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const ADMINISTRACION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'parrilla-promocional',
    pathMatch: 'full',
  },
  {
    path: 'parrilla-promocional',
    loadComponent: () =>
      import('./pages/parrilla-promocional/parrilla-promocional-main').then(
        (c) => c.ParrillaPromocionalMainComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/parrilla-promocional/carga-parrilla-promocional/carga-parrilla-promocional.component'
          ).then((c) => c.CargaParrillaPromocionalComponent),
        canDeactivate: [UnsavedChangesGuard],
        title: 'Parrilla Promocional',
      },
    ],
  },
  {
    path: 'guia-productos',
    loadComponent: () =>
      import('./pages/guia-productos/guia-productos-main').then(
        (c) => c.GuiaProductosMainComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/guia-productos/gestion-guia-productos/gestion-guia-productos.component'
          ).then((c) => c.GestionGuiaProductosComponent),
        title: 'Guía de Productos',
      },
      {
        path: 'nueva-guia',
        loadComponent: () =>
          import(
            './components/guias-producto/formulario-guias-producto/formulario-guias-producto.component'
          ).then((c) => c.FormularioGuiasProductoComponent),
        title: 'Nueva Guía de Producto',
      },

      {
        path: ':id',
        loadComponent: () =>
          import(
            './components/guias-producto/formulario-guias-producto/formulario-guias-producto.component'
          ).then((c) => c.FormularioGuiasProductoComponent),
        title: 'Editar Guía de Producto',
      },
    ],
  },
  {
    path: 'tabla-bonificaciones',
    loadComponent: () =>
      import('./pages/tabla-bonificaciones/tabla-bonificaciones-main').then(
        (c) => c.TablaBonificacionesMainComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/tabla-bonificaciones/carga-tabla-bonificaciones/carga-tabla-bonificaciones.component'
          ).then((c) => c.CargaTablaBonificacionesComponent),
        title: 'Tabla de Bonificaciones',
      },
    ],
  },
  {
    path: 'informacion-fox',
    loadComponent: () =>
      import('./pages/informacion-fox/informacion-fox-main').then(
        (c) => c.InformacionFoxMainComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/informacion-fox/carga-informacion-fox/carga-informacion-fox.component'
          ).then((c) => c.CargaInformacionFoxComponent),
        title: 'Información FOX',
      },
    ],
  },
  {
    path: 'version',
    loadComponent: () =>
      import('./pages/version/version-main').then(
        (c) => c.VersionMainComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/version/version-app/version-app.component'
          ).then((c) => c.VersionAppComponent),
        title: 'Información FOX',
      },
    ],
  },
];
