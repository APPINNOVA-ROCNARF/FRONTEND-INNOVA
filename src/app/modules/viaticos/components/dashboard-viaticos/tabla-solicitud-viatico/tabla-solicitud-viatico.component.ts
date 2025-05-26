import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TablaBaseComponent } from '../../../../../shared/components/tabla-base/tabla-base.component';
import { SolicitudViatico } from '../../../interfaces/viatico-api-response';
import { TableColumn } from '../../../../../shared/components/tabla-base/Interfaces/TablaColumna.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { EstadoViaticoPipe } from "../../../pipes/estado-viatico.pipe";

@Component({
  selector: 'app-tabla-solicitud-viaticos',
  standalone: true,
  imports: [
    CommonModule,
    TablaBaseComponent,
    NzTagModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzCardModule,
    EstadoViaticoPipe
],
  templateUrl: './tabla-solicitud-viatico.component.html',
  styleUrl: './tabla-solicitud-viatico.component.less',
})
export class TablaSolicitudViaticoComponent implements OnInit, OnChanges{
  @Input() data: SolicitudViatico[] = [];
  @Input() loading = false;

  @ViewChild('estadoTemplate', { static: true })
  estadoTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  datosFiltrados: SolicitudViatico[] = [];

  filtro = '';

  private filtroSubject = new Subject<string>();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.filtroSubject
      .pipe(
        debounceTime(300) 
      )
      .subscribe((value) => {
        this.realizarFiltro(value);
      });
  }

  ngOnInit(): void {
    this.columns = [
      {
        title: 'Asesor',
        dataIndex: 'usuarioNombre',
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
          `${valor.toLocaleString('es-EC', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} US$`,
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
          return selected.includes(item.estado);
        },
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.datosFiltrados = [...this.data]; 
    }
  }

  editarViatico(item: any): void {
    const id = item?.id || item?.Id;
    if (id != null) {
      this.router.navigate(['detalle', id], { relativeTo: this.route });
    }
  }

  aplicarFiltro(): void {
    this.filtroSubject.next(this.filtro);
  }

  realizarFiltro(valor: string): void {
    const filtroLower = valor.toLowerCase().trim();
    if (filtroLower.length === 0) {
      this.datosFiltrados = [...this.data];
      return;
    }
    this.datosFiltrados = this.data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filtroLower)
      )
    );
  }
}
