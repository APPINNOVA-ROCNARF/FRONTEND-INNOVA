import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { Viatico } from '../../../interfaces/viatico-api-response';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
    selector: 'app-campos-rechazados-modal',
    standalone: true,
    imports: [CommonModule, NzTableModule],
    template: `
<nz-table
  [nzData]="viatico.camposRechazados || []"
  [nzShowPagination]="false"
  [nzBordered]="false"
  nzSize="small"
>
  <thead>
    <tr>
      <th>Campo</th>
      <th>Comentario</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let campo of viatico.camposRechazados">
      <td>{{ campo.campo }}</td>
      <td>{{ campo.comentario }}</td>
    </tr>
  </tbody>
</nz-table>
  `,
})
export class CamposRechazadoModalComponent {
    viatico: Viatico;

    constructor(@Inject(NZ_MODAL_DATA) public data: Viatico) {
        this.viatico = data;
    }

}
