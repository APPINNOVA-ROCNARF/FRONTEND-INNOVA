import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TablaBaseComponent } from '../../../../shared/components/tabla-base/tabla-base.component';
import { SolicitudViatico } from '../../interfaces/viatico-api-response';
import { TableColumn } from '../../../../shared/components/tabla-base/Interfaces/TablaColumna.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tabla-viaticos',
  standalone: true,
  imports: [CommonModule, TablaBaseComponent, NzTagModule],
  templateUrl: './tabla-viaticos.component.html',
  styleUrl: './tabla-viaticos.component.less',
})
export class TablaViaticosComponent {
  @Input() data: SolicitudViatico[] = [];
  @Input() loading: boolean = false;

  @ViewChild('estadoTemplate', { static: true })
  estadoTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.columns = [
      {
        title: 'Asesor',
        dataIndex: 'usuarioNombre',
      },
      {
        title: 'Ciclo',
        dataIndex: 'cicloNombre',
      },
      {
        title: 'Fecha Registro',
        dataIndex: 'fechaRegistro',
        formatFn: (fecha: string) =>
          new Date(fecha).toLocaleDateString('es-EC', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
      },
      {
        title: 'Fecha Modificación',
        dataIndex: 'fechaModificacion',
        formatFn: (fecha: string) =>
          new Date(fecha).toLocaleDateString('es-EC', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
      },
      {
        title: 'Monto',
        dataIndex: 'monto',
        formatFn: (valor: number) =>
          `$${valor.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
      {
        title: 'Estado',
        dataIndex: 'estado',
        renderFn: this.estadoTemplate,
        nzFilters: [
          { text: 'En revisión', value: 'En revisión' },
          { text: 'Aprobado', value: 'Aprobado' },
          { text: 'Rechazado', value: 'Rechazado' },
          { text: 'Para corregir', value: 'Para corregir' },
        ],
        nzFilterFn: (selected: string[], item: any) => {
          console.log('Filtro:', selected, 'Item:', item.estado);
          return selected.includes(item.estado);
        },
      },
    ];
  }

  editarViatico(item: any): void {
    const id = item?.id || item?.Id; // adapta si tu campo ID se llama distinto
    if (id != null) {
      this.router.navigate(['detalle', id], { relativeTo: this.route });
    }
  }
}
