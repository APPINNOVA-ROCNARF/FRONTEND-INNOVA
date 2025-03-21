import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MobileDrawerComponent } from "../mobile-drawer/mobile-drawer.component";
import { MobileHeaderComponent } from "../mobile-header/mobile-header.component";

@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzLayoutModule, MobileDrawerComponent, MobileHeaderComponent],
  templateUrl: './mobile-layout.component.html',
  styleUrl: './mobile-layout.component.less'
})
export class MobileLayoutComponent {

}
