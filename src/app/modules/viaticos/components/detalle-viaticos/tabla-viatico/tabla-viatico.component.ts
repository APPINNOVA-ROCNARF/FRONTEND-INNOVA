import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Viatico } from '../../../interfaces/viatico-api-response';
import { ViaticoStateService } from '../../../services/viatico/viatico-state.service';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-tabla-viatico',
  standalone: true,
  imports: [NzTableModule, CommonModule, NzCardModule],
  templateUrl: './tabla-viatico.component.html',
  styleUrl: './tabla-viatico.component.less',
})
export class TablaViaticoComponent implements OnInit{
  @Input() solicitudId!: number;
  viaticos: Viatico[] = [];

  constructor(private viaticoStateService: ViaticoStateService) {}

  ngOnInit(): void {
    this.viaticoStateService.viaticos$.subscribe((data) => {
      this.viaticos = data;
      console.log(data);
    });

    this.viaticoStateService.fetchViaticos(true, this.solicitudId);
  }
}
