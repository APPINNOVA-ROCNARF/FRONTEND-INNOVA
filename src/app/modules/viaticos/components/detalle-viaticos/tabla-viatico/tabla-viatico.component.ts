import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CampoRechazado, Vehiculo, Viatico } from '../../../interfaces/viatico-api-response';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { animate, style, transition, trigger } from '@angular/animations';
import { EstadoViaticoPipe } from "../../../pipes/estado-viatico.pipe";
import { NzModalService } from 'ng-zorro-antd/modal';
import { VehiculoModalComponent } from '../modal-vehiculo/vehiculo-modal.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CategoriaColorPipe } from "../../../pipes/categoria-color.pipe";
import { CamposRechazadoModalComponent } from '../modal-campos-devueltos/campo-rechazado-modal.component';
import { ArchivoService } from '../../../../../core/services/archivo-service/archivo.service';
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
    NzDropDownModule,
    NzMenuModule,
    NzBadgeModule,
    NzInputModule,
    EstadoViaticoPipe,
    ReactiveFormsModule,
    CategoriaColorPipe
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
  @Output() devolver = new EventEmitter<number>();
  @Output() editar = new EventEmitter<{ id: number; nombreProveedor: string; numeroFactura: string }>();
  @Output() historial = new EventEmitter<number>();
  listOfCurrentPageData: Viatico[] = [];

  checked = false;
  indeterminate = false;

  setOfCheckedId = new Set<number>();
  mostrarBarraAcciones = false;

  setEditId: number | null = null;
  editForms = new Map<number, FormGroup>();


  camposDevueltos: CampoRechazado[] = [];
  viaticoSeleccionado: Viatico | null = null;
  modalCamposVisible = false;

isPreviewActive = false;


  constructor(
    private imageService: NzImageService,
    private archivoService: ArchivoService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) { }

  previewImagen(rutaRelativa: string): void {
    this.isPreviewActive = !this.isPreviewActive; 
    const urlCompleta = this.archivoService.getUrlAbsoluta(rutaRelativa);
    this.imageService.preview([{ src: urlCompleta, alt: 'Factura' }]);
  }

  verVehiculo(vehiculo: Vehiculo): void {
    this.modal.create({
      nzTitle: 'Información del Vehículo',
      nzContent: VehiculoModalComponent,
      nzData: vehiculo,
      nzFooter: null
    });
  }

    trackById(_: number, item: Viatico) {
    return item.id;
  }

  // Filtros
  categoriasFiltro = [
    { text: 'Movilización', value: 'Movilización' },
    { text: 'Alimentación', value: 'Alimentación' },
    { text: 'Hospedaje', value: 'Hospedaje' },
  ];

  estadosFiltro = [
    { text: 'Borrador', value: 'Borrador' },
    { text: 'En revisión', value: 'En revisión' },
    { text: 'Aprobado', value: 'Aprobado' },
    { text: 'Devuelto', value: 'Devuelto' },
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

  devolverViatico(viaticoId: number): void {
    this.devolver.emit(viaticoId);
  }

  historialViatico(viaticoId: number): void {
    this.historial.emit(viaticoId);
  }

  editarViatico(v: Viatico): void {
    this.setEditId = v.id;

    this.editForms.set(v.id, this.fb.group({
      nombreProveedor: [v.nombreProveedor],
      numeroFactura: [v.numeroFactura]
    }));
  }



  guardarEdicion(v: Viatico): void {
    const form = this.editForms.get(v.id);
    if (!form || !form.dirty) {
      this.cancelarEdicion();
      return;
    }

    const { nombreProveedor, numeroFactura } = form.value;

    this.editar.emit({
      id: v.id,
      nombreProveedor,
      numeroFactura
    });

    this.cancelarEdicion();
  }


  cancelarEdicion(): void {
    if (this.setEditId !== null) {
      this.editForms.delete(this.setEditId);
    }
    this.setEditId = null;
  }




  onCurrentPageDataChange(listOfCurrentPageData: Viatico[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) => {
      if (item.estadoViatico !== 'Aprobado' && item.estadoViatico !== 'Borrador') {
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
    const itemsValidos = this.listOfCurrentPageData.filter(item => item.estadoViatico !== 'Aprobado' && item.estadoViatico !== 'Borrador');

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

  // Ver campos devueltos

  verCamposRechazados(viatico: Viatico): void {
    this.modal.create({
      nzTitle: 'Campos devueltos',
      nzContent: CamposRechazadoModalComponent,
      nzData: viatico,
      nzBodyStyle: {
        padding: '10px'
      },
      nzFooter: null
    });
  }

}