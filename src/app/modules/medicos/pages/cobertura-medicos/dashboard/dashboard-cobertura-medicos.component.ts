import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ConsolidadoVisitasMedicasService } from '../../../services/consolidado-visitas-medicas.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
export interface ConsolidadoMedico {
  seccion: string;
  representante: string;
  fuerzaVenta: string;
  totalMed: number;
  totalEfect: number;
  potencial: number;
  puntos: number;
  rvMed: number;
  rvEfect: number;
  rvPot: number;
  rvPuntos: number;
  aMed: number;
  aEfect: number;
  aPot: number;
  aPuntos: number;
  bMed: number;
  bEfect: number;
  bPot: number;
  bPuntos: number;
  cMed: number;
  cEfect: number;
  cPot: number;
  cPuntos: number;
  pcMed: number;
  pcEfect: number;
  pcPot: number;
  pcPuntos: number;
}

@Component({
  selector: 'app-dashboard-cobertura-medicos',
  standalone: true,
  imports: [NzCardModule, NzGridModule, NzTypographyModule, NzTableModule, CommonModule, NzInputModule, NzFormModule, NzSelectModule, ReactiveFormsModule, NzDatePickerModule, NzButtonModule],
  templateUrl: './dashboard-cobertura-medicos.component.html',
  styleUrl: './dashboard-cobertura-medicos.component.less'
})
export class DashboardCoberturaMedicosComponent implements OnInit{
  data: ConsolidadoMedico[] = [];
  filtrosForm!: FormGroup;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private consolidadoService: ConsolidadoVisitasMedicasService,
    private message: NzMessageService
  ) {}

    ngOnInit(): void {
      this.filtrosForm = this.fb.group({
        rangoFechas: [null, Validators.required],
        seccion: [''],
        representante: [''],
        fuerzaVenta: ['']
      });
    }

    buscar(): void {
      if (this.filtrosForm.invalid) return;
    
      const { rangoFechas, seccion, representante, fuerzaVenta } = this.filtrosForm.value;
      const fechaDesde: Date = rangoFechas[0];
      const fechaHasta: Date = rangoFechas[1];

      this.isLoading = true;
    
      this.consolidadoService
        .getConsolidado(
          fechaDesde,
          fechaHasta,
          seccion,
          representante,
          fuerzaVenta
        )
        .subscribe({
          next: (result) => {
            this.data = result;
          },
          error: (error) => {
            this.message.error("Error al obtener cobertura médica");
            console.log(error)
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    }
}
