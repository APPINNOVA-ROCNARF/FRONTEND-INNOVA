import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { GuiaProductoService } from '../../../services/guias-producto/guias.service';
import { ArchivoTemporalGuardadoDTO } from '../../../interfaces/guias-api-response';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-formulario-guias-producto',
  standalone: true,
  imports: [NzGridModule, NzDividerModule, NzTypographyModule, ReactiveFormsModule, NzCardModule,NzIconModule, NzFormModule, NzInputModule, NzSelectModule, NzUploadModule, NzButtonModule, NzTableModule],
  templateUrl: './formulario-guias-producto.component.html',
  styleUrl: './formulario-guias-producto.component.less'
})
export class FormularioGuiasProductoComponent implements OnInit {
  form!: FormGroup;
  archivos: ArchivoTemporalGuardadoDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private guiaService: GuiaProductoService
  ){}

  ngOnInit(){
        this.form = this.fb.group({
      marca: ['', Validators.required],
      nombre: ['', Validators.required],
      fuerzaId: [null, Validators.required],
      urlVideo: ['']
    });
  }


onCustomUpload = (item: NzUploadXHRArgs): Subscription => {
  const file = item.file.originFileObj as File;
  const formData = new FormData();
  formData.append('File', file);

  return this.guiaService.uploadTempArchivo(formData).subscribe({
    next: (res: ArchivoTemporalGuardadoDTO) => {
      this.archivos = [...this.archivos, res];
      item.onSuccess?.(res, item.file, {} as XMLHttpRequest);
    },
    error: (err) => {
      item.onError?.(err, item.file);
    }
  });
};

}
