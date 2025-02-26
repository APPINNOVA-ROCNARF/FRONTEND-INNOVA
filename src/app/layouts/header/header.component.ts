import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Observable } from 'rxjs';
import { selectSidebarState } from '../../state/ui/selectors';
import { toggleSidebar } from '../../state/ui/actions';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NzIconModule, CommonModule, NzLayoutModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent {
  isCollapsed$: Observable<boolean>;

  constructor(private store: Store) {
    this.isCollapsed$ = this.store.select(selectSidebarState);
  }

  toggleCollapse() {
    this.store.dispatch(toggleSidebar());
  }
}
