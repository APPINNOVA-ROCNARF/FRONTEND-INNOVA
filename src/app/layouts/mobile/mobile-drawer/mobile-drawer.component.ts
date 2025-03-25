import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';

import { ModuloDTO } from '../../../core/services/ui-service/Interfaces/moduloDTO';
import { UiService } from '../../../core/services/ui-service/ui.service';

@Component({
  selector: 'app-mobile-drawer',
  standalone: true,
  imports: [
    CommonModule,
    NzDrawerModule,
    NzMenuModule,
    NzIconModule,
    RouterLink,
    NzNoAnimationModule,
  ],
  templateUrl: './mobile-drawer.component.html',
  styleUrl: './mobile-drawer.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileDrawerComponent implements OnInit {
  drawerVisible$: Observable<boolean>;
  menuItems: ModuloDTO[] = [];
  openedMenu: number | null = null;

  constructor(private uiService: UiService) {
    this.drawerVisible$ = this.uiService.drawerVisible$;
  }

  ngOnInit(): void {
    this.uiService.menu$.subscribe((items) => {
      this.menuItems = items;
    });
  }
  
  openHandler(index: number, isOpen: boolean): void {
    if (isOpen) {
      this.openedMenu = index;
    } else if (this.openedMenu === index) {
      this.openedMenu = null;
    }
  }

  closeDrawer(): void {
    this.uiService.closeDrawer();
  }

  trackByNombre(index: number, item: any): string {
    return item.nombre;
  }
}
