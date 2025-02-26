import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSidebarState } from '../../state/ui/selectors';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, NzLayoutModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.less'
})
export class MainLayoutComponent {
  isCollapsed$: Observable<boolean>;

  constructor(private store: Store) {
    this.isCollapsed$ = this.store.select(selectSidebarState);
  }
}
