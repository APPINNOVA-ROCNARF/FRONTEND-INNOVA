import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { UiService } from '../../../core/services/ui-service/ui.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MobileLayoutComponent } from "../../mobile/mobile-layout/mobile-layout.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, NzLayoutModule, MobileLayoutComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.less'
})
export class MainLayoutComponent {
  isCollapsed$: Observable<boolean>;
  isMobile$: Observable<boolean>;

  constructor(private uiService: UiService) {
    this.isCollapsed$ = this.uiService.sidebarOpen$;
    this.isMobile$ = this.uiService.isMobile$;

  }
  
}
