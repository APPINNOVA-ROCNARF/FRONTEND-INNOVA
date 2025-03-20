import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Observable } from 'rxjs';
import { UiService } from '../../core/services/ui-service/ui.service';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ModuloDTO } from '../../core/services/ui-service/Interfaces/moduloDTO';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    RouterLink,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less',
})
export class SidebarComponent implements OnInit {
  isCollapsed$: Observable<boolean>;
  menuItems: Observable<ModuloDTO[]>;

  constructor(private uiService: UiService) {
    this.isCollapsed$ = this.uiService.sidebarOpen$;
    this.menuItems = this.uiService.menu$;
  }

  ngOnInit(): void {
    this.uiService.loadMenu(); 
  }

  toggleSidebar() {
    this.uiService.toggleSidebar();
  }
}