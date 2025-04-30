import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Viatico } from '../../../interfaces/viatico-api-response';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzImageModule } from 'ng-zorro-antd/image';
import { ImagenService } from '../../../../../core/services/image-service/image.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { animate, style, transition, trigger } from '@angular/animations';
import { EstadoViaticoPipe } from "../../../pipes/estado-viatico.pipe";
@Component({
  selector: 'app-tabla-viatico',
  standalone: true,
  imports: [
    FormsModule,
    NzTableModule,
    CommonModule,
    NzImageModule,
    NzTagModule,
    NzIconModule,
    NzButtonModule,
    NzToolTipModule,
    NzPopconfirmModule,
    NzDropDownModule,
    NzMenuModule,
    NzModalModule,
    NzBadgeModule,
    EstadoViaticoPipe
],
  templateUrl: './tabla-viatico.component.html',
  styleUrl: './tabla-viatico.component.less',
  animations: [
    trigger('slideUpFadeDown', [
      transition(':enter', [
        style({ transform: 'translate(-50%, 20px)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translate(-50%, 0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ transform: 'translate(-50%, 20px)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class TablaViaticoComponent {
  @Input() datos: Viatico[] = [];
  @Input() loadingDatos = false;
  @Output() aprobar = new EventEmitter<number>();
  @Output() aprobarMasivo = new EventEmitter<number[]>();
  @Output() rechazar = new EventEmitter<number>();
  listOfCurrentPageData: Viatico[] = [];

  checked = false;
  indeterminate = false;

  setOfCheckedId = new Set<number>();
  mostrarBarraAcciones = false;

  constructor(
    private imageService: NzImageService,
    private imagenService: ImagenService
  ) {}

  previewImagen(rutaRelativa: string): void {
    const urlCompleta = this.imagenService.getUrlAbsoluta(rutaRelativa);
    this.imageService.preview([{ src: urlCompleta, alt: 'Factura' }]);
  }

  // Filtros
  categoriasFiltro = [
    { text: 'Movilización', value: 'Movilización' },
    { text: 'Alimentación', value: 'Alimentación' },
    { text: 'Hospedaje', value: 'Hospedaje' },
  ];

  estadosFiltro = [
    { text: 'En revisión', value: 'En revisión' },
    { text: 'Aprobado', value: 'Aprobado' },
    { text: 'Rechazado', value: 'Rechazado' },
  ];

  // Funciones de filtro
  filtroCategoria = (filtros: string[], item: Viatico): boolean => {
    return filtros.length === 0 || filtros.includes(item.nombreCategoria);
  };

  filtroEstado = (filtros: string[], item: Viatico): boolean => {
    return filtros.length === 0 || filtros.includes(item.estadoViatico);
  };

  aprobarViatico(viaticoId: number): void {
    this.aprobar.emit(viaticoId);
  }

  rechazarViatico(viaticoId: number): void {
    this.rechazar.emit(viaticoId);
  }

  onCurrentPageDataChange(listOfCurrentPageData: Viatico[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) => {
      if (item.estadoViatico !== 'Aprobado') {
        this.updateCheckedSet(item.id, value);
      }
    });
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    const itemsValidos = this.listOfCurrentPageData.filter(item => item.estadoViatico !== 'Aprobado');
  
    this.checked = itemsValidos.length > 0 && itemsValidos.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = itemsValidos.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  
    this.mostrarBarraAcciones = this.setOfCheckedId.size > 0;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  aprobarSeleccionados(): void {
    const ids = Array.from(this.setOfCheckedId);
    if (ids.length === 0) return;
  
    this.aprobarMasivo.emit(ids);
  }

  limpiarSeleccion(): void {
    this.setOfCheckedId.clear();
    this.refreshCheckedStatus();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(): void {
    this.limpiarSeleccion();
  }
}