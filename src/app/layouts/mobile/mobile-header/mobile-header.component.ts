import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { UiService } from '../../../core/services/ui-service/ui.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [NzIconModule, CommonModule, NzLayoutModule, NzDropDownModule, NzAvatarModule],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.less'
})
export class MobileHeaderComponent {
  isCollapsed$: Observable<boolean>;
  isMobile$: Observable<boolean>;


  constructor(private uiService: UiService, private authService: AuthService, private router: Router) {
    this.isCollapsed$ = this.uiService.sidebarOpen$;
    this.isMobile$ = this.uiService.isMobile$;
  }

  toggleCollapse() {
    this.uiService.toggleSidebar();
  }

  logout(){
    this.authService.logout();
      this.router.navigate(['/login']);
  }
}
