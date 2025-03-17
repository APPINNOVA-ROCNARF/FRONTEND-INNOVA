import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { Role } from '../../interfaces/roles-permisos.interface';

@Component({
  selector: 'app-tabla-roles',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    NzPopconfirmModule
  ],
  templateUrl: './tabla-roles.component.html',
  styleUrl: './tabla-roles.component.less'
})
export class TablaRolesComponent implements OnInit{
  @Input() roles: Role[] = [];
  @Input() loading = false;
  @Input() showEditButton = true;
  @Input() showDeleteButton = true;
  @Input() pageSize = 10;
  
  @Output() editRole = new EventEmitter<Role>();
  @Output() deleteRole = new EventEmitter<number>();
  @Output() createRole = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
  
  onEditRole(role: Role): void {
    this.editRole.emit(role);
  }
  
  onDeleteRole(id: number): void {
    this.deleteRole.emit(id);
  }
  
  onCreateRole(): void {
    this.createRole.emit();
  }

}
