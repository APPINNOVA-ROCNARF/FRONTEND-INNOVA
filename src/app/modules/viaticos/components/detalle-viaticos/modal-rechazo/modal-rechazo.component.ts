import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-rechazo',
  standalone: true,
  imports: [
    NzModalModule,
    NzSelectModule,
    NzInputModule,
    NzListModule,
    NzButtonModule,
    NzIconModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './modal-rechazo.component.html',
  styleUrl: './modal-rechazo.component.less',
})
export class ModalRechazoComponent {
  @Input() visible = false;
  @Input() viaticoId!: number;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{
    id: number;
    comentario?: string;
    camposRechazados?: { campo: string; comentario: string }[];
  }>();

  campoRechazado: string | null = null;
  comentarioTemporal: string = '';
  rechazosTemp: { campo: string; comentario: string }[] = [];
  
  camposViatico = [
    'Proveedor',
    'Monto',
    'Número de Factura',
    'Categoría',
  ];

  cerrar(): void {
    this.cancel.emit();
  }

  confirmar(): void {
    this.confirm.emit({
      id: this.viaticoId,
      camposRechazados: this.rechazosTemp.length > 0 ? this.rechazosTemp : undefined
    });
  }

  agregarCampoRechazado(): void {
    if (!this.campoRechazado || !this.comentarioTemporal.trim()) {
      return;
    }
    this.rechazosTemp.push({
      campo: this.campoRechazado,
      comentario: this.comentarioTemporal.trim(),
    });
    this.campoRechazado = null;
    this.comentarioTemporal = '';
  }

  eliminarCampoRechazado(index: number): void {
    this.rechazosTemp.splice(index, 1);
  }
}
