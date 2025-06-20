import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-carga-informacion-fox',
  standalone: true,
  imports: [NzButtonModule, NzDividerModule, NzTypographyModule, NzUploadModule, NzIconModule, NzCardModule],
  templateUrl: './carga-informacion-fox.component.html',
  styleUrl: './carga-informacion-fox.component.less'
})
export class CargaInformacionFoxComponent {

}
