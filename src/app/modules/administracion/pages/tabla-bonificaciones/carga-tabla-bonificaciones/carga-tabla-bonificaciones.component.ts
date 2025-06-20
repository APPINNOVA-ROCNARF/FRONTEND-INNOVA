import { Component, signal, OnInit, effect } from '@angular/core';
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
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadModule,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {
  ArchivoTemporalGuardadoDTO,
  CrearTablaBonificacionesDTO,
  TablaBonificacionesDTO,
} from '../../../interfaces/tabla-bonificaciones-api.response';
import { TablaBonificacionesStateService } from '../../../services/tabla-bonificaciones/tabla-bonificaciones-state.service';
import { TablaBonificacionesService } from '../../../services/tabla-bonificaciones/tabla-bonificaciones.service';
import { ArchivoService } from '../../../../../core/services/archivo-service/archivo.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-carga-tabla-bonificaciones',
  standalone: true,
  imports: [
    NzFormModule,
    NzUploadModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzTypographyModule,
    NzDividerModule,
    NzInputModule,
    NzCardModule,
    CommonModule,
    NzModalModule,
    PdfViewerModule,
    NzToolTipModule,
    NzPopconfirmModule,
  ],
  templateUrl: './carga-tabla-bonificaciones.component.html',
  styleUrl: './carga-tabla-bonificaciones.component.less',
})
export class CargaTablaBonificacionesComponent implements OnInit {
  form!: FormGroup;

  archivoTemp: ArchivoTemporalGuardadoDTO | null = null;
  uploadList: NzUploadFile[] = [];

  tablaBonificacion: TablaBonificacionesDTO | null = null;

  modalVisible = false;
  pdfUrl = '';

  guardadoEstado = signal(false);

  constructor(
    private fb: FormBuilder,
    private bonificacionesState: TablaBonificacionesStateService,
    private bonificacionesService: TablaBonificacionesService,
    private archivoService: ArchivoService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: [null, Validators.required],
      descripcion: [null, Validators.required],
    });

    this.bonificacionesState.fetchTablaBonificaciones();
  }

  readonly tablaEffect = effect(() => {
    const tabla = this.bonificacionesState.tablaBonificaciones();
    if (tabla) {
      this.form.patchValue({
        nombre: tabla.nombre,
        descripcion: tabla.descripcion,
      });
      this.tablaBonificacion = tabla;
    }
  });

  guardar(): void {
    if (this.form.invalid) {
      this.message.error('Completa todos los campos obligatorios.');
      return;
    }

    const hayArchivoExistente = this.tablaBonificacion?.urlArchivo;
    const hayNuevoArchivo = this.archivoTemp !== null;

    if (hayArchivoExistente && hayNuevoArchivo) {
      this.modal.confirm({
        nzTitle: '¿Deseas reemplazar el archivo existente?',
        nzContent: `Ya hay un archivo guardado: "${this.tablaBonificacion?.nombreArchivo}". Si continúas, será reemplazado.`,
        nzOkText: 'Sí, continuar',
        nzCancelText: 'Cancelar',
        nzOnOk: () => this.ejecutarGuardado(),
      });
      return;
    }

    this.ejecutarGuardado();
  }

  private ejecutarGuardado(): void {
    const raw: { nombre: string; descripcion: string } = this.form.value;

    const payload = {
      nombre: raw.nombre?.trim() ?? '',
      descripcion: raw.descripcion?.trim() ?? '',
      archivo: this.archivoTemp,
    } as CrearTablaBonificacionesDTO;

    this.guardadoEstado.set(true);

    this.bonificacionesService.crearTablaBonificaciones(payload).subscribe({
      next: () => {
        this.message.success(
          'Tabla de bonificaciones actualizada correctamente'
        );
        this.uploadList = [];
        this.archivoTemp = null;
        this.bonificacionesState.fetchTablaBonificaciones(true);
      },
      error: () => this.message.error('Error al actualizar el registro'),
      complete: () => this.guardadoEstado.set(false),
    });
  }

  mostrarPDF(ruta: string, entidadId: number): void {
    this.archivoService.obtenerArchivo(ruta, entidadId).subscribe((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      this.pdfUrl = objectUrl;
      this.modalVisible = true;
    });
  }

  descargarArchivo(rutaRelativa: string, entidadId: number): void {
    this.archivoService
      .obtenerArchivo(rutaRelativa, entidadId)
      .subscribe((blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = this.tablaBonificacion?.nombreArchivo ?? '';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  eliminarArchivo(): void {
    this.bonificacionesService.eliminarArchivo().subscribe({
      next: () => {
        this.message.success('Archivo eliminado correctamente');
        this.bonificacionesState.fetchTablaBonificaciones(true);
      },
      error: () => {
        this.message.error('Error al eliminar archivo');
      },
    });
  }

  customUploadReq = (item: NzUploadXHRArgs): Subscription => {
    const formData = new FormData();
    formData.append('File', item.file as unknown as File);

    return this.bonificacionesService.uploadTempArchivo(formData).subscribe({
      next: (response: ArchivoTemporalGuardadoDTO) => {
        this.archivoTemp = response;
        item.onSuccess!(response, item.file!, response);
      },
      error: (error) => {
        console.error('Error al subir archivo:', error);
        item.onError!(error, item.file!);
      },
    });
  };

  handleRemove = (file: NzUploadFile): boolean => {
    if (
      file.response?.nombreOriginal &&
      this.archivoTemp?.nombreOriginal === file.response.nombreOriginal
    ) {
      this.archivoTemp = null;
    }
    return true;
  };

  hasUnsavedChanges(): boolean {
    return this.form.dirty || this.archivoTemp !== null;
  }

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
    const allowedTypes = ['application/pdf'];

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
