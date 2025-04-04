import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { TableColumn } from './Interfaces/TablaColumna.interface';


@Component({
  selector: 'app-tabla-base',
  standalone: true,
  imports: [NzTableModule, CommonModule, NzIconModule, NzButtonComponent],
  templateUrl: './tabla-base.component.html',
  styleUrls: ['./tabla-base.component.less'],
})
export class TablaBaseComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() pageSize: number = 10;
  @Input() loading: boolean = false;
  @Input() stateTemplate!: TemplateRef<any>;

  // Configuración de acciones
  @Input() showActions: boolean = true;
  @Input() showEditButton: boolean = true;
  @Input() showDeleteButton: boolean = true;

  // Eventos
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onEdit(item: any): void {
    this.edit.emit(item);
  }

  onDelete(id: any): void {
    this.delete.emit(id);
  }
}