import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Observable } from 'rxjs';
import { selectSidebarState } from '../../state/ui/selectors';
import { toggleSidebar } from '../../state/ui/actions';
import { RouterLink } from '@angular/router';
import { MENU_ITEMS } from './data/menu-items';
import { MenuItem } from './interfaces/menu-item.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NzLayoutModule, NzMenuModule,RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SidebarComponent {
  isCollapsed$: Observable<boolean>;
  menuItems: MenuItem[] = MENU_ITEMS;


  constructor(private store: Store) {
    this.isCollapsed$ = this.store.select(selectSidebarState);
  }

  toggleSidebar() {
    this.store.dispatch(toggleSidebar());
  }
}
