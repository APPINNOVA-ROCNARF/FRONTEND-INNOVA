import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Observable } from 'rxjs';
import { UiService } from '../../core/services/ui-service/ui.service';
import { RouterLink } from '@angular/router';
import { MENU_ITEMS } from './data/menu-items';
import { MenuItem } from './interfaces/menu-item.interface';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NzLayoutModule, NzMenuModule, NzIconModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less',
})
export class SidebarComponent {
  isCollapsed$: Observable<boolean>;
  menuItems: MenuItem[] = MENU_ITEMS;

  constructor(private uiService: UiService) {
    this.isCollapsed$ = this.uiService.sidebarOpen$;
  }

  toggleSidebar() {
    this.uiService.toggleSidebar();
  }
}
