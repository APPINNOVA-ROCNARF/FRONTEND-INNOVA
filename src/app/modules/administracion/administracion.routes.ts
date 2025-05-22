import { Routes } from '@angular/router';

export const ADMINISTRACION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'parrilla-promocional',
    pathMatch: 'full',
  },
  {
    path: 'parrilla-promocional',
    loadComponent: () =>
      import(
        './pages/parrilla-promocional/parrilla-promocional-main'
      ).then((c) => c.ParrillaPromocionalMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/parrilla-promocional/carga-parrilla-promocional/carga-parrilla-promocional.component').then(
            (c) => c.CargaParrillaPromocionalComponent
          ),
        title: 'Parrilla Promocional',
      }
    ],
  },
    {
    path: 'guia-productos',
    loadComponent: () =>
      import(
        './pages/guia-productos/guia-productos-main'
      ).then((c) => c.GuiaProductosMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/guia-productos/gestion-guia-productos/gestion-guia-productos.component').then(
            (c) => c.GestionGuiaProductosComponent
          ),
        title: 'Guía de Productos',
      },
      {
      path: 'nueva-guia',
      loadComponent: () =>
        import('./components/guias-producto/formulario-guias-producto/formulario-guias-producto.component').then(
          (c) => c.FormularioGuiasProductoComponent
        ),
      title: 'Nueva Guía de Producto',
    },

    {
      path: ':id',
      loadComponent: () =>
        import('./components/guias-producto/formulario-guias-producto/formulario-guias-producto.component').then(
          (c) => c.FormularioGuiasProductoComponent
        ),
      title: 'Editar Guía de Producto',
    }
    ],
  },
];
