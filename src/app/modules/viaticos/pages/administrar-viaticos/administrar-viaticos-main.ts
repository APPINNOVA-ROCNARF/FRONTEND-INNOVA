import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

@Component({
  selector: 'app-administrar-viaticos-main',
  standalone: true,
  imports: [RouterModule, NzBreadCrumbModule, NzPageHeaderModule],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AdministrarViaticosMainComponent {
}
