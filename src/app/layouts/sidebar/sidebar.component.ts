import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Observable } from 'rxjs';
import { selectSidebarState } from '../../state/ui/selectors';
import { toggleSidebar } from '../../state/ui/actions';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NzLayoutModule, NzMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SidebarComponent {
  isCollapsed$: Observable<boolean>;

  constructor(private store: Store) {
    this.isCollapsed$ = this.store.select(selectSidebarState);
  }

  toggleSidebar() {
    this.store.dispatch(toggleSidebar());
  }
}
