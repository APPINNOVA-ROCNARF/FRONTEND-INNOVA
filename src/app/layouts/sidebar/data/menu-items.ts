import { MenuItem } from '../interfaces/menu-item.interface';

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    children: [
      { title: 'Welcome', icon:'', route: '/welcome' },
    ]
  },
  {
    title: 'Viaticos',
    icon: 'form',
    children: [
      { title: 'Administrar viaticos',icon:'', route: '/viaticos' }
    ]
  },
  {
    title: 'Visitas',
    icon: 'form',
    children: [
      { title: 'Consulta Visitas Planificadas',icon:'', route: '' }
    ]
  }
];
