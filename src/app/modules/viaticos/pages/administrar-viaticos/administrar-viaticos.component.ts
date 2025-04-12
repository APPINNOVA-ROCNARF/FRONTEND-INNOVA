import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AsesoresService } from '../../../../shared/services/asesores-service/asesores.service';
import { CommonModule } from '@angular/common';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CicloSelectDTO } from '../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { map, Observable } from 'rxjs';
import { CiclotateService } from '../../../../shared/services/ciclos-service/ciclo-state.service';
import { UsuarioAppSelect } from '../../../../shared/services/asesores-service/Interfaces/asesores-api-response';

@Component({
  selector: 'app-administrar-viaticos',
  standalone: true,
  imports: [
    FormsModule,
    NzSelectModule,
    CommonModule,
    NzCardModule,
    NzFormModule,
    NzDatePickerModule,
    NzRadioModule,
    NzButtonModule,
    NzTypographyModule,
    NzIconModule
  ],
  templateUrl: './administrar-viaticos.component.html',
  styleUrl: './administrar-viaticos.component.less',
})
export class AdministrarViaticosComponent {
  listaAsesores: UsuarioAppSelect[] = [];
  asesorSeleccionado: string | null = null;
  cicloSeleccionado: number | null = null;
  estadoSeleccionado: number | null = null;

  //Observables Ciclos
  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Observable<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;


  constructor(private asesorService: AsesoresService, private cicloState: CiclotateService) {}

  ngOnInit(): void {
    this.cargarAsesores();
    this.cargarCiclos();
  }

  cargarAsesores(): void {
    this.asesorService.getAsesores().subscribe(data => {
      this.listaAsesores = data;
    })
  }

  cargarCiclos(): void {
    this.ciclos$ = this.cicloState.ciclos$;
    this.ciclosLoading$ = this.cicloState.getCiclosLoading();
    this.cicloState.fetchCiclos();

    this.cicloOpciones$ = this.ciclos$.pipe(
      map((ciclos) =>
        ciclos.map((c) => ({
          label: c.nombre,
          value: c.id
        }))
      )
    );
  }
}
