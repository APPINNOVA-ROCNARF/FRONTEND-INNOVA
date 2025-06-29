import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import {
  NzUploadChangeParam,
  NzUploadFile,
  NzUploadModule,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { lastValueFrom, Subscription } from 'rxjs';
import { InformacionFoxService } from '../../../services/informacion-fox/informacion-fox.service';
import { ArchivoTemporalGuardadoDTO, DBFResultadoResponse } from '../../../interfaces/informacion-fox-response';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { FileSizePipe } from '../../../Pipes/size.pipe';

@Component({
  selector: 'app-carga-informacion-fox',
  standalone: true,
  imports: [
    NzButtonModule,
    NzDividerModule,
    NzTypographyModule,
    NzUploadModule,
    NzIconModule,
    NzCardModule,
    CommonModule,
    NzListModule,
    NzAvatarModule,
    NzProgressModule,
    NzIconModule,
    ScrollingModule,
    NzStepsModule,
    FileSizePipe,
  ],
  templateUrl: './carga-informacion-fox.component.html',
  styleUrl: './carga-informacion-fox.component.less',
})
export class CargaInformacionFoxComponent {
  archivosTemp: ArchivoTemporalGuardadoDTO[] = [];
  uploadList: NzUploadFile[] = [];

  stepActual = 0;
  procesando = false;

  constructor(
    private foxService: InformacionFoxService,
    private message: NzMessageService
  ) {}

  customUploadReq = (item: NzUploadXHRArgs): Subscription => {
    const formData = new FormData();
    formData.append('File', item.file as unknown as File);

    return this.foxService.uploadTempArchivo(formData).subscribe({
      next: (
        response: ArchivoTemporalGuardadoDTO[] | ArchivoTemporalGuardadoDTO
      ) => {
        const archivos = Array.isArray(response) ? response : [response];

        archivos.forEach((archivo) => {
          this.archivosTemp.push(archivo);
          this.stepActual = 1;
        });

        item.onSuccess!(response, item.file!, response);
      },
      error: (error) => {
        console.error('Error al subir archivo:', error);
        item.onError!(error, item.file!);
      },
    });
  };

  cancelarCarga(): void {
    this.archivosTemp = [];
    this.uploadList = [];
    this.stepActual = 0;
    this.procesando = false;
  }

async confirmarCarga(): Promise<void> {
  if (this.procesando) return;
  this.procesando = true;
  this.stepActual = 2;
  
  for (const archivo of this.archivosTemp) {
    archivo.progress = 0;
    archivo.status   = 'normal';

    try {
      // Convierte el Observable en Promise y espera su resolución
      const res = await lastValueFrom(
        this.foxService.procesarArchivo(archivo.nombreOriginal, archivo.rutaTemporal)
      ) as DBFResultadoResponse;

      archivo.progress = 100;
      archivo.registrosInsertados = res.registrosInsertados ?? 0;

      if (res.exito) {
        archivo.status = 'success';
        this.message.success(`${archivo.nombreOriginal} procesado correctamente.`);
      } else {
        archivo.status = 'exception';
        this.message.error(`${archivo.nombreOriginal} falló: ${res.mensaje}`);
      }

    } catch (err) {
      archivo.progress = 100;
      archivo.status   = 'exception';
      this.message.error(`${archivo.nombreOriginal} error : `+ err);
    }
  }

  this.procesando = false;
}

getEstadoConfirmacionStep(): 'wait' | 'process' | 'finish' {
  if (this.procesando) return 'process';

  const todosProcesados = this.archivosTemp.length > 0 &&
    this.archivosTemp.every(a => a.status === 'success' || a.status === 'exception');

  return todosProcesados ? 'finish' : 'wait';
}

  getViewportHeight(): number {
    const maxHeight = 400; // Altura máxima del contenedor
    const itemHeight = 100; // Altura de cada item (incluye gap)
    const maxItems = Math.floor(maxHeight / itemHeight);

    // Si hay menos items que el máximo, ajusta la altura
    if (this.archivosTemp.length <= maxItems) {
      return this.archivosTemp.length * itemHeight;
    }

    return maxHeight;
  }

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
    const allowedTypes = ['application/zip', 'application/x-zip-compressed'];

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

  handleRemoveByNombre(nombre: string): void {
    this.archivosTemp = this.archivosTemp.filter(
      (a) => a.nombreOriginal !== nombre
    );
  }
}
