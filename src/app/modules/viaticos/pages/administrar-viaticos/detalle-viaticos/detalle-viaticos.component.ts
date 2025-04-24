import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';



@Component({
  selector: 'app-detalle-viaticos',
  standalone: true,
  imports: [NzPageHeaderModule, NzIconModule, NzCardModule, NzDescriptionsModule, NzTypographyModule, NzTagModule],
  templateUrl: './detalle-viaticos.component.html',
  styleUrl: './detalle-viaticos.component.less'
})
export class DetalleViaticosComponent {
  viaticoId!: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.viaticoId = +this.route.snapshot.paramMap.get('id')!;
    // Aquí puedes llamar a tu servicio para obtener el viático por ID
  }
}
