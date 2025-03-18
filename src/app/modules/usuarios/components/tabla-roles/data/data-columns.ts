export interface TablaColumnas {
  title: string;
  field: string;
  width: string;
}

export const COLUMNAS_ROLES = [
  { title: 'Nombre', field: 'name', width: '30%' },
  { title: 'Descripción', field: 'description', width: '40%' },
  { title: 'Estado', field: 'state', width: '15%' },
  { title: 'Acciones', field: 'actions', width: '15%' },
];
