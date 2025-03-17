import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule} from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AsesoresService } from '../../../../shared/services/asesores.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-administrar-viaticos',
  standalone: true,
  imports: [FormsModule, NzSelectModule, CommonModule, NzCardModule, NzFormModule, NzDatePickerModule, NzRadioModule, NzButtonModule],
  templateUrl: './administrar-viaticos.component.html',
  styleUrl: './administrar-viaticos.component.less'
})
export class AdministrarViaticosComponent {
  listaAsesores: string[] = []; 
  asesorSeleccionado: string | null = null;


  constructor(private asesorService: AsesoresService) { }

  ngOnInit(): void {
    this.cargarAsesores();
  }

  cargarAsesores(): void {
    this.asesorService.getNombresAsesores().subscribe(nombres => {
      this.listaAsesores = nombres;
    });
  }
}
