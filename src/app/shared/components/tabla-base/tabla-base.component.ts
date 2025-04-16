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

  currentPage: number = 1;

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

  get rangoInicio(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangoFin(): number {
    return Math.min(this.currentPage * this.pageSize, this.data.length);
  }

  get paginados(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}