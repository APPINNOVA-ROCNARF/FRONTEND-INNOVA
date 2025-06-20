import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SelectItemDTO } from '../../../interfaces/guias-api-response';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FuerzaSelectDTO } from '../../../../../shared/services/fuerzas-service/Interfaces/FuerzaSelectDTO';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-filtros-guias-productos',
  standalone: true,
  imports: [
    NzFormModule,
    CommonModule,
    NzCardModule,
    NzSelectModule,
    NzGridModule,
    FormsModule,
    NzDividerModule,
    NzTypographyModule,
    NzRadioModule,
    NzButtonModule,
  ],
  templateUrl: './filtros-guias-productos.component.html',
  styleUrl: './filtros-guias-productos.component.less',
})
export class FiltrosGuiasProductosComponent {
  @Input() nombres: SelectItemDTO[] = [];
  @Input() marcas: SelectItemDTO[] = [];
  @Input() fuerzas: FuerzaSelectDTO[] = [];

  @Output() filtroCambio = new EventEmitter<{
    nombreTexto: string[] | null;
    marcaTexto: string[] | null;
    fuerzasTexto: string[] | null;
    estadoTexto: 'activo' | 'inactivo' | 'todos' | null;
  }>();

  selectedNombre: string[] | null = null;
  selectedMarca: string[] | null = null;
  selectedFuerzas: string[] | null = null;
  selectedEstado: 'todos' | 'activo' | 'inactivo' = 'todos';

  private emitirFiltros() {
    this.filtroCambio.emit({
      nombreTexto: this.selectedNombre?.length ? this.selectedNombre : null,
      marcaTexto: this.selectedMarca?.length ? this.selectedMarca : null,
      fuerzasTexto: this.selectedFuerzas?.length ? this.selectedFuerzas : null,
      estadoTexto: this.selectedEstado,
    });
  }

  onChange(campo: 'nombre' | 'marca' | 'fuerzas'): void {
    if (campo === 'nombre') {
      this.selectedMarca = null;
      this.selectedFuerzas = null;
    } else if (campo === 'marca') {
      this.selectedNombre = null;
      this.selectedFuerzas = null;
    } else if (campo === 'fuerzas') {
      this.selectedNombre = null;
      this.selectedMarca = null;
    }
    this.emitirFiltros();
  }

  onEstadoChange(): void {
    this.emitirFiltros();
  }
}
