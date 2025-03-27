import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableColumn } from '../../../../shared/components/tabla-base/Interfaces/TablaColumna.interface';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [NzCardModule, NzTagModule, NzTypographyModule, NzButtonModule],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.less',
})
export class AdministrarUsuariosComponent {
  @ViewChild('stateTemplate') stateTemplate!: TemplateRef<any>;

  usuarios = [
    {
      id: 1,
      name: 'Leonardo',
      lastname: 'Bazurto',
      rol: 'Administrador',
      email: 'lbazurto@imprimium.ec',
      state: true,
    },
    {
      id: 2,
      name: 'Leonardo',
      lastname: 'Bazurto',
      rol: 'Administrador',
      email: 'lbazurto@imprimium.ec',
      state: true,
    },
    {
      id: 3,
      name: 'Leonardo',
      lastname: 'Bazurto',
      rol: 'Administrador',
      email: 'lbazurto@imprimium.ec',
      state: true,
    },
  ];

  columns: TableColumn[] = [];
  loading = false;
  canEdit = true;
  canDelete = true;

  constructor() {}

  ngOnInit() {
    // Configurar las columnas
    this.columns = [
      { title: 'Nombre', dataIndex: 'name' },
      { title: 'Apellido', dataIndex: 'lastname' },
      { title: 'Rol', dataIndex: 'rol' },
      { title: 'Email', dataIndex: 'email' },
      {
        title: 'Estado',
        dataIndex: 'state',
        renderFn: this.stateTemplate, // Referencia al template para renderizado personalizado
      },
    ];
  }

  ngAfterViewInit() {
    // Ahora sí podemos usar this.stateTemplate porque la vista ya ha sido inicializada
    // y el @ViewChild ya está disponible

    // Creamos una nueva copia del array de columnas para no modificar el original directamente
    this.columns = this.columns.map((col) => {
      if (col.dataIndex === 'state') {
        // Asignamos la plantilla al renderFn de la columna de estado
        return { ...col, renderFn: this.stateTemplate };
      }
      return col;
    });
  }

  handleEdit(role: any) {
    console.log('Editar rol:', role);
    // Lógica para editar el rol
  }

  handleDelete(id: number) {
    console.log('Eliminar rol:', id);
    // Lógica para eliminar el rol
  }
}
