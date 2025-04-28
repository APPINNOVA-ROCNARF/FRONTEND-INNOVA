import { Component, Input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { UiService } from '../../../core/services/ui-service/ui.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzIconModule,
    CommonModule,
    NzLayoutModule,
    NzDropDownModule,
    NzAvatarModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
})
export class HeaderComponent {
  @Input() isMobile: boolean = false;

  isCollapsed$: Observable<boolean>;
  isMobile$: Observable<boolean>;

  constructor(
    private uiService: UiService,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.isCollapsed$ = this.uiService.sidebarOpen$;
    this.isMobile$ = this.uiService.isMobile$;
  }

  toggleCollapse() {
    this.uiService.toggleSidebar();
  }

  logout(): void {
    this.authService.logout();
    this.uiService.clearMenu();
    this.message.success('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
  }
}
