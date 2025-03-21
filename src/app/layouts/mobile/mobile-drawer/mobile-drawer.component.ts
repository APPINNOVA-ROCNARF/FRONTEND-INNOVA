import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';


import { ModuloDTO } from '../../../core/services/ui-service/Interfaces/moduloDTO';
import { UiService } from '../../../core/services/ui-service/ui.service';

@Component({
  selector: 'app-mobile-drawer',
  standalone:true,
  imports: [
    CommonModule,
    NzDrawerModule,
    NzMenuModule,
    NzIconModule,
    RouterLink
  ],
  templateUrl: './mobile-drawer.component.html',
  styleUrl: './mobile-drawer.component.less'
})
export class MobileDrawerComponent implements OnInit{
  drawerVisible$: Observable<boolean>;
  menuItems: Observable<ModuloDTO[]>;

  constructor(private uiService: UiService) {
    this.drawerVisible$ = this.uiService.drawerVisible$;
    this.menuItems = this.uiService.menu$;
  }

  ngOnInit(): void {
  }

  closeDrawer(): void {
    this.uiService.closeDrawer();
  }
}
