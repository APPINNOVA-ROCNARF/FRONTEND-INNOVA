import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { UiService } from '../../core/services/ui-service/ui.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NzIconModule, CommonModule, NzLayoutModule, NzDropDownModule, NzAvatarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
})
export class HeaderComponent {
  isCollapsed$: Observable<boolean>;

  constructor(private uiService: UiService) {
    this.isCollapsed$ = this.uiService.sidebarOpen$;
  }

  toggleCollapse() {
    this.uiService.toggleSidebar();
  }
}
