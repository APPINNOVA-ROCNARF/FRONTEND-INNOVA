import { Component } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-carga-parrilla-promocional',
  standalone: true,
  imports: [NzTypographyModule, NzDividerModule],
  templateUrl: './carga-parrilla-promocional.component.html',
  styleUrl: './carga-parrilla-promocional.component.less'
})
export class CargaParrillaPromocionalComponent {

}
