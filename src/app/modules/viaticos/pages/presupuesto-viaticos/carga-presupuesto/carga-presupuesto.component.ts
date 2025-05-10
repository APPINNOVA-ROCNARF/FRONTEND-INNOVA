import { Component, OnInit, Signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CicloSelectDTO } from '../../../../../shared/services/ciclos-service/Interfaces/CicloSelectDTO';
import { map, Observable } from 'rxjs';
import { CiclotateService } from '../../../../../shared/services/ciclos-service/ciclo-state.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import type { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PresupuestoRow } from '../../../interfaces/presupuesto-data';
import { ArchivoPresupuestoService } from '../../../services/presupuesto/archivo-presupuesto.service';

@Component({
  selector: 'app-presupuesto-viaticos',
  standalone: true,
  imports: [
    NzCardModule,
    NzUploadModule,
    NzIconModule,
    NzSelectModule,
    NzStepsModule,
    CommonModule,
    FormsModule,
    NzTableModule,
    NzResultModule,
    NzTypographyModule,
    NzDividerModule,
    NzButtonModule,
  ],
  templateUrl: './carga-presupuesto.component.html',
  styleUrl: './carga-presupuesto.component.less',
})
export class PresupuestoViaticosComponent implements OnInit {
  cicloSeleccionado: number | null = null;
  ciclos$!: Observable<CicloSelectDTO[]>;
  ciclosLoading$!: Signal<boolean>;
  cicloOpciones$!: Observable<{ label: string; value: number }[]>;

  currentStep = 0;
  archivoCargado = false;
  datos: PresupuestoRow[] = [];

  totalMovilidad = 0;
  totalHospedaje = 0;
  totalAlimentacion = 0;
  totalGeneral = 0;

  constructor(
    private message: NzMessageService,
    private cicloState: CiclotateService,
    private archivoService: ArchivoPresupuestoService
  ) {}

  ngOnInit(): void {
    this.ciclos$ = this.cicloState.ciclos$;
    this.ciclosLoading$ = this.cicloState.getCiclosLoading();
    this.cicloState.fetchCiclos();

    this.cicloOpciones$ = this.ciclos$.pipe(
      map((ciclos) => {
        const cicloActivo = ciclos.find((c) => c.estado);
        if (cicloActivo) {
          this.cicloSeleccionado = cicloActivo.id;
        }

        return ciclos.map((c) => ({
          label: c.nombre,
          value: c.id,
        }));
      })
    );
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const archivo = file as unknown as File;
  
    if (!this.archivoService.validarTipo(archivo)) {
      this.message.error('Solo se permiten archivos .xlsx o .csv');
      return false;
    }
  
    this.archivoService.procesar(archivo)
      .then((data) => {
        this.datos = data;
        this.archivoCargado = true;
        this.currentStep = 1;
        this.calcularTotales();
      })
      .catch((error) => {
        this.message.error(error.message || 'No se pudo procesar el archivo.');
      });
  
    return false;
  };
  
  calcularTotales(): void {
    this.totalMovilidad = this.datos.reduce(
      (acc, row) => acc + (row['CUPO MOVILIDAD'] || 0),
      0
    );
    this.totalHospedaje = this.datos.reduce(
      (acc, row) => acc + (row['CUPO HOSPEDAJE'] || 0),
      0
    );
    this.totalAlimentacion = this.datos.reduce(
      (acc, row) => acc + (row['CUPO ALIMENTACION'] || 0),
      0
    );
    this.totalGeneral =
      this.totalMovilidad + this.totalHospedaje + this.totalAlimentacion;
  }

  cancelarCarga(): void {
    this.archivoCargado = false;
    this.currentStep = 0;
  }

  confirmarcarga(): void {
    this.currentStep = 2;
  }

}
