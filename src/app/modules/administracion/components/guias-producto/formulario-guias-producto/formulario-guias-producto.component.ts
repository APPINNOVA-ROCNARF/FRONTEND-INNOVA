import { Component, effect, OnInit, signal, Signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadModule,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { GuiaProductoService } from '../../../services/guias-producto/guias.service';
import {
  ArchivoGuia,
  ArchivoTemporalGuardadoDTO,
  GuiaProductoDetalle,
} from '../../../interfaces/guias-api-response';
import { map, Observable, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { FuerzaStateService } from '../../../../../shared/services/fuerzas-service/fuerza-state.service';
import { FuerzaSelectDTO } from '../../../../../shared/services/fuerzas-service/Interfaces/FuerzaSelectDTO';
import { NzResultModule } from 'ng-zorro-antd/result';
import { ActivatedRoute, Router } from '@angular/router';
import { GuiaProductoStateService } from '../../../services/guias-producto/guias-state.service';
import { NzImageModule, NzImageService } from 'ng-zorro-antd/image';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { ArchivoService } from '../../../../../core/services/archivo-service/archivo.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'app-formulario-guias-producto',
  standalone: true,
  imports: [
    NzGridModule,
    NzDividerModule,
    NzTypographyModule,
    ReactiveFormsModule,
    NzCardModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzUploadModule,
    NzButtonModule,
    NzTableModule,
    CommonModule,
    NzResultModule,
    NzImageModule,
    NzPageHeaderModule,
    NzToolTipModule,
    NzModalModule,
    PdfViewerModule,
    NzPopconfirmModule,
    NzSwitchModule,
  ],
  templateUrl: './formulario-guias-producto.component.html',
  styleUrl: './formulario-guias-producto.component.less',
})
export class FormularioGuiasProductoComponent implements OnInit {
  form!: FormGroup;
  archivosTemp: ArchivoTemporalGuardadoDTO[] = [];
  archivos: ArchivoGuia[] = [];

  fuerzaSeleccionada: number | null = null;

  fuerzas$!: Observable<FuerzaSelectDTO[]>;
  fuerzasLoading$!: Signal<boolean>;
  fuerzaOpciones$!: Observable<{ label: string; value: number }[]>;

  modoEdicion = false;
  guiaId: number | null = null;

  guiaDetalle!: Signal<GuiaProductoDetalle>;
  guiaDetalleLoading$!: Signal<boolean>;

  uploadList: NzUploadFile[] = [];

  guardadoEstado = signal(false);

  modalVisible = false;
  pdfUrl = '';

  constructor(
    private fb: FormBuilder,
    private guiaService: GuiaProductoService,
    private guiaState: GuiaProductoStateService,
    private fuerzaState: FuerzaStateService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private archivoService: ArchivoService,
    private imageService: NzImageService
  ) {}

  ngOnInit() {
    this.fuerzas$ = this.fuerzaState.fuerzas$;
    this.fuerzasLoading$ = this.fuerzaState.getFuerzasLoading();
    this.fuerzaState.fetchFuerzas();

    this.fuerzaOpciones$ = this.fuerzas$.pipe(
      map((fuerzas) =>
        fuerzas.map((f) => ({
          label: f.nombre,
          value: f.id,
        }))
      )
    );

    this.form = this.fb.group({
      marca: ['', Validators.required],
      nombre: ['', Validators.required],
      fuerzaId: [null, Validators.required],
      urlVideo: [''],
      activo: [true],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'nueva-guia') {
      this.modoEdicion = true;
      this.guiaId = +idParam;

      this.guiaState.fetchGuiaDetalle(this.guiaId, true);
      this.guiaDetalleLoading$ = this.guiaState.getGuiaDetalleLoading(
        this.guiaId
      );
    }
  }

  previewArchivo(rutaRelativa: string, extension: string, entidadId: number): void {
    const ext = extension.toLowerCase();

    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      this.archivoService.verGuia(rutaRelativa, entidadId).subscribe({
        next: (blob: Blob) => {
          const objectUrl = URL.createObjectURL(blob);

          this.imageService.preview([{ src: objectUrl, alt: 'Guia-Producto' }]);
        },
        error: (err) => {
          console.error('Error al obtener la imagen protegida:', err);
        },
      });
    } else if (ext === '.pdf') {
      this.archivoService.obtenerArchivoGuia(rutaRelativa, entidadId).subscribe((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.pdfUrl = objectUrl;
        this.modalVisible = true;
      });
    } else {
      this.message.warning('Formato no compatible para vista previa.');
    }
  }

  descargarArchivo(rutaRelativa: string, entidadId: number, nombreArchivo: string): void {
    this.archivoService.obtenerArchivoGuia(rutaRelativa, entidadId).subscribe((blob) => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = nombreArchivo; 
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  eliminarArchivoGuia(id: number): void {
    this.guiaService.eliminarArchivoGuia(id).subscribe({
      next: () => {
        this.message.success('Archivo eliminado correctamente');
        this.guiaState.fetchGuiaDetalle(this.guiaId!, true);
      },
      error: () => this.message.error('Error al eliminar el archivo'),
    });
  }

  get tituloPagina(): string {
    return this.modoEdicion && this.form?.get('nombre')?.value
      ? `Editar: ${this.form.get('nombre')?.value}`
      : 'Nueva Guía de Producto';
  }

  readonly guiaEffect = effect(() => {
    const guia = this.guiaState.guia();
    if (this.modoEdicion && guia && guia.id === this.guiaId) {
      this.form.patchValue({
        marca: guia.marca,
        nombre: guia.nombre,
        fuerzaId: guia.fuerzaId,
        urlVideo: guia.urlVideo,
        activo: guia.activo,
      });
      this.archivos = guia.archivos;
    }
  });

  guardar(): void {
    if (this.form.invalid) {
      this.message.error('Completa todos los campos obligatorios.');
      return;
    }

    const payload = {
      ...this.form.value,
      archivos: this.archivosTemp,
    };

    this.guardadoEstado.set(true);

    if (this.modoEdicion && this.guiaId) {
      payload.id = this.guiaId;
      this.guiaService.editarGuia(this.guiaId, payload).subscribe({
        next: () => {
          this.message.success('Guía actualizada correctamente');
          this.uploadList = [];
          this.archivosTemp = [];
          this.guiaState.fetchGuiaDetalle(this.guiaId!, true);
          this.guiaState.fetchGuias(true);
        },
        error: () => this.message.error('Error al actualizar la guía'),
        complete: () => this.guardadoEstado.set(false),
      });
    } else {
      this.guiaService.crearGuia(payload).subscribe({
        next: () => {
          this.message.success('Guía de producto creada correctamente');
          this.guiaState.fetchGuias(true);
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: () => this.message.error('Error al crear la guía'),
        complete: () => this.guardadoEstado.set(false),
      });
    }
  }

  customUploadReq = (item: NzUploadXHRArgs): Subscription => {
    const formData = new FormData();
    formData.append('File', item.file as unknown as File);

    return this.guiaService.uploadTempArchivo(formData).subscribe({
      next: (response: ArchivoTemporalGuardadoDTO) => {
        this.archivosTemp.push(response);
        item.onSuccess!(response, item.file!, response);
      },
      error: (error) => {
        console.error('Error al subir archivo:', error);
        item.onError!(error, item.file!);
      },
    });
  };

  handleRemove = (file: NzUploadFile): boolean => {
    if (file.response && file.response.nombreOriginal) {
      this.archivosTemp = this.archivosTemp.filter(
        (archivo) => archivo.nombreOriginal !== file.response.nombreOriginal
      );
    }
    return true;
  };

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;

    if (status === 'done') {
      this.message.success(`${file.name} subido correctamente.`);
    } else if (status === 'error') {
      this.message.error(`${file.name} falló al subir.`);
    }

    this.uploadList = fileList.filter((f) => f.status !== 'removed');
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    if (!allowedTypes.includes(file.type!)) {
      this.message.error('Tipo de archivo no permitido');
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size! > maxSize) {
      this.message.error('El archivo es demasiado grande (máximo 10MB)');
      return false;
    }

    return true;
  };
}
