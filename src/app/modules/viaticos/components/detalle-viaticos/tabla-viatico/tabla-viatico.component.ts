import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Viatico } from '../../../interfaces/viatico-api-response';
import { ViaticoStateService } from '../../../services/viatico/viatico-state.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzImageModule } from 'ng-zorro-antd/image';
import { environment } from '../../../../../../environments/environment';
import { ImagenService } from '../../../../../core/services/image-service/image.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzListModule} from 'ng-zorro-antd/list';
@Component({
  selector: 'app-tabla-viatico',
  standalone: true,
  imports: [FormsModule, NzTableModule, CommonModule, NzCardModule, NzImageModule, NzTagModule, NzIconModule, NzButtonModule, NzToolTipModule, NzPopconfirmModule, NzDropDownModule, NzMenuModule, NzModalModule, NzSelectModule, NzListModule],
  templateUrl: './tabla-viatico.component.html',
  styleUrl: './tabla-viatico.component.less',
})
export class TablaViaticoComponent implements OnInit {
  @Input() solicitudId!: number;
  viaticos: Viatico[] = [];
  readonly rootUrl = environment.rootUrl;

  checked = false;
  loading = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();


  modalRechazoVisible = false;
  campoRechazado: string | null = null;
  comentarioTemporal: string = '';
  
  rechazosTemp: { campo: string; comentario: string }[] = [];
  
  camposViatico = [
    'Proveedor',
    'Monto',
    'Número de Factura',
    'Comentario',
    'Categoría'
  ];

  constructor(private viaticoStateService: ViaticoStateService,
    private imageService: NzImageService,
    private imagenService: ImagenService) { }

  ngOnInit(): void {
    this.viaticoStateService.viaticos$.subscribe((data) => {
      this.viaticos = data;
    });

    this.viaticoStateService.fetchViaticos(true, this.solicitudId);
  }

  previewImagen(rutaRelativa: string): void {
    const urlCompleta = this.imagenService.getUrlAbsoluta(rutaRelativa);
    this.imageService.preview([{ src: urlCompleta, alt: 'Factura' }]);
  }

  estadoViaticoTags: Record<string, { texto: string; color: string }> = {
    Borrador: { texto: 'Borrador', color: 'default' },
    'En revisión': { texto: 'En revisión', color: 'blue' },
    Aprobado: { texto: 'Aprobado', color: 'green' },
    Rechazado: { texto: 'Rechazado', color: 'red' }
  };

  // Filtros
  categoriasFiltro = [
    { text: 'Movilización', value: 'Movilización' },
    { text: 'Alimentación', value: 'Alimentación' },
    { text: 'Hospedaje', value: 'Hospedaje' }
  ];

  estadosFiltro = [
    { text: 'En revisión', value: 'En revisión' },
    { text: 'Aprobado', value: 'Aprobado' },
    { text: 'Rechazado', value: 'Rechazado' }
  ];

  // Funciones de filtro
  filtroCategoria = (filtros: string[], item: any): boolean => {
    return filtros.length === 0 || filtros.includes(item.nombreCategoria);
  };
  
  
  filtroEstado = (filtros: string[], item: any): boolean => {
    return filtros.length === 0 || filtros.includes(item.estadoViatico);
  };
  
  aprobarViatico(viaticoId: number): void {
    // lógica para aprobar viático
    console.log('Aprobar viático:', viaticoId);
  }

  rechazarViatico(viaticoId: number): void {
    // lógica para aprobar viático
    console.log('Rechazar viático:', viaticoId);
  }

abrirModalRechazo(v: any): void {
  this.modalRechazoVisible = true;
  this.rechazosTemp = [];
  this.campoRechazado = null;
  this.comentarioTemporal = '';
}

cerrarModalRechazo(): void {
  this.modalRechazoVisible = false;
}

// Agregar un campo rechazado temporalmente
agregarCampoRechazado(): void {
  if (!this.campoRechazado || !this.comentarioTemporal.trim()) {
    return;
  }
  this.rechazosTemp.push({
    campo: this.campoRechazado,
    comentario: this.comentarioTemporal.trim()
  });

  // Limpiar el select y el textarea para seguir añadiendo otros
  this.campoRechazado = null;
  this.comentarioTemporal = '';
}

// Confirmar envío de todos los rechazos
confirmarRechazo(): void {
  console.log('Campos rechazados:', this.rechazosTemp);
  this.modalRechazoVisible = false;
}
  

eliminarCampoRechazado(index: number): void {
  this.rechazosTemp.splice(index, 1);
}
}