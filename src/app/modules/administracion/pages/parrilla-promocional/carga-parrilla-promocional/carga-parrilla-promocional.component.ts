import { Component, effect, OnInit, signal } from '@angular/core';
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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadModule,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { ParrillaPromocionalStateService } from '../../../services/parrilla-promocional/parrilla-state.service';
import { ParrillaPromocionalService } from '../../../services/parrilla-promocional/parrilla.service';
import { CommonModule } from '@angular/common';
import {
  ArchivoTemporalGuardadoDTO,
  ParrillaPromocionalDTO,
} from '../../../interfaces/parrilla-api.response';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ArchivoService } from '../../../../../core/services/archivo-service/archivo.service';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CanExitWithUnsavedChanges } from '../../../../../core/guards/unsaved-changes';

@Component({
  selector: 'app-carga-parrilla-promocional',
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
    NzPopconfirmModule
  ],
  templateUrl: './carga-parrilla-promocional.component.html',
  styleUrl: './carga-parrilla-promocional.component.less',
})
export class CargaParrillaPromocionalComponent implements OnInit, CanExitWithUnsavedChanges {
  form!: FormGroup;

  archivoTemp: ArchivoTemporalGuardadoDTO | null = null;
  uploadList: NzUploadFile[] = [];

  parrilla: ParrillaPromocionalDTO | null = null;

  modalVisible = false;
  pdfUrl = '';

  guardadoEstado = signal(false);

  constructor(
    private fb: FormBuilder,
    private parrillaState: ParrillaPromocionalStateService,
    private parrillaService: ParrillaPromocionalService,
    private archivoService: ArchivoService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: [null, Validators.required],
      descripcion: [null, Validators.required],
    });

    this.parrillaState.fetchParrilla();
  }

  readonly parrillaEffect = effect(() => {
    const parrilla = this.parrillaState.parrilla();
    if (parrilla) {
      this.form.patchValue({
        nombre: parrilla.nombre,
        descripcion: parrilla.descripcion,
      });
      this.parrilla = parrilla;
    }
  });

  guardar(): void {
    if (this.form.invalid) {
      this.message.error('Completa todos los campos obligatorios.');
      return;
    }

    const hayArchivoExistente = this.parrilla?.urlArchivo;
    const hayNuevoArchivo = this.archivoTemp !== null;

    if (hayArchivoExistente && hayNuevoArchivo) {
      this.modal.confirm({
        nzTitle: '¿Deseas reemplazar el archivo existente?',
        nzContent: `Ya hay un archivo guardado: "${this.parrilla?.nombreArchivo}". Si continúas, será reemplazado.`,
        nzOkText: 'Sí, continuar',
        nzCancelText: 'Cancelar',
        nzOnOk: () => this.ejecutarGuardado(),
      });
      return;
    }

    this.ejecutarGuardado();
  }

  private ejecutarGuardado(): void {
    const payload = {
      ...this.form.value,
      archivo: this.archivoTemp,
    };

    this.guardadoEstado.set(true);

    this.parrillaService.crearParrilla(payload).subscribe({
      next: () => {
        this.message.success('Parrilla Promocional actualizada correctamente');
        this.uploadList = [];
        this.archivoTemp = null;
        this.parrillaState.fetchParrilla(true);
      },
      error: () => this.message.error('Error al actualizar el registro'),
      complete: () => this.guardadoEstado.set(false),
    });
  }

  mostrarPDF(ruta: string): void {
    this.archivoService.obtenerPdf(ruta).subscribe((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      this.pdfUrl = objectUrl;
      this.modalVisible = true;
    });
  }

  descargarArchivo(rutaRelativa: string): void {
    const url = this.archivoService.getUrlAbsoluta(rutaRelativa, 'descargar');

    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  eliminarArchivo(): void {
    this.parrillaService.eliminarArchivo().subscribe({
      next: () => {
        this.message.success('Archivo eliminado correctamente');
        this.parrillaState.fetchParrilla(true);
      },
      error: () => {
        this.message.error('Error al eliminar archivo');
      }
    })
  }

  customUploadReq = (item: NzUploadXHRArgs): Subscription => {
    const formData = new FormData();
    formData.append('File', item.file as unknown as File);

    return this.parrillaService.uploadTempArchivo(formData).subscribe({
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
