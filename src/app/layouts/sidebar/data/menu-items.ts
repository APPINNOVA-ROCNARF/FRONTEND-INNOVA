import { MenuItem } from '../interfaces/menu-item.interface';

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    children: [{ title: 'Welcome', icon: '', route: '/welcome' }],
  },
  {
    title: 'Viáticos',
    icon: 'dollar',
    children: [{ title: 'Administrar viáticos', icon: '', route: '/viaticos' }],
  },
  {
    title: 'Usuarios',
    icon: 'user',
    children: [
      { title: 'Administrar usuarios', icon: 'edit', route: '' },
      { title: 'Roles y permisos', icon: 'edit', route: '/usuarios/roles-permisos' },
    ],
  },
];
