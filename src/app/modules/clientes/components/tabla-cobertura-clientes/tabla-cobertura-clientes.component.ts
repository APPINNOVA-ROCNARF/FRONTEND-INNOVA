import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-tabla-cobertura-clientes',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './tabla-cobertura-clientes.component.html',
  styleUrl: './tabla-cobertura-clientes.component.less'
})
export class TablaCoberturaClientesComponent {

}
