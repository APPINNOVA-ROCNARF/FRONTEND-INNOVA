// vehiculo-modal.component.ts
import { Component, Inject } from '@angular/core';
import { NzModalRef, NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { Vehiculo } from '../../../interfaces/viatico-api-response';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-vehiculo-modal',
  template: `
    <ul>
      <li><strong>Placa:</strong> {{ vehiculo.placa }}</li>
      <li><strong>Modelo:</strong> {{ vehiculo.modelo }}</li>
      <li><strong>Color:</strong> {{ vehiculo.color }}</li>
      <li><strong>Fabricante:</strong> {{ vehiculo.fabricante }}</li>
    </ul>
    <div class="modal-footer" style="text-align: right;">
      <button nz-button nzType="default" (click)="cerrar()">Cerrar</button>
    </div>
  `,
  standalone: true,
  imports: [NzModalModule, NzButtonModule]
})
export class VehiculoModalComponent {
  constructor(
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public vehiculo: Vehiculo
  ) {}

  cerrar(): void {
    this.modalRef.close();
  }
}
